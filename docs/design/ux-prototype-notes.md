# UX Prototype Notes — MedRisk

**Author:** Sara Mukhammad (SE-2419) · **Task:** DIP-8 · **Stage:** pre-defense 0 (M0)
**Companion documents:** [requirements specification](../requirements/requirements-specification.md),
[architecture description](../architecture/architecture-description.md),
[user research](../evidence/user-research.md), [prototype README](../../prototype/README.md)

This document explains *who* the prototype is for, *what* the screens do, *why* the main UX
decisions were taken, what the prototype still cannot do, and how the design will be judged
in the usability test. It is the written justification behind the mockups in `prototype/`.

---

## 1. Personas

Personas are derived from the target-user table in the [project proposal](../proposal/project-proposal.md)
and from the roles in the [architecture description](../architecture/architecture-description.md)
(use-case diagram: Guest, Registered user, Admin). They are **hypotheses** — they will be
replaced by real interview evidence (DIP-44) and by the usability test participants (DIP-39).

### P1 — "Aizada", 45, office manager *(primary user)*

Non-technical, no chronic diagnosis. Has been told by a colleague that "high blood pressure
runs in the family" and wants to know whether she is "at risk". She does not know her
cholesterol numbers and would not want to guess them. Her main question is not "what is my
risk?" but "what do I do with this?".

- Goals: a plain-language estimate, an explanation, and a clear next step.
- Barriers: medical vocabulary, fear of being told "you are sick", long forms.
- Success looks like: she can name her strongest risk factor and says who she will talk to.

### P2 — "Batyr", 61, retired teacher *(primary user, lower health literacy)*

Smokes occasionally, has been diagnosed with hypertension, is not sure what his blood
pressure was last year. Reads instructions slowly, uses a phone more often than a laptop,
navigates with a screen reader turned on for longer texts.

- Goals: complete the form with as little reading as possible.
- Barriers: small text, jargon ("mmHg", "HDL"), fear of making a mistake.
- Success looks like: he finishes the questionnaire without asking for help.

### P3 — "Dr. A.", therapist *(secondary user, planned)*

Uses a structured summary during the first consultation. Does not want a black box: she
wants to see which factors drove the number and which data are missing.

- Goals: a one-screen summary she can trust and read out.
- Barriers: an interface that is slower than asking three questions.
- Success looks like: she checks the report against the patient record in under a minute.

### P4 — system administrator / researcher *(internal)*

Needs the model version, the evaluation metrics and the list of accounts.

- Goal: verify that a result comes from a known model version (NFR-08).
- Not covered by the prototype — the admin surface is out of scope for M0 (FR-08, DIP-33).

---

## 2. User scenarios (mapped to the mockups)

| # | Scenario | Screen | Requirements |
|---|---|---|---|
| S1 | A first-time visitor understands the offer, understands that it is *not* a diagnosis, and starts | `index.html` | FR-03, NFR-06, NFR-05 |
| S2 | A guest answers the questionnaire, skips unknown measurements, and is told which fields are invalid | `assessment.html` | FR-01, FR-05 |
| S3 | The user reads two risk estimates with their categories, sees the factors in plain language and learns who can help | `result.html` | FR-02, FR-03, FR-04, NFR-06 |
| S4 | A registered user reviews the history, sees the trend and controls their data | `dashboard.html` | FR-06, FR-07, NFR-04 |
| S5 | A visitor chooses guest mode or an account | `login.html` | FR-05 |

---

## 3. Key UX decisions and the reasoning behind them

### 3.1 The questionnaire has exactly 12 answerable questions (FR-01)

`FR-01` fixes the questionnaire at **≤ 12 questions**. The mockup uses all 12 slots:

| # | Question | Input | Section |
|---|---|---|---|
| 1 | Age | number 18–90 | About you |
| 2 | Sex | radio | About you |
| 3 | Height | number 120–230 | About you |
| 4 | Weight | number 30–250 | About you |
| 5 | Systolic blood pressure | number 80–250 | Measurements *(optional)* |
| 6 | Total cholesterol | number 2–15 | Measurements *(optional)* |
| 7 | HDL cholesterol | number 0.5–4 | Measurements *(optional)* |
| 8 | Fasting glucose | number 2–30 | Measurements *(optional)* |
| 9 | Smoking | radio | Lifestyle & history |
| 10 | Physical activity ≥ 150 min/week | radio | Lifestyle & history |
| 11 | Diagnosed hypertension | radio | Lifestyle & history |
| 12 | Family history (first-degree) | radio | Lifestyle & history |

