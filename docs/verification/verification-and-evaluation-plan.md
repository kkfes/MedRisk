# Verification and Evaluation Plan — MedRisk

**Official diploma topic:** Development of an intelligent system for assessing disease risk based on medical data analysis.  
**Version:** 1.1 proposed · **Stage:** pre-defense 0 · **Date:** 21 October 2026  
**Purpose:** specify the measurable evidence needed to evaluate the ML, software, usability and traceability objectives, without claiming results that have not been observed.

---

## 1. What is being verified

| Layer | Statement to be demonstrated |
|---|---|
| ML | On each documented **dataset-specific target**, compare candidate classifiers with valid statistical baselines; assess discrimination, calibration, stability, subgroup uncertainty and outcome compatibility. A ten-year clinical prediction requires a distinct longitudinal evaluation gate. |
| Software | The system implements all **Must** requirements of the [requirements specification](../requirements/requirements-specification.md) and meets its NFRs. |
| UX | Non-technical users can complete the assessment and understand the report and limitations. |
| Process | Work is traceable (Git + YouTrack) and experiments are reproducible (seeded training, pinned data and code). |

## 2. Datasets, splits and conditions

| Item | Condition |
|---|---|
| Initial data | **Exploratory classification**: UCI Cleveland Heart Disease (n≈303; binary outcome derived from recorded disease presence `num=0` vs `num=1..4`) and Pima Indians Diabetes (n≈768; interpret the diabetes label according to the exact downloaded dataset documentation). Dataset versions and actual valid N must be checked in DIP-12/13. |
| Clinical ten-year CVD claim | Requires a longitudinal cohort with incident CVD outcome, a ten-year prediction horizon (including appropriate handling of censoring), an aligned time origin, eligible features and an appropriate target population. **Cleveland's disease-presence label does not satisfy this criterion.** The current FR-02 wording remains a cross-document decision pending supervisor review. |
| Feature compatibility | Create a per-dataset feature inventory with units and missingness. For each candidate or published score check whether required questionnaire fields are actually available at prediction time. Do not fabricate missing predictors. |
| Split | Initial benchmark: stratified 70/30 train/test, seed `42`; save split indices and event counts. Five-fold stratified CV on **training data only** for model/hyperparameter/threshold selection. Use group- or time-aware strategies instead if repeat patients or a longitudinal cohort requires them. |
| Preprocessing | Fit imputation, indicators, scaling, encoding, feature selection, resampling and probability calibration within training folds only; never fit these to held-out test data. Compare complete-case and imputation variants as secondary analyses where feasible. |
| Missing values | Describe source-specific missingness; distinguish unknown questionnaire answers from implausible recorded values. Do not silently treat impossible measurement codes as valid observations. |
| Environment | Record dataset URL/version/hash, selection/exclusion rules, observed sample sizes, class prevalence, saved split, Python/packages, git revision, hardware, seed and exact executed commands. |

### 2.1 Target/horizon compatibility gate (requires supervisor decision)

For each outcome, prepare a dataset contract: prediction target, label meaning, disease status versus *incident* event, observation period, study population, predictors, intended users and limits. Do not describe a Cleveland disease-presence probability as **validated ten-year cardiovascular risk**. A published Framingham score will only be evaluated against a clinically compatible ten-year CVD endpoint, with the necessary recorded inputs. If no compatible cohort is available, mark this comparator **BLOCKED**, document the impact on FR-02 and request a team/supervisor decision. This plan alone does not change approved scope or other team members' documents.

### 2.2 Evaluation safeguards and uncertainty

- Freeze test indices before experiments. Use the held-out test data for the final evaluation, not for feature engineering or threshold tuning.
- Preselect the classifier operating threshold using training/CV performance and a justified use-case trade-off.
- Calculate 95% CIs for ROC-AUC and, where feasible, Brier and sensitivity/specificity (e.g. 1,000 stratified bootstrap repetitions with seed 42; report valid draws and CIs). Bootstrap reflects sample uncertainty on this dataset, **not transportability** to Kazakhstan.
- Report calibration plot, calibration slope/intercept where estimable, subgroup N and class counts; treat tiny or single-class subgroups as *not estimable*.
- Do not adjust the fixed test split or acceptance thresholds in response to disappointing results.

## 3. Model metrics and acceptance thresholds

These are **research targets** rather than clinical validation. Some are already stated in the team documents; other acceptance rules are **proposals to confirm before evaluating held-out results**.

