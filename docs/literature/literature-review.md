# Literature Review — Intelligent Disease Risk Assessment

**Project:** MedRisk  
**Official diploma topic:** Development of an intelligent system for assessing disease risk based on medical data analysis.  
**Stage:** Pre-defense 0; document update proposed for 24 October 2026  
**Sources used:** **27 structured entries:** 23 scholarly journal/conference publications (including a scholarly perspective) and 4 institutional, regulatory or dataset sources.  
**Source selection:** A focused set of six publications from 2024–2025 complements foundational papers on clinical scores, dataset provenance, machine learning and explainability. This is a *critical narrative review*, not a systematic review.

---

## 1. Scope of the review

The review addresses three questions directly shaping the diploma project:
(1) which approaches exist for estimating cardiovascular and type 2 diabetes risk;
(2) what is known about ML-based disease prediction and its limitations;
(3) which limitations and validation obligations MedRisk must explicitly take into account.

The *approved diploma topic* concerns disease risk assessment broadly. The initial MedRisk prototype deliberately focuses on cardiovascular disease (CVD) and type 2 diabetes (T2D). These are engineering/research use cases rather than claims of clinical approval.

## 2. Clinical risk scores — the classical baseline

**Framingham Risk Score.** D'Agostino et al. (2008) derived a general cardiovascular profile for the Framingham Heart Study cohort using age, sex, cholesterol, blood pressure, treatment, smoking and diabetes to estimate ten-year CVD risk. Its original coefficients and outcome definition are tied to the development cohort. Evaluation in a different population calls for careful assessment of transportability and calibration, not automatic reuse.

**SCORE / SCORE2.** Conroy et al. (2003) developed SCORE for ten-year *fatal* cardiovascular disease risk from European cohorts. SCORE2 (2021) addresses fatal and non-fatal CVD events using region-adapted models. These scores do not all predict the same endpoint. Different target definitions and population risks must be considered before comparing outputs or discrimination estimates.

**QRISK / QRISK3.** Hippisley-Cox and colleagues (2007; 2017) developed UK risk models with expanded features, including medicines and comorbidities. They illustrate the trade-off between comprehensive clinical information and a simplified, public-facing questionnaire. Clinical scores can be transparent but are not necessarily calibrated for Kazakhstan or compatible with the exact variables in MedRisk's public datasets.

**Limitations important for MedRisk:** population-specific coefficients, different clinical endpoints and prediction horizons, required laboratory inputs, incomplete feature compatibility and limited ability to provide a plain-language explanation to non-specialist users. The score is therefore a *conditional comparator*, not an automatically valid ground truth.

## 3. Machine learning for disease risk prediction

**Foundational datasets.** MedRisk initially plans to examine UCI Cleveland Heart Disease (Detrano et al., 1989) and the Pima Indians Diabetes benchmark (Smith et al., 1988). The Cleveland `num` target is recorded heart-disease presence/angiographic status, **not observed first CVD events over the next ten years**; a classifier trained on that target cannot by itself be presented as a validated ten-year clinical prognosis. The Pima benchmark is drawn from a restricted female population and its released outcome definition and timing must be documented before any risk-horizon claim. The historic data are useful for reproducible exploratory ML comparisons but have limited external validity.

**Deep learning on EHR.** Rajkomar et al. (2018) studied ML on large-scale electronic health records for several hospital outcomes. It provides an example of scalable data processing and repeatable modelling, but its results do not demonstrate how a model trained on a few hundred Cleveland or Pima observations would perform in another setting. MedRisk therefore uses a simpler tabular baseline before adding LightGBM.

**Reviews of the field.** Miotto et al. (2018) and Litjens et al. (2017) discuss the opportunities and data/validation limitations of deep learning in healthcare. Esteva et al. (2017) and Gulshan et al. (2016) are influential examples of carefully scoped image-classification systems, but neither validates cardiometabolic risk estimates from questionnaires. Such studies offer engineering lessons, not direct performance evidence for MedRisk's target outcomes.

**Recent CVD-focused evidence.** Liu et al. (2025 journal issue; first online in 2024) review ML prediction using electronic health records and highlight methodological heterogeneity between studies. This supports a dataset-specific evaluation and fair comparison with traditional statistical baselines rather than an assumption that boosting always wins.

## 4. Bias, explainability and clinical safety

**Fairness and outcome choice.** Obermeyer et al. (2019) showed how a healthcare-cost proxy can distort allocation relative to actual care needs. A model's selected target must represent what the product claims to estimate. MedRisk should inspect label definitions and report group-wise results, limitations and the sizes of evaluated subgroups (NFR-09).

**Explanations.** Lundberg and Lee (2017) introduced SHAP for attributing a fitted model's prediction to input features. SHAP indicates the contribution of features *within a model*; it does not prove causation or provide a treatment recommendation. MedRisk plans model-attribution displays plus plain-language explanations (FR-04), tested for user comprehension.

