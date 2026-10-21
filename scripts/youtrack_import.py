#!/usr/bin/env python3
"""Import docs/management/youtrack-import.csv into YouTrack via REST API.

Usage:
    export YOUTRACK_URL=https://medrisk.youtrack.cloud
    export YOUTRACK_TOKEN=<permanent token>   # Avatar -> Account Security -> Tokens
    python3 scripts/youtrack_import.py --dry-run   # check mapping, create nothing
    python3 scripts/youtrack_import.py             # import (idempotent: re-running
                                                   # updates already-imported issues)

The token needs these YouTrack permissions: Read basic user info, Users, Projects,
Issues: Create/Modify; project-admin permissions for custom fields.

Rows are processed strictly in CSV order, so issue IDs match DIP-1 .. DIP-46.
The script is idempotent: existing issues are updated in place, missing ones are
created, and a creation must land on the expected DIP-<n> ID (the script aborts
otherwise, because YouTrack never renumbers issues).

One documented exception: the task of CSV row 43 ("Supervisor review of M1-M4
results") was created during the first import on 19 Oct 2026 and later removed
from the tracker, so the ID DIP-43 cannot be used any more - the task was
re-created on 22 Oct 2026 as DIP-47 (see ID_OVERRIDES and the backlog note).

Field payloads follow the real medrisk.youtrack.cloud schema:
  Priority   SingleEnumIssueCustomField / {"name": "<enum>"}
  State      StateIssueCustomField      / {"name": "To do"|"In Progress"|"Done"}
  Assignee   SingleUserIssueCustomField / {"login": "<login>"}   (users only —
             project teams are rejected by the API, see "Team" handling below)
  Milestone  TextIssueCustomField       / {"text": "M0"}
  Due Date   not settable via the issues API (the REST date format is rejected);
             set through the commands API: POST /api/commands "Due Date <YYYY-MM-DD>"
"""
import argparse
import csv
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

BASE = os.environ.get("YOUTRACK_URL", "https://medrisk.youtrack.cloud").rstrip("/")
TOKEN = os.environ.get("YOUTRACK_TOKEN", "")
PROJECT_SHORT = "DIP"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(ROOT, "docs", "management", "youtrack-import.csv")

# CSV assignee name -> YouTrack login (see youtrack-backlog.md, step 2).
# The mapping deliberately uses logins and not e-mail addresses: the repository
# is public and must not contain the personal addresses of the team members.
NAME_TO_LOGIN = {
    "Muslim Syzdykov": "admin",
    "Zarina Kosaman": "zarinakosaman9",
    "Sara Mukhammad": "mukhammadsara07",
    "Aigerim Bakiyeva": "abakiyeva",
}
# CSV value for collective tasks -> the login of the coordinating lead
TEAM_LEAD_LOGIN = "admin"
# CSV row number -> YouTrack ID, where it deviates from the row order.
# YouTrack never renumbers issues: the task of row 43 was created on 19 Oct
# 2026 and later removed from the tracker, so DIP-43 was already taken by the
# counter. The task was re-created on 22 Oct 2026 as DIP-47; the deviation is
# recorded in docs/management/youtrack-backlog.md.
ID_OVERRIDES = {43: "DIP-47"}


def api(method, path, payload=None, fields="summary", ok=(200, 201)):
    url = BASE + path
    if "fields=" not in url and fields:
        url += ("&" if "?" in url else "?") + "fields=" + fields
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers={
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + TOKEN,
    })
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            body = r.read()
            return (r.status, json.loads(body) if body else None)
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        try:
            return (e.code, json.loads(body))
        except Exception:
            return (e.code, {"error": body[:300]})
    except Exception as e:  # network hiccup -> one retry
        time.sleep(2)
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                body = r.read()
                return (r.status, json.loads(body) if body else None)
        except Exception:
            return (0, {"error": str(e)})


def find_project():
    for path in ("/api/admin/projects", "/api/projects"):
        status, projects = api("GET", path, fields="id,name,shortName")
        if status == 200:
            for p in projects:
                if p.get("shortName") == PROJECT_SHORT:
                    return p
            return None
    return None


