# Evidence of Relevance — User Research Log

**Requirement (pre-defense 0, component 2):** evidence that informs the requirements —
*3–5 discussions with user representatives or a substantive agreement with the actual client*,
with verified findings distinguished from assumptions.

> **Status: partially prepared.** The protocol below is ready and the part of the log that
> does not depend on real people is filled in. **The interviews themselves have not been
> conducted yet** — therefore every entry in the findings log is currently an
> **assumption**, and no row is marked as a *verified finding*.
>
> **TODO (Sara, DIP-44):** conduct the two discussions in §1 (rows 3 and 4), then replace the
> `TODO` markers, move the corresponding rows from *assumption* to *verified finding*, and
> add the requirement impact. Two interviews must be completed before 22 October 2026.
>
> This is the only component of the pre-defense 0 package that cannot be produced without
> real people.

## 1. Planned discussions (target: 3–5)

| # | Role of respondent | Who (planned) | Date | conducted by | Status |
|---|---|---|---|---|---|
| 1 | Target user, adult 30–50 (office worker, no chronic diagnoses) | _(to fill)_ | | Zarina | planned |
| 2 | Target user, adult 45–65 (has hypertension / elevated glucose) | _(to fill)_ | | Sara | planned |
| 3 | Target user, non-technical, lower health literacy | Non-technical adult 30–50, no medical background, no chronic diagnosis — **to be recruited** (candidate: a colleague or a relative of the team, contacted in person) | — | Sara | **planned — TODO: interview not conducted yet** |
| 4 | Primary-care professional (therapist / cardiologist) | Therapist or cardiologist with outpatient experience, 3+ years — **to be recruited** (candidate: a clinic contact of the team or the supervisor) | — | Sara | **planned — TODO: interview not conducted yet** |
| 5 | Client representative / supervisor (Bakiyeva A.M.) | _(to fill)_ | | Muslim | planned |

**Notes on the plan**

- Row 4 was originally assigned to Muslim in the draft of this file; it is assigned to **Sara**
  here because DIP-44 (the task this log belongs to) covers the two discussions assigned to
  the front-end/UX part of the team. Reassign it in YouTrack if the team decides otherwise.
- The `Date` column stays empty on purpose: an empty cell means *not yet conducted*. A date
  is written only after the discussion has actually happened.
- The `Who (planned)` column describes the respondent **anonymously**. No names, no contact
  details and no medical data of a participant are ever written into this repository
  (see §5).
- Recruitment constraint: two of the three team members are full-time students with jobs, so
  the interviews have to be scheduled in a narrow time window. Each discussion is ≈15 minutes
  (§2), which fits into one lunch break.

## 2. Interview protocol (≈15 min, semi-structured)

1. How do you currently find out about your risk of heart disease / diabetes?
2. Have you used online risk calculators (Framingham, SCORE, CDC test, Ada)? What was
   missing or confusing?
3. What data about yourself are you willing to enter into such a tool? What would make you
   abandon the form?
4. What does "high risk" mean to you? What would you do after seeing it?
5. How important is it to know *why* the tool thinks your risk is high? How would you like
   that explanation to look?
6. Where would you use it: phone, laptop? Would you create an account to save history?
7. (For the doctor) Which factors are indispensable in a first-pass patient risk estimate?
   What would make you distrust such a tool?

**Consent:** verbal consent recorded in the discussion log; no personal medical data of the
respondent is stored in the repository — only anonymized conclusions.

### 2.1 Question sets for the two interviews assigned to Sara

The seven questions above are the common core. The two interviews use the same core with
different emphasis, so that the two roles can be compared.

**Respondent 3 — non-technical user with lower health literacy (≈15 min)**

