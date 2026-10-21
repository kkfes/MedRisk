import type { MedRiskApi } from './port'
import type {
  AssessmentInput,
  AssessmentResult,
  AssessmentSummary,
  FactorContribution,
  ModelInfo,
  RiskCategory,
  RiskEstimate,
  RiskTarget,
} from './types'

/**
 * The mock adapter.
 *
 * ---------------------------------------------------------------------------
 * IMPORTANT — this adapter produces ILLUSTRATIVE EXAMPLE DATA, not medical
 * output. It is used while the FastAPI backend (DIP-18) is not deployed and
 * while the model (DIP-22 … DIP-30) is not trained. The values are fixed
 * constants: the mock never computes a risk from the answers, so nothing it
 * returns can be mistaken for a real estimate. The user interface shows a
 * visible notice in mock mode (see `src/App.tsx`).
 * ---------------------------------------------------------------------------
 */

/** The text shown on every result produced by the mock adapter. */
export const MOCK_DISCLAIMER =
  'Illustrative example produced by the mock adapter. These values are fixed examples ' +
  'and are not calculated from your answers. This is not a diagnosis and not medical advice.'

const EXAMPLE_RISKS: RiskEstimate[] = [
  {
    target: 'cvd',
    probability: 0.12,
    category: 'moderate',
    summary:
      'Example summary: the cardiovascular risk is shown at 12 % over the next 10 years. ' +
      'In the real service this sentence is generated from the model output.',
  },
  {
    target: 't2d',
    probability: 0.08,
    category: 'low',
    summary:
      'Example summary: the type 2 diabetes risk is shown at 8 % over the next 10 years. ' +
      'In the real service this sentence is generated from the model output.',
  },
]

const EXAMPLE_FACTORS: FactorContribution[] = [
  { name: 'Example factor: age', direction: 'increases', contribution: 0.31 },
  { name: 'Example factor: systolic blood pressure', direction: 'increases', contribution: 0.24 },
  { name: 'Example factor: total cholesterol', direction: 'increases', contribution: 0.19 },
  { name: 'Example factor: family history', direction: 'increases', contribution: 0.12 },
  { name: 'Example factor: physical activity', direction: 'decreases', contribution: 0.08 },
  { name: 'Example factor: smoking status', direction: 'increases', contribution: 0.06 },
]

const EXAMPLE_INPUT: AssessmentInput = {
  age: 52,
  sex: 'female',
  height_cm: 165,
  weight_kg: 70,
  systolic_bp: 142,
  total_cholesterol: 5.9,
  hdl_cholesterol: 1.1,
  fasting_glucose: 6.4,
  smoking_status: 'former',
  physical_activity_150min: 'no',
  diagnosed_hypertension: 'yes',
  family_history: 'yes',
}

function riskCategory(probability: number): RiskCategory {
  if (probability < 0.1) return 'low'
  if (probability < 0.2) return 'moderate'
  if (probability < 0.3) return 'high'
  return 'very_high'
}

function exampleResult(id: string, createdAt: string, cvd: number, t2d: number): AssessmentResult {
  const risks: RiskEstimate[] = [
    {
      ...EXAMPLE_RISKS[0],
      probability: cvd,
      category: riskCategory(cvd),
    },
    {
      ...EXAMPLE_RISKS[1],
      probability: t2d,
      category: riskCategory(t2d),
    },
  ]
  return {
    id,
    created_at: createdAt,
    model_version: 'mock-illustrative-1.0',
    risks,
    factors: EXAMPLE_FACTORS,
    disclaimer: MOCK_DISCLAIMER,
    input: EXAMPLE_INPUT,
  }
}

/** Two example records so that the trend view (FR-07) has something to show. */
const SEED_RESULTS: AssessmentResult[] = [
  exampleResult('mock-assessment-1', '2026-01-12T09:30:00.000Z', 0.07, 0.04),
  exampleResult('mock-assessment-2', '2026-06-04T09:30:00.000Z', 0.09, 0.05),
]

const EXAMPLE_MODEL: ModelInfo = {
  version: 'mock-illustrative-1.0',
  trained_at: '2026-01-01T00:00:00.000Z',
  datasets: ['example dataset A (illustrative)', 'example dataset B (illustrative)'],
  metrics: {
    cvd_auc: 0,
    t2d_auc: 0,
  },
}

/**
 * In-memory adapter with illustrative example data.
 *
 * The data lives only for the time the page is open — the mock never sends
 * anything to a server and stores nothing.
 */
export class MockMedRiskApi implements MedRiskApi {
  readonly mode = 'mock' as const

  private results: AssessmentResult[]

  constructor(seed: AssessmentResult[] = SEED_RESULTS) {
    this.results = [...seed]
  }

  async createAssessment(_input: AssessmentInput): Promise<AssessmentResult> {
    const created = exampleResult(
      `mock-assessment-${this.results.length + 1}`,
      new Date().toISOString(),
      EXAMPLE_RISKS[0].probability,
      EXAMPLE_RISKS[1].probability,
    )
    this.results = [created, ...this.results]
    return created
  }

  async listAssessments(): Promise<AssessmentSummary[]> {
    return this.results.map((result) => ({
      id: result.id,
      created_at: result.created_at,
      model_version: result.model_version,
      risks: result.risks.map(({ target, probability, category }) => ({
        target,
        probability,
        category,
      })),
    }))
  }

  async getAssessment(id: string): Promise<AssessmentResult> {
    const found = this.results.find((result) => result.id === id)
    if (!found) {
      throw new Error(`The assessment "${id}" was not found.`)
    }
    return found
  }

  async deleteAssessment(id: string): Promise<void> {
    this.results = this.results.filter((result) => result.id !== id)
  }

  async deleteAccount(): Promise<void> {
    this.results = []
  }

  async getCurrentModel(): Promise<ModelInfo> {
    return EXAMPLE_MODEL
  }
}

/** The risk target in the order in which the results are displayed. */
export const RISK_TARGETS: RiskTarget[] = ['cvd', 't2d']