**Why 12 and not more.** The literature review and the interview protocol both point at
form fatigue as the main abandonment reason. Because the limit is a hard requirement, any
new input (for example HbA1c, which `FR-01` also mentions) must **displace** an existing
question rather than be appended. The decision on what is displaced is listed as an open
question for the supervisor (§6).

**Note on height + weight.** The two fields produce one indicator (BMI), so the 12 inputs
correspond to 11 clinical indicators. This is stated explicitly so the committee is not
counting "12 questions" against the FR-01 limit.

### 3.2 The four measurement questions are optional, and this is visible

`FR-01` and the [verification plan](../verification/verification-and-evaluation-plan.md) §2
both assume that missing values are allowed ("the questionnaire allows *I don't know*").
Guessing a blood-pressure number would silently corrupt the input, so the mockup:

- marks the section "optional — leave empty if you do not know";
- allows empty values, but validates a value **if** one is entered (range check);
- shows a progress counter that distinguishes *answered* from *required*.

**Why the progress bar counts 12, not 8.** A bar that only counts required questions would
jump to 100 % and hide the fact that four questions are still open. A bar that only counts
optional questions would never reach 100 % for a user without lab results. The counter
therefore shows "N of 12 answered · M of 8 required · 4 optional measurements can be
skipped", and `aria-valuetext` repeats the same information for screen readers.

### 3.3 The result screen separates *your input* from *the estimate*

The mockup shows two blocks: "What you entered" (the values actually submitted) and
"Estimated risk" (the illustrative example). They are never merged, and the estimate block
carries the label **"Illustrative example — not a real model output"**.

**Why.** The committee and future users must not confuse a mockup with a working model.
Keeping the input visible also lets a user check whether a typo (a 1 420 mmHg reading)
produced a strange result — a self-check that a single percentage cannot offer.

### 3.4 Risk levels are never communicated by colour alone

Every risk level is rendered as a **text label + a symbol** (`●` low, `◆` moderate, `▲`
high, `■` very high) inside a tinted badge, and the factor list repeats the direction in
words (`▲ increases`, `▼ decreases`) next to the bar. The bars themselves are
`aria-hidden="true"` decorative elements; the meaning lives in the text.

**Why.** Colour-only encoding fails for users with a colour-vision deficiency, on
monochrome displays and in greyscale printouts — and this is exactly the "not colour only"
criterion of WCAG 2.1 (1.4.1 Use of Color).

### 3.5 The disclaimer is at the top of the result screen, not only at the bottom

`NFR-06` and `FR-03` require a visible "this is not a diagnosis" disclaimer on every risk
output. On the result screen the disclaimer appears (a) immediately under the page title,
(b) in the footer of every page, and (c) again in the closing paragraph. The footer
disclaimer is repeated on the landing page and on the history screen, because both also
show risk numbers.

**Why.** A disclaimer at the bottom of a long screen is easy to miss. Placement at the top
means the user reads the caveat *before* the number, not after it.

### 3.6 The report says **who** can help — and nothing else

The section "Who can help you interpret this result" names the roles (primary-care
physician / therapist / GP first; cardiologist or endocrinologist if a diagnosis already
exists) and lists **questions the user can ask**. A separate block "What this tool cannot
tell you" states explicitly that MedRisk cannot diagnose, cannot recommend treatment or
medication, and cannot judge an acute condition.

**Why.** The project scope excludes diagnosis, triage and treatment recommendations
([proposal §7.2](../proposal/project-proposal.md)). Removing the earlier "What you can do
next" list (which came close to lifestyle advice) and replacing it with "who to talk to and
what to ask" keeps the interface inside the decision-support scope while still giving the
user an actionable next step. This was the single most important safety edit of DIP-8.

### 3.7 The prototype degrades gracefully without JavaScript

`js/prototype.js` only *adds* the progress indicator, the inline validation and the echo of
the submitted answers. Without JavaScript the pages remain readable, every link works and
the form still submits to the result page through a plain HTML `GET`.

**Why.** The mockup has to be openable by the committee on any machine, and the prototype
must not create a dependency on a build step before DIP-35 introduces React.

### 3.8 Accessibility decisions

