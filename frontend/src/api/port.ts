import type {
  AssessmentInput,
  AssessmentResult,
  AssessmentSummary,
  ModelInfo,
} from './types'

/**
 * The port the user interface talks to.
 *
 * Everything in the application uses this interface, never `fetch` directly, so
 * that the mock adapter (no backend available yet) and the HTTP client (the real
 * FastAPI backend, DIP-18) are interchangeable.
 */
export interface MedRiskApi {
  /**
   * `mock` — the in-browser adapter with illustrative example data.
   * `live` — the HTTP client against the MedRisk REST API.
   * The user interface shows a visible notice in `mock` mode so that example
   * data is never mistaken for a real model output.
   */
  readonly mode: 'mock' | 'live'

  /** Computes a new assessment (FR-01, FR-02). */
  createAssessment(input: AssessmentInput): Promise<AssessmentResult>

  /** All previous assessments, newest first (FR-06). */
  listAssessments(): Promise<AssessmentSummary[]>

  /** One assessment with its full result (FR-03, FR-04). */
  getAssessment(id: string): Promise<AssessmentResult>

  /** Deletes one assessment record (FR-06). */
  deleteAssessment(id: string): Promise<void>

  /** Deletes the account with all its records (NFR-04, right to erasure). */
  deleteAccount(): Promise<void>

  /** Metadata of the current model (FR-09). */
  getCurrentModel(): Promise<ModelInfo>
}
