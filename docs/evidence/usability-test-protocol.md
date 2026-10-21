# Usability Test Protocol — MedRisk

**Author:** Sara Mukhammad (SE-2419) · **Task:** DIP-39 · **Stage:** M4 (frontend & integration)
**Requirement:** `NFR-05` — "a first-time user completes questionnaire → report unassisted;
SUS score ≥ 70 in the internal test (n ≥ 5)"
**Acceptance criterion (backlog):** "Usability test protocol + run (n ≥ 5) — SUS ≥ 70 or
improvement plan"
**Related documents:** [requirements specification](../requirements/requirements-specification.md) ·
[verification & evaluation plan](../verification/verification-and-evaluation-plan.md) §7 ·
[user research / interview protocol](user-research.md) ·
[project management](../management/project-management.md)

> **Status of this document.** The protocol is complete and ready to run.
> **The test has not been conducted yet, so this document contains no results.**
> Every results table in §13 is marked `TODO: not conducted yet`. No number in this
> repository is a measurement of a real participant.

---

## 1. Purpose and scope

### 1.1 Why this test is needed

`NFR-05` requires evidence that a first-time user can complete the questionnaire and read
the report without help, and that the interface is rated as usable (SUS ≥ 70). The
prototype in `/prototype` was reviewed by the team and the supervisor, but it has never
been observed in use with a real participant. The interview material of DIP-44 covers
*what people expect and fear*, not *whether they can operate the interface*.

### 1.2 What this test measures

1. **Task success** — can a participant finish the five core tasks unaided?
2. **Time on task** — how long does each task take, and where does the time go?
3. **Comprehension** — does the participant understand what the numbers mean and what the
   tool cannot do (safety)?
4. **Subjective usability** — the System Usability Scale (SUS), scored per participant.
5. **Error and hint count** — how often the participant is lost, and where.

### 1.3 What this test does **not** measure

- **It is not a clinical validation.** A usability score says nothing about whether the
  risk estimate is medically correct. That is covered by DIP-15/16/21/22 and the evaluation
  report.
- **It does not test the model.** The participant sees a fixed, clearly labelled
  illustrative result in the prototype; in the React version the result comes from the API.
  Either way the test measures the *interface*, not the algorithm.
- **It does not collect medical data.** Participants answer with invented values
  (§11.3), so no health information about a real person is ever recorded.
- **It is not a summative study.** With n ≥ 5 the result is indicative; it is used to find
  usability problems, not to claim a population statistic.

### 1.4 Relationship to the other UX tasks

| Document | What it provides to this protocol |
|---|---|
| DIP-8 — UX prototype notes §7 | The five tasks, the success criteria and the thresholds used here; this protocol executes them |
| DIP-8 — prototype | The screens under test (questionnaire, report, history) and the 12-question limit (`FR-01`) |
| DIP-44 — user research | The personas (P1 "Aizada", P2 "Batyr") and the language used with participants |
| DIP-19 — design system | The tokens and components the participants see; a deviation in the palette is a usability finding |

## 2. Test objectives

| # | Objective | How it is measured |
|---|---|---|
| O1 | A first-time user completes the questionnaire and reaches the report without help | T1 success rate and hint count |
| O2 | A participant can find both risk numbers and say which is which | T2 success rate |
| O3 | A participant can name the factor that increased the estimate | T3 success rate |
| O4 | A participant understands that the result is **not** a diagnosis and knows who to contact | T4 success rate, comprehension Q1–Q3 |
| O5 | A participant can save an assessment and find it again | T5 success rate |
| O6 | The interface is rated as usable | SUS score per participant, mean ≥ 70 |

## 3. Participants and recruitment

### 3.1 Number and composition

`NFR-05` requires **n ≥ 5**; the verification plan asks for a mix of students and
non-technical adults. Round 1 uses **5 participants**:

| ID | Profile | Why this profile |
|---|---|---|
| P1 | Adult 30–45, non-technical, no chronic diagnosis, uses a laptop | Primary persona P1 ("Aizada"); the happy path |
| P2 | Adult 55–70, low health literacy, prefers a phone, reads slowly | Primary persona P2 ("Batyr"); the hardest readability case |
| P3 | Adult 30–50, works with spreadsheets or numbers daily (teacher, accountant) | Confirms that the numerical output is not confusing for a numerically confident user |
| P4 | Adult 30–70, uses a screen reader or large text routinely | Accessibility check on the real screen-reader path, not only the static audit |
| P5 | Adult 30–70, no health background, recruited outside the university | Avoids a sample that is entirely students of a technical programme |

**Inclusion criteria:** age 18+, able to read and speak the session language (English or
Russian — the session language is recorded), gives consent.

**Exclusion criteria:** the participant is a member of the project team or has worked on
the interface; the participant has seen the prototype before (this is recorded and, if it
happens, the session is repeated with another person).

### 3.2 Recruitment

- **Channel:** one post in the university "announcements/health" group, one post in a
  non-technical community group (library, neighbourhood, hobby club), and two direct
  invitations to people who fit P2 and P4.
- **Recruitment text (short version):** "We are testing a health-questionnaire web
  interface for a university project. It does not give medical advice and it does not use
  your real health data — you will fill in invented values. The session takes about
  30 minutes, remotely or in a room on campus, and you will receive a small thank-you
  gift. You can stop at any moment."
- **No health data is requested in the recruitment message**, so that people who would
  not share their health status are not excluded.
- **Compensation:** a fixed small thank-you gift (bookstore voucher) for everyone, so
  that the sample is not biased towards people who need the money.
- **Scheduling:** each session on a separate day, the same version of the build for all
  participants (the commit hash is recorded in §13.1).

### 3.3 Why five participants is enough for this round

The aim is to find *problems*, not to measure a mean precisely. Nielsen's rule of thumb
(≈5 users find ≈80 % of the usability problems) is used here as a heuristic, and it is
stated as a heuristic, not as a statistical claim. If the mean SUS is below 70 or a task
success rate is below 90 %, a second round of 3–5 participants is scheduled after the
improvements (§14).

## 4. Test environment and materials

### 4.1 Environment

| Item | Value | Why |
|---|---|---|
| Application under test | The React application (DIP-35…DIP-38) at a fixed commit; **fallback**: the static prototype in `/prototype` | The real product is the target; the prototype is a documented fallback if the React build is not ready |
| Commit / build hash | recorded in §13.1 for every session | Reproducibility — all participants must see the same version |
| Desktop | 1366 × 768, Chrome or Firefox (the browser the participant normally uses) | The most common environment for the secondary persona P3 |
| Mobile | 360 × 800 (one session, P2) | FR-12 and the responsive layout; a phone is the realistic device for the lower-literacy persona |
| Zoom | 100 % by default; P4's session uses 200 % browser zoom | WCAG 1.4.4 (Resize Text) |
| Screen reader | VoiceOver (macOS) or NVDA (Windows) in P4's session | The accessibility path is tested with a real screen reader |
| Network | local server, no external requests | No third-party trackers, no page-load noise, nothing that could identify a participant |
| Recording | screen capture only, with a separate consent question | Written notes are sufficient; a recording is not required |

**Rule:** the moderator does **not** use the participant's own device and does not use
their own browser profile. The environment is identical for everyone except for the
device/browser choice of P2 and P4, which is recorded.

### 4.2 Materials

1. This protocol, printed for the moderator.
2. Appendix A — the moderator script (read verbatim where marked).
3. Appendix B — the SUS questionnaire (10 items, printed and given on paper).
4. Appendix C — the comprehension questions.
5. Appendix D — the participant information sheet and consent form.
6. A timer, a pen, and the note template of §12.
7. The task data sheet of §13.2 — one printed copy per participant, filled in during the
   session.

## 5. Scenario

### 5.1 The story given to the participant

> "Imagine it is a weekday evening. You have seen an advertisement for a free web tool
> that estimates your risk of heart disease and type 2 diabetes over the next 10 years.
> You are curious, but you are not ill. You have roughly half an hour. You will be asked
> to answer some questions — you may use **made-up** values, that is completely fine. At
> the end you will see a result and we will ask you a few questions about how it felt.
> Please think out loud while you work: say everything that comes into your head."