| Decision | Reason |
|---|---|
| `<label for>` on every field, `<fieldset>`/`<legend>` for the four radio groups | Programmatic name for every control (WCAG 1.3.1, 3.3.2, 4.1.2) |
| Visible 3 px focus outline on every interactive element, `:focus-visible` + fallback | WCAG 2.4.7, 2.4.11 |
| `lang="en"` on `<html>` | WCAG 3.1.1 |
| Landmarks: `header`, `nav[aria-label]`, `main#main`, `footer`; skip link to the main content | WCAG 1.3.1, 2.4.1 |
| Errors: a summary at the top of the form (`role="alert"`) **and** a message next to the field, referenced by `aria-describedby`, with `aria-invalid="true"` and focus moved to the first invalid field | WCAG 3.3.1, 3.3.3 |
| `aria-current="page"` on the active navigation item | WCAG 4.1.2 |
| The trend chart is an `<svg role="img">` with `<title>`/`<desc>`, and the same data is repeated in a table | WCAG 1.1.1 — no information that exists only in a picture |
| `aria-valuetext` on the progress element | The raw `value` ("5") means nothing to a screen reader |
| Decorative bars are `aria-hidden="true"` | The text next to them carries the meaning |
| No images at all in the mockups | No alt-text debt; the logo mark is decorative and marked `aria-hidden` |

### 3.9 Measured contrast (WCAG 2.1 AA)

Every text colour and every meaningful border was measured with the WCAG 2.1 relative
luminance formula. Body text needs **4.5:1**, large text and UI component boundaries need
**3:1**.

| Foreground | Background | Ratio | Requirement | Result |
|---|---|---|---|---|
| `#15211f` body text | `#ffffff` card | 16.55:1 | 4.5:1 | pass |
| `#15211f` body text | `#f4f7f6` page | 15.35:1 | 4.5:1 | pass |
| `#4d5f5b` muted text | `#ffffff` | 6.77:1 | 4.5:1 | pass |
| `#4d5f5b` muted text | `#f4f7f6` | 6.28:1 | 4.5:1 | pass |
| `#0a6b56` brand / links | `#ffffff` | 6.46:1 | 4.5:1 | pass |
| `#0a6b56` brand / links | `#f4f7f6` | 5.99:1 | 4.5:1 | pass |
| `#07503f` headings | `#ffffff` | 9.42:1 | 4.5:1 | pass |
| `#ffffff` button label | `#0a6b56` button | 6.46:1 | 4.5:1 | pass |
| `#ffffff` button label | `#07503f` button hover | 9.42:1 | 4.5:1 | pass |
| `#0a6b56` focus ring | `#ffffff` / `#f4f7f6` | 6.46:1 / 5.99:1 | 3:1 | pass |
| `#6d8880` input border | `#ffffff` / `#f4f7f6` | 3.83:1 / 3.55:1 | 3:1 | pass |
| `#0b5c3c` low risk | `#e3f5ec` | 7.10:1 | 4.5:1 | pass |
| `#7a5200` moderate risk | `#fdf1d6` | 6.17:1 | 4.5:1 | pass |
| `#8a3b00` high risk | `#fde8dc` | 6.56:1 | 4.5:1 | pass |
| `#8c1f1f` very high risk | `#fbe0e0` | 7.22:1 | 4.5:1 | pass |
| `#4a2a09` disclaimer text | `#fde8dc` disclaimer | 10.92:1 | 4.5:1 | pass |
| `#5f5010` mockup note | `#fffbe6` | 7.64:1 | 4.5:1 | pass |
| `#8c1f1f` field error | `#fbe0e0` | 7.22:1 | 4.5:1 | pass |
| `#8c1f1f` "increases" bar | `#e4ece9` track | 7.50:1 | 3:1 | pass |
| `#0b5c3c` "decreases" bar | `#e4ece9` track | 6.69:1 | 3:1 | pass |

The palette is formalised as design tokens in DIP-19
([design system](../design/design-system.md), `frontend/src/styles/tokens.css`).

---

## 4. Limitations of the current prototype

1. **No model.** The risk values, categories, factor ranking and the trend chart are
   fabricated for the layout. They are labelled as illustrative on every screen.
2. **No persistence.** Guest answers live in the URL query string of the result page; the
   history screen is static.
3. **Prototype-level validation only.** Ranges and required fields are checked in the
   browser. The authoritative validation is the API contract (DIP-30, DIP-36).
