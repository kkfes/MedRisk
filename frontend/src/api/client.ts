import type { MedRiskApi } from './port'
import type {
  AssessmentInput,
  AssessmentResult,
  AssessmentSummary,
  ModelInfo,
} from './types'

/**
 * Error thrown by the HTTP client for every non-2xx answer of the API.
 * The status code is kept, so the user interface can distinguish a validation
 * error (400/422) from a missing authorisation (401) or a server error (5xx).
 */
export class ApiError extends Error {
  readonly status: number
  readonly details: string

  constructor(message: string, status: number, details = '') {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

/** Options of the HTTP client. */
export interface HttpMedRiskApiOptions {
  /** Base URL of the API, for example `http://127.0.0.1:8000`. */
  baseUrl: string
  /** Injectable fetch, used by the tests. */
  fetchImpl?: typeof fetch
  /** Optional access token of the authenticated mode (FR-05). */
  getAccessToken?: () => string | null
}

/**
 * HTTP client of the MedRisk REST API.
 *
 * The endpoints follow the requirements specification (FR-02, FR-06, FR-09);
 * they are not yet verified against the committed OpenAPI document (DIP-18),
 * see the note at the top of `types.ts`.
 */
export class HttpMedRiskApi implements MedRiskApi {
  readonly mode = 'live' as const

  private readonly baseUrl: string
  private readonly fetchImpl: typeof fetch
  private readonly getAccessToken?: () => string | null

  constructor(options: HttpMedRiskApiOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, '')
    this.fetchImpl = options.fetchImpl ?? globalThis.fetch.bind(globalThis)
    this.getAccessToken = options.getAccessToken
  }

  /** Absolute URL of an API path, for example `/api/v1/assessments`. */
  url(path: string): string {
    return `${this.baseUrl}${path}`
  }

  async createAssessment(input: AssessmentInput): Promise<AssessmentResult> {
    return this.request<AssessmentResult>('POST', '/api/v1/assessments', input)
  }

  async listAssessments(): Promise<AssessmentSummary[]> {
    return this.request<AssessmentSummary[]>('GET', '/api/v1/assessments')
  }

  async getAssessment(id: string): Promise<AssessmentResult> {
    return this.request<AssessmentResult>('GET', `/api/v1/assessments/${encodeURIComponent(id)}`)
  }

  async deleteAssessment(id: string): Promise<void> {
    await this.request<null>('DELETE', `/api/v1/assessments/${encodeURIComponent(id)}`)
  }

  async deleteAccount(): Promise<void> {
    await this.request<null>('DELETE', '/api/v1/account')
  }

  async getCurrentModel(): Promise<ModelInfo> {
    return this.request<ModelInfo>('GET', '/api/v1/models/current')
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'DELETE',
    path: string,
    body?: unknown,
  ): Promise<T> {
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json'
    }
    const token = this.getAccessToken?.()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    let response: Response
    try {
      response = await this.fetchImpl(this.url(path), {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      })
    } catch (cause) {
      throw new ApiError('The MedRisk service is not reachable. Please try again later.', 0, String(cause))
    }

    if (!response.ok) {
      throw new ApiError(await this.readErrorMessage(response), response.status, await this.readBody(response))
    }

    if (response.status === 204) {
      return null as T
    }

    return (await response.json()) as T
  }

  private async readErrorMessage(response: Response): Promise<string> {
    if (response.status === 401) {
      return 'Please sign in to see your assessments.'
    }
    if (response.status === 403) {
      return 'This action is not allowed for your account.'
    }
    if (response.status === 404) {
      return 'The requested record was not found.'
    }
    if (response.status === 422 || response.status === 400) {
      return 'Some of the values were not accepted. Please check the highlighted fields.'
    }
    if (response.status >= 500) {
      return 'The MedRisk service is temporarily unavailable. Please try again later.'
    }
    return `The request failed (HTTP ${response.status}).`
  }

  private async readBody(response: Response): Promise<string> {
    try {
      return await response.text()
    } catch {
      return ''
    }
  }
}