### 5.2 Why a scenario and not a list of features

The participant is asked to behave like a person with a goal, not like a tester of a
product. The scenario is deliberately written in the second person and contains no
MedRisk vocabulary, so that the participant's expectations come from the story and not
from the interface.

### 5.3 Think-aloud protocol

- The moderator says: **"Please think out loud. Say anything that comes into your head —
  even if it seems irrelevant."** and then stays silent.
- The moderator writes down the participant's words, not interpretations.
- The moderator never says "click here", "this button is for…", "you need to…" or "good
  job". Such an intervention is a **hint** and is recorded in the task sheet (§12).
- Clarifying questions are only allowed if the participant asks something the scenario
  already answers.

## 6. Tasks

The five tasks are the ones defined in the UX prototype notes (DIP-8 §7.1) and are the
acceptance criteria of this test. The wording in the second column is read to the
participant **verbatim**; the third column is the success criterion; the fourth is what
the moderator writes down.

| # | Task (read to the participant) | Success criterion | Recorded |
|---|---|---|---|
| T1 | "Please complete the health questionnaire as a guest. Use any values you like — they can be made up. Tell me when you reach the result." | All 8 required questions answered, the report opened, **≤ 5 min**, **≤ 1 hint** from the moderator | success / time / hints / which questions were left empty |
| T2 | "On the report, please find the two risk numbers and tell me what they mean in your own words." | Both numbers located and read aloud, **≤ 30 s** | success / time / the participant's own wording |
| T3 | "Please tell me which factor increased your risk the most." | The strongest increasing factor named correctly, **≤ 60 s** | success / time / the factor named |
| T4 | "Based on what you have seen, where would you go next with this result?" | A doctor or a health service is named — **not** the internet, **not** medication or treatment | success / the answer given verbatim |
| T5 | "Please create an account, save this assessment, and then find it again in your history." | The assessment appears in the history list | success / time / hints / errors |

**Notes on the task set.**

- T1 is the longest task and the one that carries the `FR-01` limit: the questionnaire has
  **12 questions, 8 required and 4 optional measurements**. A participant who leaves a
  required question empty has failed T1, even if the report opened.
- T4 is the **safety** task. It is not in the verification plan's list of four tasks; it
  was added here because `NFR-06` requires that the user understands that the result is
  not a diagnosis. The task list of the verification plan (§7) is therefore a subset of
  this one; this protocol is the stricter, superset definition.
- T5 requires the account flow (`FR-05`, DIP-31). If the authentication service is not
  available on the test day, T5 is skipped for everyone and recorded as "skipped — reason:
  service unavailable" in §13.2; the remaining four tasks are still valid.

## 7. Metrics

| Metric | Definition | Target | Source |
|---|---|---|---|
| Task success rate | share of participants who complete the task within the criterion | ≥ 90 % (per task) | verification plan §7 |
| Time on task | seconds from "the task has started" to "the participant says it is done" | see §6 | DIP-8 §7.2 |
| SUS score | System Usability Scale, 0–100 | ≥ 70 (mean) | `NFR-05` |
| Comprehension | share of correct answers to Q1–Q3 | ≥ 80 % | verification plan §7 |
| Hints | count of moderator interventions per task | ≤ 1 on T1, 0 elsewhere | DIP-8 §7.1 |
| Errors | count of wrong actions (wrong field, wrong button, backtracking) | no target; analysed qualitatively | — |
| Safety comprehension | participants who treat the result as a diagnosis | **0** | `NFR-06` |
| Required fields left empty by mistake | count | **0** | `FR-01` |

**Assisted completion.** If a task needed a hint, the attempt is recorded as
`assisted` — it is **not** counted as a success, and it is not silently dropped either.
The analysis in §13.3 reports the success rate both ways (strict and including assisted
attempts) so that the number cannot be read in a favourable way by accident.

## 8. System Usability Scale (SUS)

The SUS is the standard 10-item questionnaire (Sauro & Lewis). It is used because
`NFR-05` names it and because the score is comparable between versions of the product.