4. **English only.** `FR-12` requires all UI strings to live in a translation table so that
   Russian and Kazakh can be added later; the mockup has hard-coded strings and is the
   place where the string list should be extracted.
5. **Not yet tested with users.** The persona assumptions and the wording of the factor
   explanations have not been validated — that is the job of DIP-44 and DIP-39.
6. **Two charts are drawings.** The trend chart is hand-computed SVG; the real one needs a
   charting library and real data (FR-07, DIP-38).
7. **No responsive design beyond the grid.** The pages reflow to a single column below
   760 px, but they have not been checked on a real phone.

## 5. Planned changes

| # | Change | Target task | Reason |
|---|---|---|---|
| 1 | Replace the mockup with the React application and the generated API client | DIP-35 | `FR-13`, real contract instead of a guessed one |
| 2 | Move the questionnaire into a component with server-side-driven validation messages | DIP-36 | `FR-01`, single source of truth for the rules |
| 3 | Replace the factor list with real SHAP contributions and generated plain-language sentences | DIP-37 | `FR-04` |
| 4 | Real history, real trend chart, real deletion | DIP-38 | `FR-06`, `FR-07`, `NFR-04` |
| 5 | Extract all strings into an i18n table (en → ru → kz) | DIP-36 / DIP-37 | `FR-12` |
| 6 | Add the "data quality" hint: which measurements are missing and how that affects the estimate | DIP-37 | transparency for low-health-literacy users |
| 7 | Re-check the wording of every disclaimer with the supervisor and the doctor-interview participant | DIP-44 | `NFR-06` |
| 8 | Turn the tokens into the shared style guide | DIP-19 | consistency between prototype and product |

## 6. Open questions for the supervisor and the team

1. **The 12-question budget.** If `HbA1c` is added (it is mentioned in `FR-01` as an
   alternative to glucose), which of the 12 current questions is replaced? *This blocks the
   final field list of DIP-36 and therefore the API contract of DIP-30.*
2. **Risk categories.** Four categories (low / moderate / high / very high) are used in the
   mockup. The thresholds come from the model output — should the prototype wording be
   aligned with the Framingham-style cut-offs already used in the baselines (DIP-16)?
3. **Tone.** Is "risk level" the right term for a low-health-literacy audience, or should
   the screen say "chance of developing … in the next 10 years"?
4. **Doctor guidance.** The mockup names the therapist/GP first and the cardiologist or
   endocrinologist second. The doctor-interview participant (DIP-44) should confirm this
   order.

---

## 7. Usability criteria (for DIP-39)

The following criteria are the acceptance criteria of the usability test. They restate
`NFR-05` (SUS ≥ 70, n ≥ 5) and add the questionnaire-specific limits from `FR-01`.

### 7.1 Tasks

| # | Task (as read to the participant) | Success criterion |
|---|---|---|
| T1 | "Complete the health questionnaire as a guest." | All required fields answered and the report opened, ≤ 5 min, ≤ 1 hint from the moderator |
| T2 | "Find the two risk numbers on the report." | Both numbers located and read aloud, ≤ 30 s |
| T3 | "Name your strongest risk factor." | Correct factor named, ≤ 60 s |
| T4 | "Say where you would go next with this result." | Names a doctor or a health service (not "the internet", not "medication") |
| T5 | "Save the assessment to your account and find it in the history." | The assessment appears in the history list |

### 7.2 Metrics and thresholds

| Metric | Target | Source |
|---|---|---|
| SUS score | ≥ 70 | `NFR-05` |
| Task success rate | ≥ 90 % | verification plan §7 |
| Comprehension of the risk level | ≥ 80 % correct | verification plan §7 |
| Time on T1 | ≤ 5 min | this document |
| Number of questions | 12 (hard limit) | `FR-01` |
| Fields left empty by mistake | 0 | `FR-01` |
| Participants who mistake the result for a diagnosis | 0 | `NFR-06` |

### 7.3 Interpretation rules

- A participant who asks "do I have heart disease?" has **not** understood the safety
  message — this counts as a failure of T4 and is recorded separately.
- If the SUS score is below 70, the result is not a reason to hide the number: the
  improvement plan is written into the DIP-39 report and the UX backlog.
- Results are recorded in the table of
  [docs/evidence/usability-test-protocol.md](../evidence/usability-test-protocol.md).
  **The protocol is ready; the test itself has not been run yet — no results are
  recorded in this document.**
