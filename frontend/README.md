# MedRisk — web application (frontend)

React + TypeScript + Vite application of MedRisk. It is the working version of
the static prototype in `/prototype` (DIP-8) and uses the design system of
`/frontend/src/styles` (DIP-19).

| Task | What it adds |
|---|---|
| DIP-35 | The scaffold: build configuration, the typed API client, the mock adapter, the application shell with landmarks, navigation and the i18n table. |
| DIP-36 | The questionnaire: 12 questions, validation, progress and the error summary. |
| DIP-37 | The risk report: both risks, the categories, the factor list and the disclaimer. |
| DIP-38 | The history and the trend view. |

## Requirements

- Node.js ≥ 20.19 (tested with Node 24.12) and npm ≥ 10.

## Getting started

```bash
cd frontend
npm install
cp .env.example .env.local     # optional, the defaults are enough for a first start
npm run dev                    # http://localhost:5173
```

The application starts in **mock mode**: it shows clearly labelled illustrative
example data and does not need a backend. Mock mode is visible in the interface
(the notice under the header) so that example data can never be mistaken for a
real estimate.

To use the real backend (FastAPI, task DIP-18) set in `.env.local`:

```
VITE_API_MODE=live
VITE_API_BASE_URL=http://127.0.0.1:8000
```

In `live` mode the dev server forwards `/api` to `http://127.0.0.1:8000`.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Starts the development server. |
| `npm run build` | Type-checks the project (`tsc -b`) and builds the production bundle in `dist/`. |
| `npm run preview` | Serves the built bundle. |
| `npm run typecheck` | Type-check only. |
| `npm run lint` | ESLint (flat configuration, `eslint.config.js`). |
| `npm test` | Runs the test suite once (Vitest + Testing Library). |
| `npm run test:watch` | Runs the tests in watch mode. |
| `npm run api:types -- <openapi.json> -o src/api/schema.d.ts` | Generates the TypeScript types from the OpenAPI document, as soon as it is committed (DIP-18). |

## The questionnaire

The 12 questions of FR-01 are defined as data in `src/questionnaire/questions.ts`:
the label, the hint, the range, the step and whether the question is required.
The form (`src/pages/QuestionnairePage.tsx`) and the validation
(`src/questionnaire/validation.ts`) both read that list, so a question cannot
appear in the form without its rule.

| Group | Questions | Rule |
|---|---|---|
| Required (8) | age, sex, height, weight, smoking, physical activity, diagnosed hypertension, family history | a value is required |
| Optional (4) | systolic blood pressure, total cholesterol, HDL cholesterol, fasting glucose | may stay empty |

The ranges are the ones of the prototype (DIP-8): age 18–90 years, height
120–230 cm, weight 30–250 kg (step 0.5), systolic blood pressure 80–250 mmHg,
total cholesterol 2–15 mmol/L, HDL cholesterol 0.5–4 mmol/L, fasting glucose
2–30 mmol/L.

Behaviour of the form:

- every field has a real `<label>`; the error message is linked to the field
  with `aria-describedby`, and the field is marked with `aria-invalid`;
- the error summary at the top of the form lists every error and links to its
  field; after a failed submission the focus moves to the summary;
- the progress line counts the answered and the answered required questions;
- the answers are sent to the API adapter; the button is disabled while the
  request is running (`aria-busy` on the form).

## The risk report

`src/pages/ReportPage.tsx` shows the result of one assessment (FR-03, FR-04):

- the **disclaimer** of the API response at the top of the screen (mandatory on
  every result screen, NFR-06);
- the table **“What you entered”** — the answers of the questionnaire, with the
  same labels as the form; an optional measurement that was not answered is
  shown as “not answered”;
- **both risks** (cardiovascular disease and type 2 diabetes): the numeric value
  in percent, the category with its symbol **and** its text label, and the
  plain-language summary of the API;
- the **factor list**: every factor with its direction (a word and a symbol, never
  a colour alone) and its magnitude as a share of the largest contribution,
  sorted by the size of the contribution (FR-04);
- the blocks **“Who can help you interpret this result”** and
  **“What this tool cannot tell you”** — the tool names where to seek help and
  states that it does not diagnose and does not give treatment advice.

The formatting rules live in `src/risk/format.ts` (symbols, badge classes,
percentages, the sorting), the table of the answers in `src/risk/describeInput.ts`.

## The history and the trend

`src/pages/HistoryPage.tsx` shows the history of the account (FR-06, FR-07,
NFR-04):

- the **trend chart** (`src/components/TrendChart.tsx`) — one line per risk over
  the assessments, the oldest on the left. It is an inline SVG without a chart
  library; the two lines are distinguished by the line style (solid / dashed) and
  by the legend, not by the colour alone (WCAG 1.4.1). The chart carries a text
  summary in its accessible name, and the table below it contains the same
  values. With less than two assessments a hint is shown instead of the chart.
- the **table of all assessments** — the date, both risks with their number and
  their category, the version of the model that produced the record, a link to
  the report and the button to delete the record. The records are listed with
  the newest first, as the API returns them (FR-06).
- the **deletion of a single record** — the button first asks for a
  confirmation, and the focus moves to the confirming button. The record is
  deleted only after the confirmation.
- the **deletion of the account** — the same two-step confirmation, with the
  number of the records that will be deleted with it.

The preparation of the chart data (the points, the scale, the geometry and the
summary of the trend) is in `src/risk/trend.ts` as pure functions, so it can be
tested without a browser.

> The screen works against the API adapter. In mock mode it shows the records of
> the current session, because the registration and the login (FR-05) are not
> part of this task and the backend is not available yet.

## The API layer

```
src/api/types.ts     the contract types
src/api/port.ts      the interface MedRiskApi that the screens use
src/api/client.ts    HttpMedRiskApi — the REST client
src/api/mock.ts      MockMedRiskApi — illustrative example data, no backend
src/api/index.ts     createApi() — picks the adapter from VITE_API_MODE
```

The screens never call `fetch` themselves; they use `MedRiskApi` from
`useApi()`. That keeps the mock adapter and the real client interchangeable.

> **Provisional contract.** The OpenAPI document of the backend is not committed
> yet (task DIP-18). The types in `src/api/types.ts` were therefore written from
> the requirements specification (`docs/requirements/requirements-specification.md`,
> FR-01 … FR-13) and describe the *expected* payload, not a verified contract.
> As soon as the OpenAPI document is available, the types are regenerated with
> `npm run api:types` and the client is adapted to the generated definitions.

## Accessibility

The application follows WCAG 2.1 AA:

- every form field gets a real `<label>` (implemented in DIP-36);
- the focus ring is never removed (`:focus-visible` in `components.css`);
- no state is shown by colour alone — the risk levels carry a text label and a
  symbol;
- the skip link, the landmarks (`header`, `nav`, `main`, `footer`) and the
  `lang="en"` attribute are part of the shell;
- the text colours are the tokens of the design system, whose contrast ratios
  are measured in `docs/design/design-system.md` §2.

## Safety

MedRisk estimates a risk, it does not diagnose. Every result screen carries the
"this is not a diagnosis" disclaimer (FR-03, NFR-06), and the mock adapter
labels all of its values as illustrative examples.