### 8.1 Items and response scale

Each item is answered on a 5-point scale. The exact wording and the answer options are
in Appendix B. Items 1–10 in the appendix follow the standard SUS.

### 8.2 Scoring

For each participant:

1. For the **odd** items (1, 3, 5, 7, 9): `score − 1`.
2. For the **even** items (2, 4, 6, 8, 10): `5 − score`.
3. Sum the 10 results → range 0–40.
4. Multiply by **2.5** → the SUS score, range 0–100.

A single participant's score is reported without rounding; the group mean is reported
with one decimal.

### 8.3 Interpretation

| SUS | Interpretation (Bangor et al.) |
|---|---|
| ≥ 85 | Excellent |
| 72.5–84.9 | Good |
| 62.7–72.4 | Acceptable |
| 51.7–62.6 | Marginal |
| < 51.7 | Poor |

**Target:** mean SUS ≥ 70 (`NFR-05`). A mean of exactly 70 counts as a pass.

## 9. Success criteria and the decision rule

The test is passed when **all** of the following hold:

| # | Criterion | Threshold |
|---|---|---|
| C1 | Participants | n ≥ 5 |
| C2 | Mean SUS | ≥ 70 |
| C3 | Task success rate | ≥ 90 % for T1, T2, T3 and T5 |
| C4 | Safety comprehension | 0 participants treat the result as a diagnosis; ≥ 80 % correct on Q1–Q3 |
| C5 | Time on T1 | ≤ 5 min for at least 4 of 5 participants |
| C6 | Questionnaire | no required field left empty by mistake |

**Decision rule.**

- All criteria met → the usability requirement `NFR-05` is satisfied; the results table
  and the raw summary are committed, and the finding is added to the evidence log of the
  pre-defense.
- Any criterion not met → **an improvement plan is written** (§14) and attached to the
  task. The backlog allows exactly this: "SUS ≥ 70 **or** improvement plan". The plan
  names every failing task, the concrete change, the task that will implement it, and
  the date; a re-test is scheduled.
- A failing criterion is **not** fixed by re-running the test until the number looks
  better. The number is reported as it was measured.

## 10. Procedure

### 10.1 Session timeline (≈ 30 minutes)

| Time | Step | Moderator does |
|---|---|---|
| 0:00–0:03 | Welcome & consent | Reads Appendix D, obtains the consent, states the rules (invented values, may stop at any time) |
| 0:03–0:05 | Warm-up | "Please think out loud while you work. Say anything that comes into your head." |
| 0:05–0:20 | T1–T5 in order | Reads each task verbatim, times it, records hints and errors |
| 0:20–0:24 | Comprehension questions | Appendix C, Q1–Q4 |
| 0:24–0:27 | SUS | Hands over Appendix B, stays silent while the participant answers |
| 0:24–0:27 | Wrap-up | "What was the hardest part?", "What would you change first?", "Anything else?" |
| 0:27–0:30 | Closing | Thanks, the thank-you gift, how the results will be used, how to withdraw |

### 10.2 Order of the tasks

T1 → T2 → T3 → T4 → T5, always in this order. The order is fixed so that the sessions
are comparable: the questionnaire comes first because everything else depends on it, and
the account task comes last because it is the longest and the least critical.

### 10.3 Moderator rules

1. No coaching. No pointing at the screen.
2. Any moderator utterance that helps the participant is a **hint** and is written down.
3. Silence is the default; the moderator only writes.
4. The moderator does not answer medical questions. If the participant asks whether they
   are ill, the standard answer is: "I cannot answer that — the tool estimates a risk,
   it does not diagnose. That is exactly what I would like your feedback on."
5. If the participant is distressed, the session stops and the participant is thanked.
6. The moderator does not fill the form for the participant, not even after a hint.

### 10.4 Moderation

The first session (P1) is run as a **pilot**: the moderator checks that the script, the
timings and the note sheets work. The pilot session is still counted, but any change made
to the protocol after the pilot is recorded in §12.3 — a protocol that changes silently
mid-study is not a protocol.