| # | Question | What we are trying to learn | Links to |
|---|---|---|---|
| 3.1 | "How do you find out about your risk of heart disease or diabetes today?" | current behaviour, whether the topic is even on their radar | FR-03 |
| 3.2 | "Have you ever used a health quiz or risk calculator online? What was confusing or missing?" | expectations set by existing tools (comparison document) | FR-03, FR-04 |
| 3.3 | "Which of these would you be willing to type in: your age, your height and weight, your blood pressure, your cholesterol, your blood sugar?" | which inputs are available to a layperson → which questions must be optional | FR-01 |
| 3.4 | "What would make you close the form halfway through?" | abandonment reasons, form length | FR-01 |
| 3.5 | "If the tool says your risk is high — what do you think that means, and what would you do next?" | correct understanding of the *risk* concept, need for a "who to talk to" block | FR-03, NFR-05, NFR-06 |
| 3.6 | "Would you want to know *why* it says that? How should it explain it?" | wording and format of the factor explanation | FR-04 |
| 3.7 | "Phone or laptop? Would you create an account to keep the history?" | device, FR-05/FR-06 relevance | FR-05, FR-07 |

**Respondent 4 — primary-care professional (≈15 min)**

| # | Question | What we are trying to learn | Links to |
|---|---|---|---|
| 4.1 | "How do you estimate the risk of a first visit today — Framingham, SCORE, your own judgement?" | the clinical baseline the product must not embarrass | FR-02, DIP-16 |
| 4.2 | "Which factors are indispensable in a first-pass risk estimate, and which are a waste of the patient's time?" | the minimum viable input set → the 12-question budget | FR-01 |
| 4.3 | "What would make you distrust such a tool?" | trust conditions: calibration, missing data, population | NFR-07, NFR-09 |
| 4.4 | "How do you want the explanation presented — numbers, ranked list, or a sentence?" | format of the SHAP explanation | FR-04 |
| 4.5 | "Which patients would you send to such a tool, and which would you not?" | the intended user segment and the screening boundary | proposal §3 |
| 4.6 | "What should the tool explicitly *not* do?" | safety boundary, confirms the "no diagnosis / no treatment" rule | NFR-06, proposal §7.2 |
| 4.7 | "Would you want the patient's own answers in front of you during the consultation?" | value of the report as a consultation aid (secondary user) | FR-03, FR-04 |

## 3. Findings log (verified findings vs. assumptions)

**Rules of this log**

- An item may be marked *verified* only if ≥2 independent respondents stated it or one
  respondent + documentary evidence. Everything else stays an *assumption* and is labelled
  as such in the requirements spec.
- An assumption is never presented as a finding of the research. It states what the team
  believes, where the belief comes from, and which requirement it affects.
- **TODO (Sara, DIP-44):** after the two interviews, add one row per finding with the
  anonymized formulation, the source (respondent number), and the requirement impact.

| # | Statement | Type: **verified finding** (from a discussion) / **assumption** (our guess) | Source | Impact on requirements |
|---|---|---|---|---|
| 1 | Users abandon long forms (>15 fields) | assumption | — | keeps FR-01 at ≤12 questions |
| 2 | A non-technical user usually does not know their own lab values (cholesterol, glucose) and would rather skip them than guess | assumption | design review of the prototype form (DIP-8): the four measurement questions are marked optional and can be left empty | FR-01 acceptance criterion must accept missing values; the questionnaire must not force a number |
| 3 | The word "risk" is understood by a layperson, but "probability" and "SHAP" are not | assumption | wording review of the prototype report (DIP-8): the factor list is phrased as "increases / decreases your risk" instead of using the model terminology | FR-03 (plain-language summary) and FR-04 (factor explanation must be phrased for a non-technical reader) |
| 4 | A risk report without a "who do I talk to next" block feels like a dead end and reduces trust | assumption | safety rewrite of the prototype result screen (DIP-8): the lifestyle-advice list was replaced by "Who can help you interpret this result" and "Questions you can ask" | FR-03, NFR-05 (comprehension), NFR-06 (safety wording) |
| 5 | A probability shown without a disclaimer above it can be read as a diagnosis | assumption | placement review of the prototype result screen (DIP-8): the disclaimer is repeated at the top, at the bottom and in the footer | NFR-06 — the disclaimer must be visible *before* the number, not only after the page |
| 6 | First-time visitors prefer guest mode; asking for an account before the first result loses people | assumption | prototype entry screens (DIP-8, FR-05): guest mode is offered first, the account is optional | FR-05 — guest mode stays the default path, the account only adds FR-06 |
| 7 | *(placeholder for respondent 3)* | — | respondent 3 (TODO: not conducted yet) | TODO: fill after the interview |
| 8 | *(placeholder for respondent 4)* | — | respondent 4 (TODO: not conducted yet) | TODO: fill after the interview |

