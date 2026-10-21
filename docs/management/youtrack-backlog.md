# YouTrack Task Backlog — MedRisk

**Purpose:** import-ready backlog.
**Project:** [medrisk.youtrack.cloud/projects/DIP](https://medrisk.youtrack.cloud/projects/DIP) — created;
**45 of the 46 tasks imported on 19 Oct 2026** (automated: `scripts/youtrack_import.py`, manual: guide below);
the last task was added on 22 Oct 2026 (see the note on the task IDs below).
The script is idempotent — re-run it after editing the CSV to keep YouTrack in sync.
Verified: the IDs run DIP-1 … DIP-46 (with one documented exception below), and state,
priority, milestone and due date match the CSV for every issue.

> **Note on the task IDs (22 Oct 2026):** YouTrack never renumbers issues. The task of
> CSV row 43 ("Supervisor review of M1-M4 results") was created during the first import
> on 19 Oct 2026 and later removed from the tracker, so the ID `DIP-43` could not be
> reused. The task was re-created on 22 Oct 2026 as **`DIP-47`**; the mapping is
> recorded in the script (`ID_OVERRIDES`) and the row order of the CSV stays the source
> of truth. Every other task keeps its `DIP-1 … DIP-46` ID, so the tracker holds all
> 46 tasks.

> **Note on assignees:** the YouTrack *Assignee* field accepts users only, so the four
> `Team` rows (DIP-6, DIP-10, DIP-41, DIP-44) are assigned to the coordinating lead
> (Muslim, login `admin`). The supervisor review task (CSV row 43, tracked as `DIP-47`)
> is **left unassigned**: YouTrack rejects the supervisor's account `abakiyeva` as an
> assignee value, because the account has no access to the DIP project yet. After the
> account is added to the project, a re-run of the import script assigns the task.

## How to import the backlog into YouTrack (step by step)

> Works for youtrack.cloud and self-hosted YouTrack 2023+. Admin rights or project-admin
> rights are required for steps 1–3.

**Step 1 — Create the project**
1. YouTrack → `+ New` (or Administration → Projects → `+`) → **Create Project**.
2. Name: `MedRisk`. **ID prefix: `DIP`** — this is important: branch and commit names in
   Git use these IDs (see CONTRIBUTING.md).
3. Workflow: choose one whose states are close to `To do → In Progress → Done`
   (this is the workflow the DIP project actually uses — the import relies on these
   exact option names).

**Step 2 — Prepare fields and users**
1. Invite the team first: Administration → Users → `+`. The project uses the accounts
   `admin` (Muslim), `zarinakosaman9` (Zarina) and `mukhammadsara07` (Sara) — the password
   reset e-mail addresses are not kept in the repository, which is **public**. Otherwise the
   *Assignee* column will not map (YouTrack matches by login/e-mail).
2. Custom field **Milestone** (for the `M0…M6` column): project settings →
   **Custom Fields** → `+` → type **State field** (or Text) → name `Milestone`,
   attach to issue type *Issue*.
3. Check that **Priority** (Critical/Major/Normal/Minor) and **State**
   (To do/In Progress/Done) already exist in the project workflow —
   CSV values must match the existing option names exactly.

**Step 3 — Import the CSV**
1. Administration → **Import Data from Other Tracker** → `+ Create Import Configuration`.
2. Format: **CSV**. Upload `docs/management/youtrack-import.csv` from the repository.
   Delimiter: comma. Encoding: UTF-8. (Dates are already in `YYYY-MM-DD`.)
3. Map the columns:
   | CSV column | YouTrack field |
   |---|---|
   | Summary | Summary |
   | Description | Description |
   | Assignee | Assignee |
   | Priority | Priority |
   | State | State |
   | Milestone | Milestone (custom field from step 2) |
   | Due date | Due Date |
4. **Preview** the first rows → check mapping → **Import**.

**Step 4 — Verify**
1. The CSV is sorted by ID, so a fresh `DIP` project numbers the issues **DIP-1 … DIP-46**
   in exactly this order. Check that issue numbers match the table (DIP-44 = interviews,
   DIP-45 = YouTrack setup, DIP-46 = GitHub push).
2. If the numbering is off (e.g. a test issue was created before the import), fix it
   *before* the team starts branching: Administration → Projects → DIP → **ID** →
   change the number of the next issue, delete the mismatched issues and re-import.
3. Add the project link to the root `README.md` (section «Task tracking») and commit.

**Manual fallback:** if import is not possible, create tasks from the table below —
46 tasks, fields: summary, description with acceptance criteria, assignee, priority,
state, milestone, due date. Order does not matter then.

Suggested project settings:
- **Project name:** MedRisk, **ID prefix:** `DIP`
- **States:** To do → In Progress → Done
- **Priorities:** Critical / Major / Normal / Minor
- Custom fields: `Milestone` (M0…M6)

Rules: every task has an assignee, an acceptance criterion and a deadline; the task ID goes
into the branch name and the commit/PR title (`DIP-12: …`). A task is Done only when its
acceptance criteria are met.

---

## M0 — Concept (24 Oct 2026) — DONE via this repository

| ID | Summary | Assignee | Priority | Acceptance criteria |
|---|---|---|---|---|
| DIP-1 | Create repository, README, .gitignore, structure | Muslim | Critical | Repo exists with structure per README; no secrets committed |
| DIP-2 | Project proposal & scope | Muslim | Critical | `docs/proposal/` approved by supervisor |
| DIP-3 | Literature review (12+ sources, 8+ scientific) | Zarina | Critical | Table with ≥12 sources; gaps identified |
| DIP-4 | Existing system comparison (3–5 systems, 6–10 criteria) | Muslim | Major | Matrix with ≥5 systems × ≥9 criteria + evidence |
| DIP-5 | Technology comparison (3+ decisions, 2–3 alternatives) | Muslim | Major | 6 decisions documented with rationale |
| DIP-6 | Requirements spec + acceptance criteria | All | Critical | Every Must requirement verifiable; supervisor reviewed |
| DIP-7 | Architecture diagrams (context, use case, component) + description | Muslim | Critical | Editable `.mmd` + SVG exports committed |
| DIP-8 | HTML prototype of key scenarios | Sara | Critical | 4 mockups committed; supervisor walkthrough done |
| DIP-9 | Verification & evaluation plan | Zarina | Critical | Metrics, baselines, thresholds defined |
| DIP-10 | Project management: roles, milestones, risks | All | Major | Doc committed; team confirmed roles |
| DIP-11 | YouTrack backlog preparation | Muslim | Major | Backlog + CSV import file committed |
| DIP-44 | Evidence of relevance: 3–5 interviews with user representatives (protocol in `docs/evidence/user-research.md`) | All | Critical | Findings log filled; verified findings vs assumptions marked |
| DIP-45 | Create YouTrack project, import backlog, add link to README | Muslim | Critical | YouTrack link live in README; tasks DIP-1…DIP-46 created |
| DIP-46 | Push repository to GitHub, grant access to team | Muslim | Critical | Repo link live in README; Zarina (`haweeks`) and Sara (`Sierra07-w`) invited as collaborators; supervisor access not required — team decision |

## M1 — Data & baselines (until 15 Nov 2026)

| ID | Summary | Assignee | Priority | Deadline | Acceptance criteria |
|---|---|---|---|---|---|
| DIP-12 | Download scripts for UCI Cleveland & Pima datasets | Zarina | Critical | 25 Oct | `data/download.py` pins URLs + checksums; raw data git-ignored |
| DIP-13 | Data-quality report (missingness, imbalance, biases) | Zarina | Critical | 01 Nov | `docs/ml/data-quality-report.md` with statistics and decisions |
| DIP-14 | Preprocessing pipeline (impute, encode, split, seed) | Zarina | Critical | 05 Nov | Reproducible pipeline; unit tests pass; no leakage (reviewed) |
| DIP-15 | Logistic-regression baseline + metrics | Zarina | Critical | 08 Nov | AUC/Brier/calibration committed to `ml/reports/` |
| DIP-16 | Framingham-style clinical baseline implementation | Zarina | Major | 12 Nov | Score computed on same test split; comparison table exists |
| DIP-17 | DB schema draft + ERD review | Muslim | Major | 01 Nov | Migration files + ERD matches `docs/architecture/diagrams/er-diagram.mmd` |
| DIP-18 | FastAPI skeleton + OpenAPI committed | Muslim | Major | 08 Nov | App runs in Docker; `/health` works; spec in repo |
| DIP-19 | Design system: colors, typography, components | Sara | Normal | 05 Nov | Figma/HTML style guide linked from README |
| DIP-20 | Supervising meeting #1: review M1 baselines | Zarina | Major | 15 Nov | Feedback logged in `docs/supervisor/feedback-log.md` |

## M2 — ML models & explanations (until 06 Dec 2026)

| ID | Summary | Assignee | Priority | Deadline | Acceptance criteria |
|---|---|---|---|---|---|
| DIP-21 | LightGBM model for CVD | Zarina | Critical | 20 Nov | AUC ≥ 0.78 or documented fallback vs baseline |
| DIP-22 | LightGBM model for T2D | Zarina | Critical | 24 Nov | Same criterion as DIP-21 |
| DIP-23 | Hyperparameter tuning with CV (no leakage) | Zarina | Major | 28 Nov | Tuning script + CV results committed |
| DIP-24 | Subgroup (sex, age) metric report | Zarina | Critical | 30 Nov | Per-subgroup AUC table; gaps > 0.05 documented |
| DIP-25 | SHAP explanation module | Muslim | Critical | 01 Dec | Top-k signed attributions; unit tests |
| DIP-26 | Model card v1 | Zarina | Critical | 03 Dec | All template sections filled; metrics match reports |
| DIP-27 | Evaluation report v1 | Zarina | Major | 06 Dec | Comparisons vs both baselines with CIs |
| DIP-28 | Model bundle contract (input schema + versioning) | Muslim | Major | 06 Dec | JSON schema + loader with tests |

## M3 — Backend API (until 27 Dec 2026)

| ID | Summary | Assignee | Priority | Deadline | Acceptance criteria |
|---|---|---|---|---|---|
| DIP-29 | PostgreSQL schema migrations | Muslim | Critical | 10 Dec | Migrations up/down tested |
| DIP-30 | `POST /api/v1/assessments` (guest) | Muslim | Critical | 14 Dec | Contract tests (15+ cases) pass |
| DIP-31 | Auth: register/login/JWT/password hashing | Muslim | Critical | 18 Dec | Negative auth tests pass; no plaintext passwords |
| DIP-32 | History endpoints + delete (FR-06, NFR-04) | Muslim | Critical | 22 Dec | Integration tests incl. erasure |
| DIP-33 | Admin endpoints (FR-08) | Muslim | Minor | 26 Dec | 403 for non-admin verified |
| DIP-34 | CI pipeline: lint, tests, gitleaks, schemathesis | Muslim | Major | 27 Dec | CI green on main |

## M4 — Frontend & integration (until 24 Jan 2027)

| ID | Summary | Assignee | Priority | Deadline | Acceptance criteria |
|---|---|---|---|---|---|
| DIP-35 | React app scaffold + TS types from OpenAPI | Sara | Critical | 05 Jan | Generated client compiles; dev build runs |
| DIP-36 | Questionnaire form with validation | Sara | Critical | 10 Jan | E2E: valid + invalid inputs |
| DIP-37 | Risk report page (factors, disclaimer) | Sara | Critical | 15 Jan | E2E assertions FR-03/FR-04 pass |
| DIP-38 | History + trends page | Sara | Major | 19 Jan | FR-07 works with ≥2 assessments |
| DIP-39 | Usability test protocol + run (n≥5) | Sara | Major | 22 Jan | SUS ≥ 70 or improvement plan |
| DIP-40 | Performance test (p95 ≤ 500 ms) | Muslim | Major | 23 Jan | k6 report attached to task |

## M5 — Pre-defense 1 (until 07 Feb 2027)

| ID | Summary | Assignee | Priority | Deadline | Acceptance criteria |
|---|---|---|---|---|---|
| DIP-41 | End-to-end demo rehearsal (video backup) | All | Critical | 04 Feb | Demo runs twice successfully |
| DIP-42 | Documentation update + tag `pre-defense-1` | Muslim | Critical | 07 Feb | Tag pushed; README status updated |
| DIP-43 | Supervisor review of M1–M4 results | Supervisor | Critical | 06 Feb | Feedback logged and addressed |