## 11. Ethics, consent and data protection

### 11.1 Informed consent

Before anything else the participant receives the information sheet (Appendix D) and
signs the consent form. The consent covers: participation, screen recording (optional),
the use of the anonymised notes, and the right to withdraw. Without a signed consent the
session does not start.

### 11.2 Right to withdraw

The participant may stop the session at any moment and may withdraw their data afterwards
until the results are written into the report. The notes of a withdrawn participant are
deleted, not just excluded from the analysis.

### 11.3 No real medical data

Participants are asked to use **invented** values (age, blood pressure, weight …). This is
stated in the scenario and in the information sheet. It is not a stylistic precaution: it
means the test material contains no personal health information, so no clinical data ever
enters the notes, the screenshots or the repository. If a participant insists on using
their own values, the session continues, but the moderator notes that this data must be
deleted from the notes and the recording before the notes are written up.

### 11.4 Anonymisation and storage

- Participants are identified in all notes only by the ID (P1…P5). Names are never written
  down.
- The recruitment message, the signed consent forms and any recording are **not**
  committed to the repository. They are stored outside the repository by the author until
  the defence, and are destroyed afterwards.
- What *is* committed: the anonymised note template, the per-participant result rows, the
  SUS scores and the summary. No free-text field in the committed tables may contain a
  name, an employer or a place of work.
- The repository contains no `.env` file, no credentials and no personal data; this is
  checked with the usual secret scan before the commit.

### 11.5 Moderation of medical advice

The moderator is not a doctor and gives no medical advice, no interpretation of the
participant's own health and no recommendation. This protects the participant and keeps
the test inside the scope of the project (decision support, not diagnosis).

### 11.6 Risk assessment

| Risk | Mitigation |
|---|---|
| The participant reads the illustrative result as a personal diagnosis | The disclaimer is part of the interface under test; the "cannot diagnose" comprehension question checks it (Q1–Q3, T4) |
| The participant becomes anxious about their health | The scenario uses invented values; the moderator states twice that the result is illustrative; the session can be stopped at any time |
| Personal data ends up in the notes | The moderator uses the ID scheme and deletes any real values a participant insists on using |
| The test is conducted without ethics approval | The protocol is submitted to the supervisor with the diploma documentation; no personal data is collected, so no separate institutional approval is required — **to be confirmed by the supervisor (§17)** |

## 12. Recording procedure

### 12.1 Note template (one per participant)

```
Participant ID: P__      Date: ____-__-__      Build hash: ____________
Device / browser: ______________________       Screen reader: yes / no
Language of the session: ____________          Zoom: ____ %

T1  success / assisted / fail   time: ___ s   hints: __   questions left empty: __
T2  success / assisted / fail   time: ___ s   hints: __   participant's wording: ______
T3  success / assisted / fail   time: ___ s   hints: __   factor named: ____________
T4  success / assisted / fail   time: ___ s   hints: __   answer: __________________
T5  success / assisted / fail   time: ___ s   hints: __   errors: _________________
SUS 1__ 2__ 3__ 4__ 5__ 6__ 7__ 8__ 9__ 10__   -> score: ___

Q1 __  Q2 __  Q3 __        (correct / wrong / partial)
Verbatim quotes: ______________________________________________
Observations: _________________________________________________
```

### 12.2 Where the data lives

| Data | Location | Committed? |
|---|---|---|
| Signed consent forms, recruitment list | author's private storage | no |
| Screen recordings (if any) | author's private storage | no |
| Filled note sheets | author's private storage until analysis | no (only the aggregated rows are committed) |
| Per-participant result rows, SUS scores, summary | §13 of this document | yes |
| Improvement plan | §14 of this document | yes |

### 12.3 Protocol changes

Any change to this protocol after the pilot session is recorded here with the date, the
reason and the sessions it affects.

| Date | Change | Reason | Affected sessions |
|---|---|---|---|
| — | none yet | the test has not been conducted | — |

## 13. Results

