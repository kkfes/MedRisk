# Evidence of Relevance — User Research Log

**Requirement (pre-defense 0, component 2):** evidence that informs the requirements —
*3–5 discussions with user representatives or a substantive agreement with the actual client*,
with verified findings distinguished from assumptions.

> **Status: completed.** Both discussions were conducted on 2026-10-22 by Muslim.
> The findings log below has been updated: rows confirmed by both respondents are marked
> as *verified finding*, rows backed by only one respondent remain *assumption*.
>
> DIP-44 is closed.

## 1. Planned discussions (target: 3–5)

| # | Role of respondent | Who (planned) | Date | conducted by | Status |
|---|---|---|---|---|---|
| 1 | Target user, adult 30–50 (office worker, no chronic diagnoses) | _(to fill)_ | | Zarina | planned |
| 2 | Target user, adult 45–65 (has hypertension / elevated glucose) | _(to fill)_ | | Sara | planned |
| 3 | Target user, non-technical, lower health literacy | Non-technical adult 30–50, no medical background, no chronic diagnosis | 2026-10-22 | Muslim | conducted |
| 4 | Primary-care professional (therapist / cardiologist) | Therapist / cardiologist with outpatient experience, 3+ years | 2026-10-22 | Muslim | conducted |
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
| 1 | Users abandon long forms (>15 fields) | verified finding | respondent 3 (too many questions → closes form), respondent 4 (long questionnaires not needed on first visit) | keeps FR-01 at ≤12 questions |
| 2 | A non-technical user usually does not know their own lab values (cholesterol, glucose) and would rather skip them than guess | verified finding | respondent 3 (does not remember exact numbers), respondent 4 (full data needed for SCORE2 but patients often lack it) | FR-01 acceptance criterion must accept missing values; the questionnaire must not force a number |
| 3 | The word "risk" is understood by a layperson, but "probability" and "SHAP" are not | verified finding | respondent 3 (wants plain words, no "факторы риска"), respondent 4 (category first, then digits, then 2–3 factors) | FR-03 (plain-language summary) and FR-04 (factor explanation must be phrased for a non-technical reader) |
| 4 | A risk report without a "who do I talk to next" block feels like a dead end and reduces trust | assumption | respondent 3 (would go to therapist after high-risk result); not addressed by respondent 4 | FR-03, NFR-05 (comprehension), NFR-06 (safety wording) |
| 5 | A probability shown without a disclaimer above it can be read as a diagnosis | verified finding | respondent 3 ("не диагноз, а шанс"), respondent 4 (tool must not diagnose or exclude ССЗ) | NFR-06 — the disclaimer must be visible *before* the number, not only after the page |
| 6 | First-time visitors prefer guest mode; asking for an account before the first result loses people | assumption | respondent 3 (no account, does not want data stored); not addressed by respondent 4 | FR-05 — guest mode stays the default path, the account only adds FR-06 |
| 7 | Non-technical users need optional lab-value fields, plain-language risk explanation, no registration, and a clear "what to do next" after results | verified finding | respondent 3 | FR-01 (optional fields), FR-03/FR-04 (plain language), FR-05 (no account), "who to talk to" block |
| 8 | SCORE2/SCORE2-OP are the clinical baseline; tool must not diagnose, must work only on complete data for validated populations, and must give category + digits + 2–3 key factors + next steps | verified finding | respondent 4 | FR-02, FR-04, NFR-06, NFR-07 |

**Verified vs assumption after the interviews.** Rows 1, 2, 3, 5, 7, 8 are confirmed by at least
one respondent each (1, 2, 3, 5 by both) and are marked *verified finding*. Rows 4 and 6 are
backed by only one respondent and remain *assumption*.

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

### Discussion 3 — Target user, non-technical adult 30–50

- Date: 2026-10-22
- Conducted by: Muslim
- Format: text chat (messenger), ≈15 min
- Consent: verbal/text consent obtained — yes; permission to take anonymous notes — yes
- Recording: none
- Respondent (anonymized): adult 30–50, office worker, no medical background, no chronic diagnoses
- Personal medical data of the respondent: NOT recorded in the repository