| Metric | CVD target | T2D target | Acceptance rule / decision |
|---|---|---|---|
| ROC-AUC (held-out test) | Required, dataset-specific label | Required, dataset-specific label | **Existing MedRisk target:** ≥ 0.78 for each eligible task; record N and positive/negative counts |
| ROC-AUC 95% CI | Bootstrap or justified DeLong | Same | **Existing target:** lower CI bound > 0.70; interpret cautiously for small samples |
| Versus logistic-regression baseline | Paired ΔAUC + CI | Paired ΔAUC + CI | Candidate model ≥ baseline, **or document failure** rather than claiming success |
| Versus clinical Framingham score | Only when endpoint, ten-year horizon and required predictors are compatible | Not applicable | **Conditional comparison**; otherwise `BLOCKED — incompatible data`, not a fabricated head-to-head score |
| Brier score | Report actual value + prevalence-only and logistic baselines | Same | **Proposal:** no worse than matched logistic baseline and better than constant-prevalence reference; no universal published cutoff assumed |
| Calibration | Plot + slope + intercept (CIs if feasible) | Same | **Existing provisional slope range:** 0.8–1.2; report intercept (ideal 0) and uncertainty; slope alone is insufficient |
| Sensitivity / specificity | At threshold chosen in training CV | Same | Report both values with 95% CI and confusion matrix; numerical pass/fail cutoffs require supervisor approval for the specific intended use |
| Subgroups (NFR-09) | Age/sex metrics if defined | Age/sex metrics if defined | Existing rule: document any AUC gap > 0.05 from overall and all insufficient/absent subgroups; do not claim fairness from non-significance |
| Explainability (RQ2, FR-04) | SHAP top factors with direction and magnitude | Same | Verify shape/ranking/sign; explanations reflect fitted model, **not causation**; face-validity and user-understanding checks reported |

## 4. Baselines (why comparison is meaningful)

1. **Prevalence-only reference:** `DummyClassifier(strategy="prior")` fitted to the training data. Expected discrimination is approximately AUC 0.5 when the test set has both classes; probabilities provide a simple Brier reference.
2. **Logistic regression:** train with the same eligible features, split and leakage-safe preprocessing as the candidate LightGBM model (DIP-15). This is the primary matched classification baseline for both initial datasets.
3. **Framingham-style clinical score:** only on a cohort with the required recorded score predictors, compatible CVD endpoint and ten-year horizon (DIP-16). The published formula cannot validly be evaluated as a *ten-year* comparator by relabeling the Cleveland or Pima classification output. Record missing inputs/endpoint mismatches as a blocker and seek supervisor agreement on any alternative.

### 4.1 Baseline and evaluation results register

| Experiment / measured item | Baseline result | Candidate result | Evidence | Status at M0 |
|---|---|---|---|---|
| Cleveland recorded heart disease — AUC/Brier | `TBD — DIP-15` | `TBD — DIP-21` | Dataset hashes, frozen split and report | **NOT RUN** |
| Pima diabetes label — AUC/Brier | `TBD — DIP-15` | `TBD — DIP-22` | Dataset hashes, frozen split and report | **NOT RUN** |
| Framingham ten-year incident CVD comparison | `TBD — DIP-16` | `TBD — compatible data` | Longitudinal cohort and outcome contract needed | **BLOCKED: dataset/outcome** |
| Calibration, 95% CIs, subgroup results | `TBD` | `TBD` | Later evaluation report, DIP-24/27 | **NOT RUN** |

`TBD` and `NOT RUN` are not evaluation results. Replace them only after recording actual executable commands, outputs, data version and code revision. No training or medical model testing is claimed at this pre-defense stage.

## 5. Software verification activities

| Activity | Scope | Tool | When |
|---|---|---|---|
| Unit tests | preprocessing, scoring, categorization, SHAP wrapper, auth utils | pytest | continuous (CI), once code is available |
| API contract tests | each endpoint: valid, boundary, invalid, auth/negative; check risk labels/horizon metadata and disclaimers match evaluated outcomes | pytest + httpx, schemathesis vs OpenAPI | continuous, once endpoints exist |
| Integration tests | DB round-trips, history, deletion (NFR-04), model-version audit (NFR-08) | pytest + testcontainers/SQLite | continuous |
| E2E tests | guest questionnaire → report → disclaimer; authenticated history → delete | Playwright | weekly after UI integration |
| Performance test | 50 VU × 5 min, p95 ≤ 500 ms, error rate < 0.1 % (NFR-01); record deployment hardware/model version | k6 or locust | after a runnable build, before relevant pre-defense |
| Security checks | gitleaks scan, no plaintext passwords, JWT expiry, input validation | gitleaks + checklist | before each pre-defense after implementation |
| Reproducibility run | retrain twice, ΔAUC ≤ 0.01 (FR-10, NFR-12) | `make train` | milestone M4, after training pipeline is available |
| Clean-machine deployment | Docker Compose from README ≤ 15 min (NFR-10) | recorded manual rehearsal | milestone M4 |

Assess each outcome as `PASS`, `FAIL`, `NOT RUN` or `BLOCKED`; absence of tests during M0 is not a pass.

## 6. Requirements → verification traceability (Must requirements)