> **TODO: not conducted yet.** No session has been run, so the tables below are empty.
> They are part of the protocol so that the moderator can fill them in during the
> sessions without inventing a format. As soon as the sessions are done, this section is
> replaced with the measured values, the per-participant rows and the summary.

### 13.1 Sessions

| Participant | Date | Profile | Device / browser | Build hash | Session language |
|---|---|---|---|---|---|
| P1 | TODO: not conducted yet | TODO | TODO | TODO | TODO |
| P2 | TODO: not conducted yet | TODO | TODO | TODO | TODO |
| P3 | TODO: not conducted yet | TODO | TODO | TODO | TODO |
| P4 | TODO: not conducted yet | TODO | TODO | TODO | TODO |
| P5 | TODO: not conducted yet | TODO | TODO | TODO | TODO |

### 13.2 Task results (per participant)

`S` = success, `A` = assisted (a hint was needed — not counted as a success),
`F` = failure, `—` = task skipped (with the reason).

| Participant | T1 | T1 time | T2 | T2 time | T3 | T3 time | T4 | T5 | T5 time | Hints (total) | Errors (total) |
|---|---|---|---|---|---|---|---|---|---|---|---|
| P1 | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO |
| P2 | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO |
| P3 | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO |
| P4 | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO |
| P5 | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO | TODO |

### 13.3 SUS scores

| Participant | Odd items sum (after −1) | Even items sum (after 5−score) | SUS score |
|---|---|---|---|
| P1 | TODO | TODO | TODO |
| P2 | TODO | TODO | TODO |
| P3 | TODO | TODO | TODO |
| P4 | TODO | TODO | TODO |
| P5 | TODO | TODO | TODO |
| **Mean** | — | — | **TODO** |

**Target:** mean ≥ 70. **Measured:** TODO: not conducted yet.

### 13.4 Comprehension questions

| Participant | Q1 (not a diagnosis) | Q2 (what the number means) | Q3 (what to do next) | Safety errors |
|---|---|---|---|---|
| P1 | TODO | TODO | TODO | TODO |
| P2 | TODO | TODO | TODO | TODO |
| P3 | TODO | TODO | TODO | TODO |
| P4 | TODO | TODO | TODO | TODO |
| P5 | TODO | TODO | TODO | TODO |
| **Share correct** | TODO | TODO | TODO | **TODO (target 0)** |

Q4 ("what did you think the word 'risk' meant here?") has no right or wrong answer; it is
recorded verbatim and analysed as a wording finding in §13.6.

### 13.5 Summary against the thresholds of §9

| Criterion | Threshold | Measured | Result |
|---|---|---|---|
| C1 Participants | n ≥ 5 | TODO | TODO |
| C2 Mean SUS | ≥ 70 | TODO | TODO |
| C3 Task success (T1, T2, T3, T5) | ≥ 90 % | TODO | TODO |
| C4 Safety comprehension | 0 misreadings, ≥ 80 % correct | TODO | TODO |
| C5 Time on T1 | ≤ 5 min for ≥ 4 of 5 | TODO | TODO |
| C6 Required fields left empty | 0 | TODO | TODO |

### 13.6 Qualitative findings

The findings that the numbers do not show: what confused the participants, what they
expected to happen, what they read in the disclaimer, and which wording they used for the
result. Recorded as short verbatim quotes, anonymised.

| # | Finding | Task / question | Severity | Linked task |
|---|---|---|---|---|
| — | TODO: not conducted yet | — | — | — |

## 14. Improvement plan

Required when any criterion of §9 is not met. The plan is written **after** the numbers
are known and is never a paraphrase of "it went well".

| # | Problem (from §13.6) | Criterion failed | Planned change | Implementer / task | Priority | Deadline | Status |
|---|---|---|---|---|---|---|---|
| — | TODO: not conducted yet | — | — | — | — | — | — |

**Re-test rule.** After the improvements are released, the affected tasks are re-tested
with at least 3 participants who have not taken part in round 1. The re-test result is
added as a second table in §13, clearly labelled as a re-test; the round-1 numbers stay
in the document unchanged.

## 15. Risks to the validity of the test