def load_users():
    """login -> {name, email} map for all registered users."""
    status, users = api("GET", "/api/users", fields="login,name,email")
    if status != 200:
        sys.exit(f"Cannot list users ({status}): {users}")
    return {u["login"]: {"name": u.get("name", ""), "email": u.get("email") or ""}
            for u in users if u.get("login")}


def resolve_assignee(name, logins):
    """CSV assignee -> YouTrack login, or None (left unassigned + warned).

    YouTrack rejects an account as an assignee value when it has no e-mail
    address or no access to the project (HTTP 400 "invalid value", checked on
    22 Oct 2026), so such an account leaves the issue unassigned - the same
    behaviour as the first import.
    """
    login = TEAM_LEAD_LOGIN if name == "Team" else NAME_TO_LOGIN.get(name)
    if login is None:
        print(f"  warn: no YouTrack account for {name!r} — issue will be unassigned")
        return None
    user = logins.get(login)
    if user is None:
        print(f"  warn: YouTrack account {login!r} for {name!r} is not registered — "
              "issue will be unassigned")
        return None
    if not user["email"]:
        print(f"  warn: YouTrack account {login!r} has no e-mail address "
              f"(YouTrack requires one) — issue will be unassigned "
              f"(assign {name!r} manually)")
        return None
    return login


def expected_id(row_number):
    """YouTrack ID of a CSV row (the ID_OVERRIDES deviation is explicit)."""
    return ID_OVERRIDES.get(row_number, f"{PROJECT_SHORT}-{row_number}")


def build_description(row, assignee_login):
    desc = row["Description"]
    if assignee_login is None:
        desc += "\n\n**Assignee:** (not assigned automatically — set it manually)"
    return desc


def build_payload(row, assignee_login, project_id, for_create):
    custom_fields = [
        {"$type": "SingleEnumIssueCustomField", "name": "Priority",
         "value": {"name": row["Priority"]}},
        {"$type": "StateIssueCustomField", "name": "State",
         "value": {"name": row["State"]}},
        {"$type": "TextIssueCustomField", "name": "Milestone",
         "value": {"text": row["Milestone"]}},
    ]
    if assignee_login:
        custom_fields.append(
            {"$type": "SingleUserIssueCustomField", "name": "Assignee",
             "value": {"login": assignee_login}})
    payload = {
        "summary": row["Summary"],
        "description": build_description(row, assignee_login),
        "customFields": custom_fields,
    }
    if for_create:
        payload["project"] = {"$type": "Project", "id": project_id}
    return payload