**Responsible clinical use.** Topol (2019), Kelly et al. (2019) and Char et al. (2018) address the need for responsible oversight, ethical review, validation, integration and appropriate deployment boundaries. WHO guidance (2021) emphasizes autonomy, well-being, transparency, accountability and fairness. MedRisk remains an educational decision-support prototype and does not provide a diagnosis (FR-03, NFR-06).

**Updated methodological guidance.** TRIPOD+AI (Collins et al., 2024) sets expectations for transparent reports of regression and ML prediction-model studies. PROBAST+AI (Moons et al., 2025) helps assess development quality, bias and applicability. Collins et al. (2024) distinguish internal, internal-external and external evaluation; Riley et al. (2024) explain how an independent validation cohort should be assessed. FUTURE-AI (Lekadir et al., 2025) addresses fairness, universality, traceability, usability, robustness and explainability. Together, these publications justify MedRisk's evaluation documentation and requirement mapping; none is a clinical validation of the MedRisk software.

## 5. Synthesis — what already exists and what is missing

| # | Established knowledge / evidence gap | Consequence for MedRisk |
|---|---|---|
| 1 | Clinical CVD scores exist but differ in outcome, horizon, required inputs and population | Use a published clinical score **only** if its input and outcome definitions can be matched; otherwise mark comparison blocked |
| 2 | ML may improve some predictions; model comparisons can be confounded by data and endpoints | Compare logistic regression and LightGBM using the same eligible examples/features and report uncertainty |
| 3 | Discrimination is not equivalent to calibrated risk probabilities | Report ROC-AUC, Brier score, calibration plot, calibration slope and intercept |
| 4 | SHAP offers model attributions, not evidence of individual causal factors | Explain feature contributions in non-causal, plain language and test understanding |
| 5 | Dataset shift, bias and opaque workflows jeopardize clinical applicability | Document population/label limitations, reproducibility, subgroup estimates and intended use |
| 6 | Small, historical Cleveland/Pima datasets do not contain the evidence for a general 10-year prognosis | Treat early work as dataset-label classification; require longitudinal data for a validated ten-year claim |

**Research/practice gap pursued by the project.** MedRisk aims to integrate an accessible questionnaire, reproducible disease-label modelling, model transparency, explanatory reports and explicit methodological limitations. This is a *proposed combination* that the project will test, not evidence that no existing product offers similar functions or that MedRisk has already been clinically validated.

### 5.1 How the reviewed evidence shaped our requirements

