# MedRisk Prototype (mockups)

> **Status: design sketches, not the final design.** These static pages exist to
> discuss and validate user scenarios with real users and the supervisor. Visual style,
> information architecture, wording and the set of screens **will change** after that
> feedback, and the current backend design is likewise an approximate variant that may
> change during implementation.
>
> **No model is running.** Every percentage, badge and factor on the result screen is a
> fixed **illustrative example** — it is not a real model output and it is not calculated
> from the answers you type.

## Scenarios covered (UX / prototype, pre-defense 0)

| # | User scenario | Mockup | Requirements covered |
|---|---|---|---|
| S1 | First-time visitor understands what the system does and starts an assessment | [index.html](index.html) | FR-03 (disclaimer), NFR-05 (usability), NFR-06 (safety) |
| S2 | Guest fills the health questionnaire (incl. "I don't know" values) | [assessment.html](assessment.html) | FR-01, FR-05 (guest mode) |
| S3 | User receives the risk report: two risks, categories, factor attribution, who can help, disclaimer | [result.html](result.html) | FR-02, FR-03, FR-04, NFR-06 |
| S4 | Registered user views assessment history, trends and manages own data | [dashboard.html](dashboard.html) | FR-06, FR-07, NFR-04 (privacy) |
| S5 | User chooses between guest mode and signing in | [login.html](login.html) | FR-05 |

## How to open the prototype

**Option 1 — double-click (no setup, works for the committee).** Open
[index.html](index.html) in any modern browser. The pages are plain HTML/CSS, so they
also work when opened straight from the file system.

**Option 2 — local web server (recommended, keeps the URL bar tidy).**

```bash
cd prototype
python3 -m http.server 8000   # or: python -m http.server 8000
# open http://localhost:8000
```

No build step is required; plain HTML/CSS plus one small vanilla-JS file
([js/prototype.js](js/prototype.js)) — intentional at the sketch stage (technology
comparison, D4: the production frontend stack is decided later).

## Suggested walkthrough (≈3 minutes)

1. **Home** — read what the system does and what it will *not* do. Start the assessment.
2. **Assessment** — answer the 12 questions. Watch the progress indicator: it counts
   answered questions. The four *measurement* questions are optional — leave them empty
   to see how the form behaves with missing values. Try entering an impossible value
   (for example age `5`) to see the inline, field-linked error message and the error
   summary at the top of the form.
3. **Result** — the report shows your own answers in the "What you entered" table and a
   **fixed illustrative example** of the two risk estimates, the factor ranking, and the
   "Who can help you interpret this result" section. Note the disclaimer at the top and
   at the bottom of the screen.
4. **History** — example history with a trend chart and the change in percentage points.
5. **Log in** — guest mode versus an account.

Keyboard check (WCAG 2.1 AA): press <kbd>Tab</kbd> from the top of any page — the first
stop is a "Skip to main content" link, every control shows a visible focus outline, and
every form control can be reached and operated with the keyboard alone.

## Files

| Path | Purpose |
|---|---|
| [index.html](index.html) | Landing page |
| [assessment.html](assessment.html) | Questionnaire with progress and validation |
| [result.html](result.html) | Risk report (illustrative values) |
| [dashboard.html](dashboard.html) | History and trends |
| [login.html](login.html) | Guest / account entry (mock) |
| [css/styles.css](css/styles.css) | Shared styles and design tokens |
| [js/prototype.js](js/prototype.js) | Progress, validation and answer echo (progressive enhancement) |

## Accessibility notes

The mockups follow WCAG 2.1 AA: every form field has a `<label>`, the focus indicator is
visible, text contrast is ≥ 4.5:1, the risk levels are carried by a **text label + symbol**
and not by colour alone, and the pages use the `header` / `nav` / `main` / `footer`
landmarks. The measured contrast ratios are listed in
[docs/design/ux-prototype-notes.md](../docs/design/ux-prototype-notes.md).