def set_due_date(issue_id, due_date):
    """Due Date is a date custom field; the issues API rejects every REST date
    format, so set it through the commands API."""
    status, resp = api("POST", "/api/commands", fields=None,
                       payload={"query": f"Due Date {due_date}",
                                "issues": [{"id": issue_id}]})
    return status == 200, resp


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true",
                    help="print the plan and check project/users, create nothing")
    args = ap.parse_args()

    if not TOKEN:
        sys.exit("Set YOUTRACK_TOKEN (Avatar -> Account Security -> Tokens -> New token).")

    project = find_project()
    if not project:
        sys.exit(f"Project {PROJECT_SHORT} not found (checked /api/admin/projects "
                 "and /api/projects).")
    print(f"Project: {project['name']} ({project['shortName']}, id={project['id']})")

    logins = load_users()
    print("Registered users: " + ", ".join(
        f"{login} ({user['name']})" for login, user in sorted(logins.items())))

    with open(CSV_PATH, encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    print(f"{len(rows)} tasks in {os.path.relpath(CSV_PATH, ROOT)}")

    # existing issues in the project -> idReadable (idempotency + ID verification)
    existing = {}
    status, all_issues = api("GET", "/api/issues?$top=500",
                             fields="id,idReadable,summary")
    if status == 200:
        existing = {i["idReadable"]: i for i in (all_issues or [])
                    if i.get("idReadable", "").startswith(PROJECT_SHORT + "-")}
    else:
        print(f"  warn: cannot list issues ({status}): {all_issues}")
    print(f"Already in YouTrack: {len(existing)} issue(s)")

    if args.dry_run:
        for i, r in enumerate(rows, 1):
            login = resolve_assignee(r["Assignee"], logins) or "-"
            issue_id = expected_id(i)
            action = "update" if issue_id in existing else "create"
            print(f"  {action:6} {issue_id:<7} {r['Priority']:<9} "
                  f"{r['State']:<11} {r['Milestone']}  due {r['Due date']}  "
                  f"assignee {r['Assignee']} -> {login}")
        print("Dry run OK — re-run without --dry-run to import.")
        return

    created, updated, failed = [], [], []
    for i, row in enumerate(rows, 1):
        expected = expected_id(i)
        assignee = resolve_assignee(row["Assignee"], logins)
        exists = expected in existing

        payload = build_payload(row, assignee, project["id"], for_create=not exists)
        if exists:
            status, resp = api("POST", f"/api/issues/{expected}",
                               payload, fields="id,idReadable")
        else:
            status, resp = api("POST", "/api/issues", payload,
                               fields="id,idReadable")

        if status not in (200, 201) and assignee:
            # the assignee was rejected (e.g. the account has no access to the
            # project yet): retry the same issue without the Assignee field,
            # the task is then assigned manually
            print(f"  warn: assignee {assignee!r} rejected ({status}) — "
                  f"{expected} is written without an assignee")
            assignee = None
            payload = build_payload(row, None, project["id"], for_create=not exists)
            if exists:
                status, resp = api("POST", f"/api/issues/{expected}",
                                   payload, fields="id,idReadable")
            else:
                status, resp = api("POST", "/api/issues", payload,
                                   fields="id,idReadable")

        if status not in (200, 201):
            # never fall back to a weaker payload: a successful-but-wrong create
            # would consume an issue number and break DIP-1..DIP-46 ordering
            failed.append(expected)
            print(f"  FAILED {expected}: {status} {resp}")
            break
        if resp.get("idReadable") != expected:
            failed.append(expected)
            print(f"  FAILED {expected}: got {resp.get('idReadable')} — "
                  "ID sequence is broken (a stray issue was created earlier?); "
                  "fix the project ID counter before re-running")
            break

        ok, due_resp = set_due_date(resp["id"], row["Due date"])
        if not ok:
            failed.append(expected)
            print(f"  FAILED {expected}: due date not set: {due_resp}")
            break

        (updated if exists else created).append(expected)
        print(f"  {expected} {'updated' if exists else 'created':7} "
              f"{row['Summary']}")
        time.sleep(0.2)

    print(f"\nCreated: {len(created)}  Updated: {len(updated)}  Failed: {len(failed)}")
    if failed:
        sys.exit(1)
    print(f"Import order verified: {PROJECT_SHORT}-1..{PROJECT_SHORT}-{len(rows)}"
          + ("".join(f" (row {row_no} -> {issue_id})"
                     for row_no, issue_id in sorted(ID_OVERRIDES.items()))
             if ID_OVERRIDES else ""))

    # final verification: every expected field must be set
    status, issues = api("GET", "/api/issues?$top=500",
                         fields="idReadable,summary,"
                                "customFields(name,value($type,name,text,login))")
    problems = []
    by_id = {i["idReadable"]: i for i in (issues or [])}
    for i, row in enumerate(rows, 1):
        expected = expected_id(i)
        issue = by_id.get(expected)
        if not issue:
            problems.append(f"{expected} missing")
            continue
        got = {c["name"]: c.get("value") for c in issue.get("customFields", [])}
        if (got.get("State") or {}).get("name") != row["State"]:
            problems.append(f"{expected} state={got.get('State')}")
        if (got.get("Priority") or {}).get("name") != row["Priority"]:
            problems.append(f"{expected} priority={got.get('Priority')}")
        if (got.get("Milestone") or {}).get("text") != row["Milestone"]:
            problems.append(f"{expected} milestone={got.get('Milestone')}")
    if problems:
        print("Verification problems:\n  " + "\n  ".join(problems))
        sys.exit(1)
    print("Verification OK: state, priority and milestone match the CSV for all "
          f"{len(rows)} issues.")


if __name__ == "__main__":
    main()
