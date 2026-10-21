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
