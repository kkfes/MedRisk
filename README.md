# MedRisk — Intelligent Disease Risk Assessment System

**Diploma project (team of 3), Educational program 6B06102 — Software Engineering**
Supervisor: **Aigerim Muratovna Bakiyeva**
Repository: [github.com/kkfes/MedRisk](https://github.com/kkfes/MedRisk) (public)

MedRisk is a decision-support web system that estimates a person's **cardiometabolic risk**
(cardiovascular disease and type 2 diabetes) from a short health questionnaire and standard
clinical indicators, using machine-learning models, and explains the result in plain language.
The system **does not diagnose** and is not a substitute for a doctor.

---

## Problem statement

Cardiovascular diseases and diabetes mellitus remain among the leading causes of mortality
worldwide (WHO, 2021–2024). A large share of cases are preventable when risk factors are
detected early, yet:

- validated clinical risk scores (Framingham, SCORE2, QRISK3) are fragmented, population-specific,
  and rarely available to the person themselves — only inside a clinic;
- popular "online health checkers" are usually opaque: they rarely disclose the model,
  are not validated, and give no explanation of *why* a risk is high;
- machine-learning models that could improve personalization are often deployed without
  calibration checks, baseline comparison, or explainability.

There is a need for a system that combines validated data pipelines, transparent ML models,
plain-language explanations and an accessible web interface.

## Target users

| User | Description |
|---|---|
| **Adults 30–70 (primary user)** | People who want to estimate their risk of heart disease / diabetes and understand which factors drive it. Non-technical, may have low health literacy. |
| **Primary-care professionals (secondary, planned)** | Use reports as an aid during a consultation. |
| **System administrator / researcher** | Manages models, users and evaluates model quality. |

## Expected outcomes

1. A reproducible data pipeline over public medical datasets (UCI Cleveland Heart Disease,
   Pima Indians Diabetes, Framingham/NHANES-derived data) with a documented data-quality report.
2. Predictive models for 10-year cardiovascular risk and type 2 diabetes risk that
   **beat or match clinical baselines** (logistic regression and a Framingham-style score)
   on a held-out test set (target: ROC-AUC ≥ 0.78, acceptable calibration, Brier score reported).
3. A REST API (FastAPI) with persisted assessment history.
4. A responsive web application for questionnaire input, risk report and factor explanations
   (SHAP-based + plain-language text).
5. This documentation set: proposal, literature review, system and technology comparisons,
   requirements, diagrams, verification plan.

## Team and responsibilities

| Member | Group | Role |
|---|---|---|
| Muslim Syzdykov | SE-2425 | Backend, API, architecture, ML integration (GitHub: [kkfes](https://github.com/kkfes)) |
| Zarina Kosaman | SE-2429 | Data analysis: datasets, cleaning, preprocessing, model evaluation |
| Sara Mukhammad | SE-2419 | UI/UX design, front-end, prototypes and user testing |
| Aigerim Bakiyeva | — | Scientific supervisor: reviews, methodology, control of milestones |

## Scope and current status

**In scope:** two risk targets (CVD, T2D), questionnaire-based input, ML models + baselines,
REST API, responsive web app, plain-language explanations, privacy by design, evaluation plan.

**Out of scope (v1):** EHR/HIS integration, mobile apps, real patient data collection,
clinical validation/trial, LLM chatbot (evaluated separately as an optional module),
regulatory certification (e.g. FDA/CE marking as a medical device).

**Status (24 October — pre-defense 0):** analysis, design and planning stage.
Proposal, reviews, comparisons, requirements, architecture diagrams, prototype mockups and
verification plan are complete. Runnable code is not expected at this stage.

> **Important:** everything in this repository at this stage is a **preliminary variant**.
> The UI in `prototype/` is an **early design sketch, not the final design**, and the
> backend architecture / technology choices described here are an **approximate variant**
> that may change during implementation. All such changes will be recorded as ADRs and
> committed like any other change (see [CONTRIBUTING.md](CONTRIBUTING.md)).

## Selected technologies

| Layer | Choice | Rationale (see [tech comparison](docs/comparisons/technology-comparison.md)) |
|---|---|---|
| ML / data | Python, pandas, scikit-learn, LightGBM, SHAP | Same language as backend, mature ecosystem |
| Backend | Python 3.11, FastAPI, Pydantic | Async, OpenAPI out of the box, shares code with the ML layer |
| Database | PostgreSQL 15 (SQLite for dev) | Relational integrity, JSONB for flexible payloads |
| Frontend | React + Vite + TypeScript | Component model, typed API client from OpenAPI |
| Deployment | Docker Compose | Reproducible single-host deployment |
| Tracking | YouTrack | Task tracking, required by the diploma process |

## Repository layout

```
.
├── README.md
├── CONTRIBUTING.md            # branching, PR and review rules
├── .env.example               # configuration template (the real .env is git-ignored)
├── docs/
│   ├── proposal/              # project proposal, problem statement, scope
│   ├── literature/            # critical literature review + source analysis table
│   ├── comparisons/           # existing systems & technology comparisons
│   ├── requirements/          # FR/NFR, priorities, acceptance criteria
│   ├── design/                # design system, UX notes (DIP-19)
│   ├── architecture/          # architecture description + diagrams (.mmd sources & SVG)
│   ├── verification/          # testing & evaluation plan, metrics, baselines
│   ├── management/            # roles, milestones, risks, YouTrack backlog
│   └── supervisor/            # supervisor feedback log
├── prototype/                 # static HTML/CSS mockups of key user scenarios
├── frontend/                  # React app (from M4) + design tokens & style guide (DIP-19)
├── src/                       # application code + requirements.txt (added from M1)
├── ml/                        # data pipeline & training code + requirements.txt (from M1)
├── tests/                     # automated tests (added from M1)
└── data/                      # dataset download scripts (raw data is not committed)
```

## Documentation index

| Document | Path |
|---|---|
| Project proposal & scope | [docs/proposal/project-proposal.md](docs/proposal/project-proposal.md) |
| Literature review | [docs/literature/literature-review.md](docs/literature/literature-review.md) |
| Existing system comparison | [docs/comparisons/existing-systems-comparison.md](docs/comparisons/existing-systems-comparison.md) |
| Technology comparison | [docs/comparisons/technology-comparison.md](docs/comparisons/technology-comparison.md) |
| Requirements specification | [docs/requirements/requirements-specification.md](docs/requirements/requirements-specification.md) |
| Design system & style guide | [docs/design/design-system.md](docs/design/design-system.md) · [frontend/styleguide/index.html](frontend/styleguide/index.html) |
| Architecture & diagrams | [docs/architecture/architecture-description.md](docs/architecture/architecture-description.md) |
| Verification & evaluation plan | [docs/verification/verification-and-evaluation-plan.md](docs/verification/verification-and-evaluation-plan.md) |
| Project management, risks | [docs/management/project-management.md](docs/management/project-management.md) |
| YouTrack task backlog | [docs/management/youtrack-backlog.md](docs/management/youtrack-backlog.md) |
| Supervisor feedback log | [docs/supervisor/feedback-log.md](docs/supervisor/feedback-log.md) |

## Prototype

Static HTML mockups of the key user scenarios (no build required). **These are sketches
for discussion, not the final design** — colors, layout and wording will be revised after
user feedback and the supervisor's review:

```bash
cd prototype
python3 -m http.server 8000
# open http://localhost:8000
```

Pages: [landing](prototype/index.html) → [risk questionnaire](prototype/assessment.html) →
[risk report](prototype/result.html) → [assessment history](prototype/dashboard.html).
The calculations in the mockup are illustrative only.

## Setup, run and test

Runnable application code is planned from milestone M1 (see
[project management](docs/management/project-management.md)). After M1 this section will
contain setup, run and test instructions. The current build/test commands will be:

```bash
cp .env.example .env          # fill in real values locally; never commit .env

# backend (planned)
cd src && pip install -r requirements.txt && uvicorn app.main:app --reload
pytest                        # unit + API tests

# frontend (planned)
cd frontend && npm install && npm run dev && npm run test
```

## Task tracking

- **YouTrack project:** [medrisk.youtrack.cloud/projects/DIP](https://medrisk.youtrack.cloud/projects/DIP) —
  all 46 tasks (DIP-1 … DIP-46) are imported and kept in sync by `scripts/youtrack_import.py`.
- Backlog source: [docs/management/youtrack-backlog.md](docs/management/youtrack-backlog.md)
  and `docs/management/youtrack-import.csv` (edit these, then re-run the script).
- Every meaningful work item is a YouTrack task; its ID goes into the branch name and
  commit/PR title (`DIP-23: add database schema`). See [CONTRIBUTING.md](CONTRIBUTING.md).

## Disclaimer

MedRisk is an educational research project. Its outputs are **risk estimates, not diagnoses**.
Do not use them for medical decision-making without consulting a licensed physician.