| Risk | Effect | Mitigation |
|---|---|---|
| n = 5 is a small sample | The mean SUS is not a population statistic | Reported as indicative; the round-2 rule of §3.3 is used if a criterion fails |
| Self-selected participants are more curious about health | Overestimates the completion rate | P5 is recruited outside the university; the recruitment text is identical for everybody |
| The moderator is present | Participants may ask for help earlier than alone | Fixed hint rules (§10.3); every hint is recorded and counted |
| Invented data are not real data | The questionnaire may feel easier with made-up values | Accepted; it protects the participant and it tests the interface, not the honesty of the answers |
| The prototype shows an illustrative result, not a model output | T2/T3 measure the layout of the explanation, not the quality of the explanation | Stated in the results; the React version re-tests the same tasks with real output |
| The first session is a pilot | The first participant is confronted with a rough protocol | Pilot changes are recorded in §12.3 |
| One moderator | The results carry the moderator's interpretation | The note sheet records the participant's words, not the moderator's conclusions; every hint is written down verbatim |

## 16. Schedule and responsibilities

| When | What | Who |
|---|---|---|
| Before the test day | The protocol is reviewed by the supervisor and the team; the recruitment message is posted | Sara + supervisor |
| Test day −2 | The build is frozen, the commit hash is recorded, the note sheets are printed | Sara |
| Test day | 5 sessions of ≈ 30 min, one per participant | Sara (moderator), one colleague as a note-taker |
| Test day +1 | The notes are written up into §13, the SUS scores are calculated | Sara |
| Test day +2 | The summary and the improvement plan are reviewed by the team | Sara + team |
| Before 22 Jan 2027 (DIP-39 deadline) | The document with the results is committed and the task is closed in YouTrack with the link to the commit | Sara |

## 17. Open questions for the supervisor

1. **Which build is tested?** The React application (DIP-35…DIP-38) is the target; the
   prototype is only a fallback. If the React application is not ready by the test day, is
   a test on the prototype acceptable as the first round, with the React round scheduled
   afterwards?
2. **Language of the sessions.** The interface is English only (the Russian and Kazakh
   strings are planned, `FR-12`). Should one session be run in Russian with an
   interpreter, or is an English-only round acceptable for v1?
3. **Compensation.** A thank-you gift of a fixed value is planned; is a budget available,
   and is a cash-free gift acceptable?
4. **Ethics.** The protocol collects no personal medical data and only anonymised notes.
   Is a separate institutional ethics approval required for a usability test of this
   kind, or is the supervisor's approval of this document sufficient?
5. **Threshold.** The backlog accepts "SUS ≥ 70 **or** improvement plan". Should the
   improvement plan have to be completed before the task can be closed, or is a written
   plan enough for the defence?
6. **Location of the results.** `NFR-05` and the verification plan expect the results in
   `docs/verification/usability-report.md`, while this protocol lives in `docs/evidence/`
   next to the interview material. The results table will be written here and a short
   summary will be linked from the verification plan — please confirm this arrangement.

---

## Appendix A — Moderator script

**Opening (read verbatim):**

> "Hello, thank you for coming. My name is Sara and I am studying software engineering.
> I am working on a web tool that estimates the risk of heart disease and type 2 diabetes
> over the next ten years. Before we start I want to explain what will happen. I will ask
> you to fill in a questionnaire and look at the result. **Please use invented values** —
> made-up numbers are perfect. The session takes about half an hour. I will not help you
> with the interface, on purpose: I want to know how it works when nobody is guiding
> you. If I stay silent, that is not because I am bored, it is because I am taking notes.
> You can stop at any moment, and you can skip any question, and you can withdraw your
> data afterwards. Do you agree to take part? Here is the consent form."

**Before the tasks (read verbatim):**

> "Please think out loud while you work — say anything that comes into your head, even if
> it seems irrelevant to me. I will write down your words. If you get stuck, that is
> useful information for me, so please do not wait for me."

**Between the tasks:**

> "That is the task finished. Now the next one: <task text>."

**If the participant asks for help:**

> "I am not allowed to help with that — but please tell me in your own words what you are
> trying to do, and what you expect to happen."