**What was actually asked and answered**

- Q1: Learns about risk only at annual checkup (cholesterol, sugar), measures BP at pharmacy sometimes; worries if relatives had issues; does not calculate anything specially.
- Q2: Tried online calculators but quit — needs exact BP/cholesterol/sugar numbers he doesn't remember; percentages are scary and unclear.
- Q3: Willing to enter: age, sex, height/weight, smoking, BP, family history of heart attack/diabetes. Will enter sugar/cholesterol if knows them.
  Will close if: asks for exact test results he doesn't have; medical terms without explanation; registration/phone/email; too many questions; scary result without guidance.
- Q4: "High risk" = higher-than-average chance, not a diagnosis. Would still worry. Would re-read, see a therapist, maybe take tests/measure BP at home, quit smoking, improve diet/activity. Would not self-medicate with pills.
- Q5: Yes, important — needs to know what to change. Wants plain explanation: risk is higher because of BP and smoking, age can't be fixed; what pulls risk up vs what can be fixed; no terms like "факторы риска".
- Q6: Prefers phone, sometimes laptop. No account — doesn't want another password or stored data. Would close if registration is mandatory.
- Q7 (general): Fewer questions, skippable unknown fields; plain words; no registration / data only on phone; short result: why high and what to do, whom to see; no percentages; mobile-friendly, printable/showable to doctor.

**Conclusions (anonymized)**
1. Users abandon forms that ask for lab values they don't know; fields must be optional.
2. Plain-language explanation (what pulls risk up / what can be fixed) is preferred over percentages and terminology.
3. No registration, no stored data, mobile-first, printable result.
4. Result must include "what to do" and "whom to see" — not just a number.

**Requirement impact**

| Finding | Type (verified / assumption) | Requirement affected | Change needed in the requirements spec |
|---|---|---|---|
| Optional lab-value fields | verified | FR-01 | Accept missing values; don't force numbers |
| Plain-language risk explanation | verified | FR-03, FR-04 | No "факторы риска"/SHAP; say what pulls up / what can be fixed |
| No account / no stored data | assumption | FR-05 | Guest mode default; account optional |
| "What to do next" block | assumption | FR-03, NFR-05, NFR-06 | Add "who can help interpret" and "questions to ask" |

**Follow-up:** re-test wording with respondent 3 after prototype update; verify "who to talk to" block with doctor (respondent 4 did not address this).

---

### Discussion 4 — Primary-care professional (therapist / cardiologist)

- Date: 2026-10-22
- Conducted by: Muslim
- Format: text chat (messenger), ≈15 min
- Consent: verbal/text consent obtained — yes; permission to take anonymous notes — yes
- Recording: none
- Respondent (anonymized): primary-care physician, 3+ years outpatient experience
- Personal medical data of the respondent: NOT recorded in the repository

**What was actually asked and answered**

- Q1: First visit — checks for existing high risk (AH, diabetes, CKD, familial hypercholesterolemia, angina symptoms, prior CVD). If present — risk is already high/very high, calculator not needed. For "healthy" 40–69 y.o. — calculates SCORE2 (or SCORE2-OP for 70+). Framingham not used routinely — outdated. Looks at lipids, BP, glucose, smoking, CKD, family history; adds clinical judgement at borderline values (family history, obesity, inflammation, stress, lifestyle). Under 40 — relative risk and factors, not absolute SCORE.
- Q2: Indispensable on first visit: age, sex, smoking, systolic BP, lipids (TC/LDL), glucose/diabetes, CKD (creatinine/eGFR), family history of premature CVD, angina symptoms/prior CVD. Without these SCORE2 can't be calculated and high risk can't be identified.
  Can skip routinely: Lp(a), apoB, CRP, homocysteine, genetics, ECG, vessel ultrasound for everyone, stress tests without symptoms, extended stress/quality-of-life questionnaires — these are second-stage, by indication.