**Why no row is marked as a *verified finding* yet.** No discussion has taken place, so no
statement in this table is backed by a respondent. Rows 2–6 are the design decisions the
team already made in DIP-8, written down as explicit assumptions so that the interviews can
either confirm or overturn them. They must not be cited as research evidence in the
presentation.

## 4. Discussion log template (to be completed after each interview)

One block per discussion. Copy the template, fill it in, keep it short and anonymized.

```markdown
### Discussion <n> — <role of the respondent>

- Date: <YYYY-MM-DD>
- Conducted by: <name>
- Format: in person / phone / online call, <duration> min
- Consent: verbal consent obtained, <yes/no>; permission to take anonymous notes: <yes/no>
- Recording: none / audio only, deleted after the notes were written
- Respondent (anonymized): <age range, occupation type, relevant non-medical context,
  e.g. "woman, 30–35, office administrator, no medical background">
- Personal medical data of the respondent: NOT recorded in the repository

**What was actually asked and answered** (paraphrase, no verbatim quotes of medical content)

- Q<n> <question>: <what the participant said, anonymized>
- ...

**Conclusions (anonymized)**

1. <finding>
2. <finding>

**Requirement impact**

| Finding | Type (verified / assumption) | Requirement affected | Change needed in the requirements spec |
|---|---|---|---|
| | | | |

**Follow-up:** <what to re-test, with whom>
```

## 5. Data protection and research ethics

- **No personal medical data of a participant enters this repository.** Only anonymized
  conclusions are written down. Values that a participant reported about their own health
  (blood pressure, cholesterol, diagnoses, medication) are not recorded — not even as
  examples — because a repository is a public artefact (see `CONTRIBUTING.md` §4 and NFR-04).
- Participants are described by an age range and a non-identifying occupation type only.
- No names, no contact details, no employer, no clinic name, no screenshots of a personal
  record.
- Verbal consent is obtained before the discussion and the participant may refuse any
  question. The fact that consent was obtained is recorded; the content of the consent
  conversation is not.
- The discussions are a **teaching aid for a diploma project**, not a clinical study. This is
  stated in the proposal §7.2 and is repeated in the presentation.
- If a participant asks for a recommendation during the discussion, the answer is: "I am a
  student building a research prototype — I cannot give medical advice; please discuss this
  with your doctor." This limitation is also a good observation to note for the product.

## 6. Recruitment plan (open)

| # | Respondent | Where to find one | Planned | Status |
|---|---|---|---|---|
| 3 | Non-technical adult, lower health literacy | Personal network of the team; a colleague without a medical background; a short anonymous survey in a student group chat | week of 20 Oct 2026 | **TODO: not scheduled** |
| 4 | Therapist / cardiologist | A clinic contact of the team; a family member working in primary care; the supervisor's contacts | week of 20 Oct 2026 | **TODO: not scheduled** |

> **TODO (Sara, DIP-44):** schedule both discussions before 20 October 2026, run them with
> the protocol in §2, fill §4 for each, and update §1 and §3. If a participant cannot be
> found in time, record the attempts (where and when) here — an honest "no respondent
> could be recruited" is acceptable evidence for the supervisor; invented answers are not.
