/**
 * MedRisk API contract types (frontend side).
 *
 * ---------------------------------------------------------------------------
 * PROVENANCE AND STATUS — provisional
 * ---------------------------------------------------------------------------
 * These types were written for DIP-35 from the requirements specification
 * (`docs/requirements/requirements-specification.md`, FR-01 … FR-13), because the
 * OpenAPI 3 document of the backend (task DIP-18) is not committed to the
 * repository yet. They therefore describe the *expected* shape of the payload,
 * not a verified contract.
 *
 * TODO(DIP-35): replace the hand-written types below with the generated ones as
 * soon as the OpenAPI document is available:
 *
 *     cd frontend
 *     npm run api:types -- ../src/openapi.json -o src/api/schema.d.ts
 *
 * and adapt `src/api/client.ts` to the generated `paths` definitions. The
 * endpoint paths used here already follow the requirements specification
 * (FR-02, FR-06, FR-09): `POST /api/v1/assessments`,
 * `GET /api/v1/assessments`, `GET /api/v1/assessments/{id}`,
 * `DELETE /api/v1/assessments/{id}`, `GET /api/v1/models/current`.
 * ---------------------------------------------------------------------------
 */

/** Sex as recorded by the questionnaire (FR-01). */
export type Sex = 'female' | 'male';

/** Smoking status as recorded by the questionnaire (FR-01). */
export type SmokingStatus = 'no' | 'yes' | 'former';

/** A yes/no answer as recorded by the questionnaire (FR-01). */
export type YesNo = 'yes' | 'no';

/** The two risk targets estimated by the system (FR-02). */
export type RiskTarget = 'cvd' | 't2d';

/** Risk categories (FR-02). The order is the order of increasing risk. */
export type RiskCategory = 'low' | 'moderate' | 'high' | 'very_high';

/** Direction of a factor contribution (FR-04). */
export type FactorDirection = 'increases' | 'decreases';

/**
 * The questionnaire input (FR-01).
 *
 * Eight answers are mandatory, four are optional; the optional ones are the
 * laboratory and blood-pressure measurements that the participant may not know.
 */
export interface AssessmentInput {
  /** Age in years, 18 … 90. */
  age: number;
  sex: Sex;
  /** Height in centimetres, 120 … 230. */
  height_cm: number;
  /** Weight in kilograms, 30 … 250. */
  weight_kg: number;
  /** Systolic blood pressure in mmHg, 80 … 250. Optional. */
  systolic_bp?: number;
  /** Total cholesterol in mmol/L, 2 … 15. Optional. */
  total_cholesterol?: number;
  /** HDL cholesterol in mmol/L, 0.5 … 4. Optional. */
  hdl_cholesterol?: number;
  /** Fasting glucose in mmol/L, 2 … 30. Optional. */
  fasting_glucose?: number;
  smoking_status: SmokingStatus;
  /** At least 150 minutes of physical activity per week. */
  physical_activity_150min: YesNo;
  diagnosed_hypertension: YesNo;
  family_history: YesNo;
}

/** One risk estimate (FR-02, FR-03). */
export interface RiskEstimate {
  target: RiskTarget;
  /** Probability of the event within 10 years, 0 … 1. */
  probability: number;
  category: RiskCategory;
  /** Plain-language summary shown to the user (FR-03). */
  summary: string;
}

/** One explaining factor (FR-04). */
export interface FactorContribution {
  name: string;
  direction: FactorDirection;
  /** Relative magnitude, >= 0. The list is sorted by descending magnitude. */
  contribution: number;
}

/** The full result of one assessment (FR-02 … FR-04, FR-11). */
export interface AssessmentResult {
  id: string;
  /** ISO 8601 timestamp of the moment the assessment was computed. */
  created_at: string;
  /** Version of the model that produced the result (FR-11). */
  model_version: string;
  /** Both risks, cardiovascular disease and type 2 diabetes (FR-02). */
  risks: RiskEstimate[];
  /** At least five factors with direction and magnitude (FR-04). */
  factors: FactorContribution[];
  /** The "this is not a diagnosis" text (FR-03, NFR-06). */
  disclaimer: string;
  /** The values that were submitted, echoed back for the "what you entered" block. */
  input: AssessmentInput;
}

/** One row of the assessment history (FR-06). */
export interface AssessmentSummary {
  id: string;
  created_at: string;
  model_version: string;
  risks: Array<{
    target: RiskTarget;
    probability: number;
    category: RiskCategory;
  }>;
}

/** Metadata of the current model (FR-09). */
export interface ModelInfo {
  version: string;
  /** Date of the last training run, ISO 8601. */
  trained_at: string;
  /** Names of the public datasets the model was trained on. */
  datasets: string[];
  /** Headline evaluation metrics, for example `{ "cvd_auc": 0.78 }`. */
  metrics: Record<string, number>;
}
