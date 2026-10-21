# Pre-defense 1 submission (24 October 2026)

Submission note required by step 8 of the repository requirements: for every submission the
team provides the repository link, the tag of the submitted version, a summary of the work
done, known limitations and outstanding tasks.

| Item | Value |
|---|---|
| Repository | <https://github.com/kkfes/MedRisk> (public) |
| Submitted tag | `pre-defense-1-2026-10-24` (annotated) — the exact commit submitted at the pre-defense |
| Earlier snapshot | `pre-defense-1` (19 October 2026) — the M0 pack as it stood on that day; it was not moved and is not replaced |
| Team snapshot | `pre-defense-1-2026-10-22` (22 October 2026) — the state of the repository with the contributions of all three members and the published pull-request reviews |
| Stage | Milestone **M0 — Concept** (pre-defense 1) |
| YouTrack | <https://medrisk.youtrack.cloud/projects/DIP> — 46 tasks (DIP-1 … DIP-47, see the note on the task IDs) |
| Date | 24 October 2026 |

## Why there are several tags

`pre-defense-1` was created on 19 October 2026, when the M0 pack was ready. The team rule
(`CONTRIBUTING.md`, section 5) is that a submitted tag is never moved or replaced, so that tag
stays exactly where it is and the submission note that it contains — describing the pack of
19 October — has not been altered.

The version that is actually submitted on 24 October 2026 contains the contributions of all
three team members, so it carries its own date-stamped tag, `pre-defense-1-2026-10-24`.
Between the two, the team published the intermediate snapshot `pre-defense-1-2026-10-22`
(22 October 2026), so that the state of the work with the published pull-request reviews is
archived as well. All three tags point into the same history; the stage tags of the process
(`pre-defense-1`, `pre-defense-2`, `final-pre-defense`) are never repurposed.

## Summary of completed work

- **Analysis:** project proposal with problem statement, target users, aim, objectives,
  expected outcomes and scope.
- **Research:** literature review of 27 structured sources — 23 scholarly publications
  (journal articles, conference papers, reporting and evaluation guidelines) and 4
  institutional, regulatory or dataset sources — each with a verifiable link and its critical
  limitation inside the analysis table; comparison of 5 existing systems against 9 criteria
  with evidence; technology comparison covering 6 key decisions with 2–3 alternatives each.
- **Requirements:** 25 functional and non-functional requirements with MoSCoW priorities,
  acceptance criteria and a verification traceability table.
- **Design:** architecture description with system-context, use-case, component, sequence and
  ER diagrams — editable Mermaid sources plus SVG exports; a design system of 94 tokens with
  token-only component rules and a static style guide.
- **UX:** five HTML screens of the key user scenarios, and a working React + TypeScript
  application with the questionnaire form, the risk report and the history and trend screen.
- **Evidence:** an interview protocol with role-specific question sets, a discussion-log
  template and a findings log in which every unverified row is marked as an assumption; a
  usability test protocol with 5 tasks, the SUS instrument, the pass criteria C1–C6, the
  recruitment plan and the appendices.
- **Verification planning:** metrics, acceptance thresholds, baselines, a target/horizon
  compatibility gate for the datasets, evaluation safeguards (frozen test indices, bootstrap
  confidence intervals, calibration slope and intercept) and a results register that contains
  only `TBD` / `NOT RUN` / `BLOCKED` — no result is claimed.
- **Management:** roles, milestones M0–M6, risks and dependencies; a Git repository with
  traceable commits from all three team members; a YouTrack project with 46 prioritised and
  scheduled tasks (the supervisor review task is tracked as `DIP-47` — YouTrack never
  renumbers issues, see the note in the backlog document); the delivered tasks carry a
  work-link comment pointing at their commit and their pull request.

All documents are preliminary and may change during implementation (changes are recorded
as ADRs and committed like any other change).

## Contributions of the team members

Every commit is made under the author's own name and e-mail, and every commit message starts
with the ID of its YouTrack task.

| Member | GitHub | Work delivered | Pull requests |
|---|---|---|---|
| Zarina Kosaman (SE-2429) | `haweeks` | literature review (DIP-3), verification and evaluation plan (DIP-9) | #5, #7 |
| Sara Mukhammad (SE-2419) | `Sierra07-w` | prototype refinement (DIP-8), interview protocol and findings log (DIP-44), design system (DIP-19), usability test protocol (DIP-39), React application and the questionnaire, report and history screens (DIP-35 … DIP-38) | #1–#4, #6, #8–#10 |
| Muslim Syzdykov (SE-2425) | `kkfes` | repository, proposal, comparisons, requirements, diagrams, project management, YouTrack setup, tags and releases | — |

All work items were delivered through pull requests; the review of each pull request is
recorded on the pull request page itself.

## Verification performed

- Front-end: `npm run build`, `npm run lint` and `npm test` (46 tests) pass on the submitted
  commit; the questionnaire, the report and the history were walked through in a browser.
- The risk levels are never encoded by colour alone (symbol and text label in addition to the
  colour); the design system was checked on 30 text/boundary pairs against WCAG 2.1 AA.
- The literature review was checked source by source: the source count in the header and in
  the analysis table agree, and every entry has a resolvable link.
- The mock adapter returns fixed example values and never computes a risk from the answers;
  the interface states this in every screen.
- The repository contains no secret: no token, no password and no key, and the environment
  files carry placeholders only.

## Known limitations

- The back-end is not implemented yet — it starts at M1 (DIP-17, DIP-18). The application runs
  against a mock adapter with clearly labelled illustrative data.
- The ML models are not trained and no accuracy is claimed. The acceptance thresholds of the
  verification plan are targets, not results.
- The user interviews of DIP-44 are prepared but **not conducted**: the protocol, the question
  sets and the log template exist, the sessions do not. Every row of the findings log is marked
  as an assumption.
- The usability sessions of DIP-39 are prepared but **not conducted**; the result tables are
  empty and marked as such.
- The public datasets do not support a ten-year incident-event claim. This is documented in the
  literature review and in the evaluation plan and is waiting for the supervisor's decision
  together with the wording of FR-02.
- The technology stack and the architecture remain a preliminary variant for discussion.

## Outstanding tasks

| Task | Owner | Milestone |
|---|---|---|
| DIP-44 Evidence of relevance: 3–5 interviews with user representatives | Team | M0 |
| DIP-47 (CSV row 43) Supervisor review of M1–M4 results | Supervisor | M5 |
| DIP-12 … DIP-16 Data, preprocessing and the two baselines | Zarina | M1 |
| DIP-21 … DIP-28 Models, SHAP, model card and evaluation report | Zarina, Muslim | M2 |
| DIP-29 … DIP-34 PostgreSQL, REST API, authentication, CI | Muslim | M3 |
| DIP-39, DIP-40 Usability sessions and the performance test | Sara, Muslim | M4 |