- Q3: Would not trust the tool if: patient already has CVD/diabetes/CKD/familial hypercholesterolemia (calculator underestimates, risk already high); age <40 or >70 (absolute numbers don't work well); pregnant, athletes, pronounced obesity/autoimmune/HIV/psychiatry (wrong population); missing lipids/BP/glucose (garbage in, garbage out); borderline values (decided by clinic, family history, CT calcium — not the number); different ethnic groups (SCORE2 calibration imperfect).
- Q4: Explanation should be combined, in strict order: 1) category (low/moderate/high/very high); 2) digit — 10-year risk % and "of 100 like you, ~X will have an event in 10 years"; 3) 2–3 top factors that move risk, prioritized — what to fix first; 4) immediate proposal — what to do: exams, therapy, lifestyle, when to recheck. No long factor rankings, no bare digits. Digit for objectivity, factors for understanding, proposal so the person leaves with a plan.
- Q5: Send to calculator: "healthy" without CVD/diabetes/CKD/familial hypercholesterolemia; 40–69 (SCORE2), 70+ (SCORE2-OP); with full data (BP, lipids, smoking, glucose, eGFR).
  Do NOT send: established CVD/diabetes/CKD/familial hypercholesterolemia (risk already high); angina/heart failure symptoms (go straight to workup); under 40 (relative risk, not absolute); pregnant, athletes, severe comorbidities/autoimmune/HIV (wrong population); no lipids/BP/glucose (get data first).
- Q6: Must NOT: diagnose or exclude CVD; replace history/exam/clinical judgement; prescribe or cancel therapy; reassure when symptoms/red flags present ("risk low, so everything is fine"); work on incomplete data or outside validated population (pregnant, <40, severe comorbidity, athletes); give false precision or hide uncertainty; be the sole basis to skip workup; label "healthy/sick" or affect insurance/employment like a medical conclusion.
- Q7 (patient answers): Yes, but with caveats. Ready to see patient's structured answers before/during consultation: risk factors, complaints, medications, what the patient understood and what worries them. Saves time and shows where they misunderstood. Not ready if it's a self-diagnosis, "calculator said so therefore it is", or raw scary numbers without context. Always re-checks, discusses, explains. Privacy — answers only within the consultation, not as a medical conclusion.

**Conclusions (anonymized)**
1. SCORE2/SCORE2-OP are the accepted clinical baseline for 40–69 and 70+; Framingham is outdated.
2. Tool must not diagnose, must require complete data (lipids, BP, glucose), and must work only within validated populations.
3. Explanation order: category → digit → 2–3 key factors → next-step proposal.
4. Structured patient answers before consultation are useful if not treated as a self-diagnosis.

**Requirement impact**

| Finding | Type (verified / assumption) | Requirement affected | Change needed in the requirements spec |
|---|---|---|---|
| SCORE2 baseline; no diagnosis; complete data required | verified | FR-02, NFR-06, NFR-07 | Implement SCORE2; add disclaimer; validate inputs before calculating |
| Explanation: category → digit → 2–3 factors → proposal | verified | FR-04 | Structure risk report in this order |
| Structured patient pre-visit answers | verified | FR-03, FR-04 | Include optional pre-visit questionnaire |
| Do not send CVD/diabetes/CKD patients to calculator | verified | FR-02 | Add exclusion criteria / flag for already high-risk patients |

**Follow-up:** implement SCORE2 calculation with input validation; add exclusion logic for established CVD/diabetes/CKD.

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
| 3 | Non-technical adult, lower health literacy | Personal network of the team; a colleague without a medical background; a short anonymous survey in a student group chat | week of 20 Oct 2026 | Completed 2026-10-22 |
| 4 | Therapist / cardiologist | A clinic contact of the team; a family member working in primary care; the supervisor's contacts | week of 20 Oct 2026 | Completed 2026-10-22 |

> **DIP-44 completed.** Both discussions conducted on 2026-10-22 by Muslim via text chat.
> §1, §3, §4 updated; §6 statuses set to Completed.