| Req | Verification method | Evidence artifact |
|---|---|---|
| FR-01 | API contract tests (≥15 valid/invalid/boundary cases) | test report |
| FR-02 | API integration tests for both scores **and** separate review of endpoint definition, predictors, intended population and prediction horizon | test report + approved outcome/dataset decision; ten-year claim blocked pending compatible data |
| FR-03 | E2E DOM assertions on numeric label, category, summary and diagnostic disclaimer | Playwright report |
| FR-04 | Explanation unit tests and E2E: factors array shape, ordering and consistency with output; user comprehension check | test report + explanation limitations |
| FR-05 | Authentication integration + negative tests (401 errors) | test report |
| FR-06 | Integration tests for list, ordering and deletion | test report |
| FR-09 | Endpoint `models/current` vs versioned model card: model version, target and measured metrics match | report + model-card version |
| FR-10 | Pin dataset, train with documented seed and compare repeated metrics | run logs, data hashes and `ml/reports/` |
| FR-13 | Validate generated OpenAPI against committed spec | CI log |
| NFR-01 | Recorded load test on specified hardware | k6/locust report |
| NFR-03 | Scan source/config for secrets; password hash checks | CI + test DB inspection |
| NFR-04 | Account deletion and guest privacy integration tests | test report |
| NFR-05 | Usability study: task completion and SUS | protocol + questionnaire/report |
| NFR-06 | Visible non-diagnostic disclaimer and outcome-consistent wording in API and UI | Playwright + API report |
| NFR-07 | Model card completeness and actual metrics/dataset metadata agreement | `docs/ml/model-card.md` |
| NFR-08 | Stored risk-result model-version FK/schema + integration tests | schema and integration report |
| NFR-09 | Sex/age subgroups with n, events, available AUC/CI and documented gaps/undefined estimates | evaluation report + model card |
| NFR-12 | Two reproducibility runs with pinned source hashes/seed | `ml/reports/` + CI logs |

## 7. Usability evaluation (NFR-05)

- **Method:** think-aloud task test, n ≥ 5 (mixed: students + non-technical adults).
- **Tasks:** (1) complete questionnaire as guest; (2) find the two risk numbers; (3) identify the leading model factor; (4) save the assessment with an account; (5) explain why the score is *not* a medical diagnosis.
- **Metrics:** task success rate target ≥ 90%, time on task, SUS target ≥ 70, comprehension target ≥ 80% correct.
- **Conditions:** same prototype version for all participants; consent and anonymized results recorded in `docs/verification/usability-report.md`; no invented responses or personal medical records committed.

## 8. Limitations acknowledged in advance

- Public datasets are small and population-specific (Cleveland: US, historic clinical cohort; Pima: restricted female population). This is *proof of engineering method* and exploratory classification, not verified risk performance for Kazakhstan's general adult population.
- Questionnaire self-report differs from actual clinical measurements and may not supply all necessary published-score predictors.
- **Outcome and time horizon** remain major scientific limitations: Cleveland disease-presence classification is not a ten-year incident CVD forecast, and the Pima benchmark label must not be assigned an unsupported horizon.
- A published Framingham equation is a conditional comparator, not a substitute for longitudinal data; if compatible validation material is unavailable, document the blocker and request a revision/approval rather than asserting success.
- Assessment is retrospective; a prospective clinical trial and deployment-level validation remain out of scope for v1. Model attributions cannot establish causes or prescribe treatment.
- Metric targets need actual testing and appropriate statistical precision; a high ROC-AUC alone does not establish safety or clinical usefulness.

## 9. Reporting

Once implementation begins, store data/method manifests, commands, machine-readable metrics, confidence intervals, calibration plots and subgroup results as documented artifacts under `ml/reports/`, summarized in `docs/evaluation/evaluation-report.md`. Ensure evaluation outputs do not expose personal medical data, passwords, tokens or training records prohibited by repository policy.

At M0 the deliverable is this **plan**; no accuracy, calibration, fairness or clinical effectiveness results have been observed. Supervisor approval is still required on prediction horizon and any new metric acceptance thresholds.

## 10. Methodological references (for the planned evaluation)

- Collins GS et al. (2024). TRIPOD+AI. *BMJ* 385:e078378. https://doi.org/10.1136/bmj-2023-078378
- Moons KGM et al. (2025). PROBAST+AI. *BMJ* 388:e082505. https://doi.org/10.1136/bmj-2024-082505
- Collins GS et al. (2024). Evaluation of clinical prediction models (part 1). *BMJ* 384:e074819. https://doi.org/10.1136/bmj-2023-074819
- Riley RD et al. (2024). Evaluation of clinical prediction models (part 2). *BMJ* 384:e074820. https://doi.org/10.1136/bmj-2023-074820
- UCI Machine Learning Repository. Heart Disease. https://archive.ics.uci.edu/dataset/45/heart+disease