*(This is recorded as a hint.)*

**If the participant asks a medical question:**

> "I am not a doctor and I cannot interpret this for you — and that is exactly what I want
> to test: does the page make it clear that this is an estimate and not a diagnosis?"

**Closing (read verbatim):**

> "That is everything, thank you. Two last questions before you go: what was the hardest
> part of the task, and what would you change first if you could change one thing? …
> Thank you very much for your time — here is the thank-you gift. The results will be
> used to improve the interface; your name will not appear anywhere, and you can still
> ask me to delete your notes afterwards."

## Appendix B — SUS questionnaire (read to the participant)

> "Here are ten statements about the system you have just used. Please mark the box that
> fits your answer. 1 = strongly disagree, 5 = strongly agree."

| # | Statement | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| 1 | I would like to use this system again. | ☐ | ☐ | ☐ | ☐ | ☐ |
| 2 | I found the system unnecessarily complex. | ☐ | ☐ | ☐ | ☐ | ☐ |
| 3 | I thought the system was easy to use. | ☐ | ☐ | ☐ | ☐ | ☐ |
| 4 | I think I need technical support to use this system. | ☐ | ☐ | ☐ | ☐ | ☐ |
| 5 | I found the various functions of the system well integrated. | ☐ | ☐ | ☐ | ☐ | ☐ |
| 6 | I thought there was too much inconsistency in this system. | ☐ | ☐ | ☐ | ☐ | ☐ |
| 7 | I would imagine that most people would learn to use this system very quickly. | ☐ | ☐ | ☐ | ☐ | ☐ |
| 8 | I found the system awkward to use. | ☐ | ☐ | ☐ | ☐ | ☐ |
| 9 | I felt confident using the system. | ☐ | ☐ | ☐ | ☐ | ☐ |
| 10 | I had to learn a lot before I could get going with this system. | ☐ | ☐ | ☐ | ☐ | ☐ |

*Scoring: see §8.2. The moderator does not explain the items and does not help the
participant to answer — if the participant asks what an item means, the moderator reads it
again verbatim and moves on.*

## Appendix C — Comprehension questions

**Q1.** "After using the tool, do you think it can tell you whether you are ill?"
→ correct: "no, it only estimates a risk". Wrong: "yes".

**Q2.** "In your own words, what does the number 14 % on the screen mean?"
→ correct: the probability / chance of developing the disease within 10 years, based on
the entered data. Wrong: "the chance that I am ill now", "14 % of people like me are ill".

**Q3.** "What would you do with this result?"
→ correct: show it to / discuss it with a doctor. Wrong: change medication, start a diet
on their own, search the internet for a diagnosis, do nothing at all without a doctor.

**Q4 (open).** "What did you think the word 'risk' meant here?"
→ recorded verbatim; there is no wrong answer, it is analysed as a wording finding.

## Appendix D — Participant information sheet and consent

**Participant information**

- **What is this?** A usability test of a student project (university diploma). The
  interface estimates a risk; it does not diagnose and it does not give medical advice.
- **What do I have to do?** Fill in a questionnaire with invented values, look at the
  result, and answer a few questions about how it felt. About 30 minutes.
- **Do you have to use my real health data?** No. Please use made-up values.
- **Is it recorded?** Written notes are taken. A screen recording is optional and is only
  made if you agree separately.
- **What happens to my data?** Your name is never used. The notes are stored under the
  code P1…P5 and are destroyed after the defence. The results are published in the
  project repository without any personal data.
- **Can I stop?** Yes, at any moment, and you can ask me to delete your notes afterwards.
- **Questions?** Contact the author: Sara Mukhammad, SE-2419. The contact details are
  given in the invitation (they are deliberately not published in the repository — see
  DIP-1, "drop personal contact details").

**Consent**

☐ I have read the information above and I agree to take part in the usability test.
☐ I agree that anonymised notes of my session may be used in the diploma documentation.
☐ (optional) I agree to a screen recording of the session, used only for the analysis.
☐ I know that I can stop at any moment and withdraw my data.

Name: ____________________  Signature: ____________________  Date: ____________