| Evidence / limitation | Requirements | Project response |
|---|---|---|
| Cleveland records heart-disease presence rather than ten-year incidence (Detrano; UCI); published scores differ in endpoint (D'Agostino; SCORE2) | FR-02, FR-09, NFR-06, NFR-07 | Record the exact prediction target and horizon; only claim ten-year risk after the compatible longitudinal data and intended use have been approved |
| Data-specific models can overfit or compare unfairly (Liu; Collins; Riley) | FR-10, NFR-12 | Fixed evaluation data, train-only preprocessing and tuning, equal test cases for candidates and baseline, uncertainty estimates |
| Reliable prediction needs calibration and transparent reporting (TRIPOD+AI; PROBAST+AI) | FR-09, NFR-07, NFR-09 | Publish discrimination, Brier score, calibration results, cohort description, subgroup information and limitations |
| SHAP attribution is a model explanation, not a causal effect (Lundberg & Lee; FUTURE-AI) | FR-04, NFR-05, NFR-06 | Non-causal wording of feature impacts and usability checks |
| Historical datasets may be non-representative of the target audience (Detrano; Smith; PROBAST+AI) | NFR-07, NFR-09 | Document missingness, sample composition, unavailable groups and external-validation needs |
| Health information should be safe and understandable (WHO; Topol; FUTURE-AI) | FR-03, NFR-05, NFR-06 | Disclaimers, understandable summaries, user research and human oversight |

### 5.2 Explicit limitations of the reviewed evidence

- The original Framingham-type scores estimate future incidents over a defined horizon; Cleveland's disease-presence label is not an equivalent target. This issue must be resolved jointly with the team lead and supervisor because FR-02 in the existing requirements still promises a ten-year CVD probability.
- The original Pima research and the commonly distributed benchmark require an explicit provenance and label-definition check before interpreting probabilities as a prognosis for the intended adult population.
- Dermatology and ophthalmology AI papers illustrate ML study design, but are not cardiometabolic risk validation.
- The SHAP layer explains the statistical model, not underlying clinical causality.
- A held-out split from one dataset is internal evaluation, not independent external validation.
- Research from other regions does not establish validity for adults in Kazakhstan without corresponding evaluation.

## 6. Structured analysis table of publications

The table distinguishes empirical or methodological literature from institutional guidance and data-source descriptions. Works from 2024–2025 are discussed above and are not included merely to meet a numerical quota.

| # | Full publication / source and verifiable link | Type | Year | Used for (project aspect) | Critical finding or limitation considered |
|---|---|---|---|---|---|
| 1 | D'Agostino et al., *Circulation* 117(6):743–753, [DOI](https://doi.org/10.1161/CIRCULATIONAHA.107.699579) | Scientific — cohort model | 2008 | Clinical comparator; FR-02, DIP-16 | Ten-year CVD score; endpoint, horizon and predictor compatibility required before comparison |
| 2 | Conroy et al., *European Heart Journal* 24(11):987–1003, [DOI](https://doi.org/10.1016/S0195-668X(03)00114-3) | Scientific — cohort model | 2003 | Existing-system comparison; CVD endpoint | SCORE predicts **fatal** CVD events; not interchangeable with all CVD outcomes |
| 3 | SCORE2 Working Group, *European Heart Journal* 42(25):2439–2454, [DOI](https://doi.org/10.1093/eurheartj/ehab309) | Scientific — cohort model | 2021 | Population calibration; NFR-07 | Region-specific recalibration; intended population must be specified |
| 4 | Hippisley-Cox et al., *BMJ* 335:136, [DOI](https://doi.org/10.1136/bmj.39261.471806.55) | Scientific — cohort model | 2007 | Existing-system comparison | QRISK uses a population-specific model; external transportability is not automatic |
| 5 | Hippisley-Cox, Coupland & Brindle, *BMJ* 357:j2099, [DOI](https://doi.org/10.1136/bmj.j2099) | Scientific — cohort model | 2017 | Existing-system comparison; questionnaire design | QRISK3 needs broader predictors than a small simplified questionnaire |
| 6 | Detrano et al., *American Journal of Cardiology* **64(5):304–310**, [DOI](https://doi.org/10.1016/0002-9149(89)90524-9) | Scientific — clinical study | 1989 | Cleveland provenance; DIP-13, FR-02 | Cleveland's disease-presence/angiographic classification is not a ten-year incident event |
| 7 | Smith et al., *Proceedings of the Annual Symposium on Computer Applications in Medical Care*, pp. 261–265, [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC2245318/) | Scientific — conference paper | 1988 | Pima provenance; DIP-13 | Original ADAP study examined diabetes onset in a specific high-risk population; exact released benchmark label/horizon must be documented separately |
| 8 | Rajkomar et al., *npj Digital Medicine* 1:18, [DOI](https://doi.org/10.1038/s41746-018-0029-1) | Scientific — ML study | 2018 | ML feasibility; FR-10 | EHR-scale modelling suggests potential; not evidence that small tabular MedRisk datasets generalize |
| 9 | Miotto et al., *Briefings in Bioinformatics* 19(6):1236–1246, [DOI](https://doi.org/10.1093/bib/bbx044) | Scientific — review | 2018 | Data-quality and interpretation design | Missing data and interpretability limitations remain important |
| 10 | Litjens et al., *Medical Image Analysis* 42:60–88, [DOI](https://doi.org/10.1016/j.media.2017.07.005) | Scientific — imaging review | 2017 | General AI evaluation caution | Imaging evidence is context, **not direct evidence** for tabular risk prediction |
| 11 | Esteva et al., *Nature* 542:115–118, [DOI](https://doi.org/10.1038/nature21056) | Scientific — image classification | 2017 | Scope/narrow-task precedent | Skin lesion classification results do not establish accuracy for CVD/T2D risk |
| 12 | Gulshan et al., *JAMA* 316(22):2402–2410, [DOI](https://doi.org/10.1001/jama.2016.17216) | Scientific — image classification | 2016 | Validation methodology precedent | Diabetic retinopathy image detection is different from diabetes incidence prediction |
| 13 | Obermeyer et al., *Science* 366(6464):447–453, [DOI](https://doi.org/10.1126/science.aax2342) | Scientific — algorithmic bias | 2019 | Proxy outcomes; NFR-09 | Target/proxy selection can cause inequity; record subgroup limitations |
| 14 | Lundberg & Lee, *Advances in Neural Information Processing Systems* 30, [proceedings](https://proceedings.neurips.cc/paper_files/paper/2017/hash/8a20a8621978632d76c43dfd28b67767-Abstract.html) | Scientific — conference paper | 2017 | SHAP; FR-04 | Feature contributions describe model behaviour; not clinical causation |
| 15 | Topol, *Nature Medicine* 25:44–56, [DOI](https://doi.org/10.1038/s41591-018-0300-7) | Scientific — review | 2019 | Intended use; NFR-06 | Human oversight and explicit limits of use matter |
| 16 | Kelly et al., *BMC Medicine* 17:195, [DOI](https://doi.org/10.1186/s12916-019-1426-2) | Scientific — review/commentary | 2019 | Data shift and deployment risks | Clinical benefit requires validation and integration beyond a high AUC |
| 17 | Char, Shah & Magnus, *New England Journal of Medicine* 378(11):981–983, [DOI](https://doi.org/10.1056/NEJMp1714229) | Scholarly — perspective | 2018 | Ethical risks; NFR-03, NFR-06 | Addresses ethical challenges; **not** an experimental demonstration of model ageing |
| 18 | Collins et al., *BMJ* 385:e078378, **TRIPOD+AI**, [DOI](https://doi.org/10.1136/bmj-2023-078378) | Scientific — reporting guidance | 2024 | Evaluation-report completeness; FR-09, NFR-07 | Report population, target, missing-data handling, calibration and limitations transparently |
| 19 | Moons et al., *BMJ* 388:e082505, **PROBAST+AI**, [DOI](https://doi.org/10.1136/bmj-2024-082505) | Scientific — quality/risk-of-bias guidance | 2025 | DIP-13/27; NFR-09 | Study risk of bias and applicability; avoid unsupported claims from small or shifted datasets |
| 20 | Collins et al., *BMJ* 384:e074819, “Evaluation of clinical prediction models (part 1),” [DOI](https://doi.org/10.1136/bmj-2023-074819) | Scientific — methods | 2024 | Validation strategy; DIP-9 | Cross-validation is internal validation; an unrelated data split is **not** external validation |
| 21 | Riley et al., *BMJ* 384:e074820, “Evaluation of clinical prediction models (part 2),” [DOI](https://doi.org/10.1136/bmj-2023-074820) | Scientific — methods | 2024 | ROC-AUC, Brier, calibration, confidence intervals; DIP-9 | Evaluate in the intended target population with matching endpoint and horizon |
| 22 | Lekadir et al., *BMJ* 388:e081554, **FUTURE-AI**, [DOI](https://doi.org/10.1136/bmj-2024-081554) | Scientific — consensus guidance | 2025 | Explainability, robustness, usability; FR-04, NFR-05/06 | Explanation design needs input from users/experts and usability verification |
| 23 | Liu et al., *European Heart Journal – Digital Health* 6(1):7–22, [DOI](https://doi.org/10.1093/ehjdh/ztae080) | Scientific — systematic review/meta-analysis | 2025 issue (online 2024) | Clinical-vs-ML CVD evidence; RQ1 | Reported gains vary greatly across studies; heterogeneous tasks and limited validation prevent assuming superiority for MedRisk |
| G1 | WHO, *Ethics and governance of artificial intelligence for health*, [WHO page](https://www.who.int/publications/i/item/9789240029200) | Grey — international guidance | 2021 | Ethical scope; NFR-03/04/06/09 | Human autonomy, privacy, fairness and transparency |
| G2 | FDA, *Clinical Decision Support Software* guidance, [FDA topic page](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/clinical-decision-support-software) | Grey — regulatory guidance | 2022 edition; check for updates | Non-diagnostic intended-use boundary | Educational disclaimer alone does not establish a legal regulatory exemption |
| G3 | UCI ML Repository, *Heart Disease*, [dataset description](https://archive.ics.uci.edu/dataset/45/heart+disease) | Grey — primary dataset documentation | 1988; UCI entry maintained | Cleveland data definition; DIP-12/13 | Target is disease presence, not 10-year event; Pima provenance comes from Smith et al. |
| G4 | WHO cardiovascular diseases / diabetes fact sheets, [CVD](https://www.who.int/news-room/fact-sheets/detail/cardiovascular-diseases-(cvds)) and [diabetes](https://www.who.int/news-room/fact-sheets/detail/diabetes) | Grey — epidemiology | Living webpages; verify date of version cited | Proposal context | Epidemiological rationale, not model validation evidence |

## 7. Conclusion

The literature supports the feasibility of a careful, reproducible research prototype, but it does not establish clinical readiness or general-population ten-year CVD forecasting from the proposed Cleveland and Pima benchmarks. MedRisk therefore plans transparent baseline comparisons, uncertainty and calibration reporting, subgroup evaluation, reproducible data processing and explanations constrained to model attribution. The exact target definition, prediction horizon and clinical comparator remain decisions requiring agreement with the project lead and supervisor; they must be made consistently across the project proposal, FR-02, dataset contract and verification plan before any clinical risk claim.

**Related documents:** [requirements](../requirements/requirements-specification.md), [architecture](../architecture/architecture-description.md), [verification and evaluation plan](../verification/verification-and-evaluation-plan.md).
