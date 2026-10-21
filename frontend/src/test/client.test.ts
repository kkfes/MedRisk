import { describe, expect, it, vi } from 'vitest'
import { ApiError, HttpMedRiskApi } from '../api/client'
import type { AssessmentInput, AssessmentResult } from '../api/types'

const INPUT: AssessmentInput = {
  age: 52,
  sex: 'female',
  height_cm: 165,
  weight_kg: 70,
  smoking_status: 'former',
  physical_activity_150min: 'no',
  diagnosed_hypertension: 'yes',
  family_history: 'yes',
}

const RESULT: AssessmentResult = {
  id: 'a1',
  created_at: '2026-06-04T09:30:00.000Z',
  model_version: '1.0.0',
  risks: [
    {
      target: 'cvd',
      probability: 0.12,
      category: 'moderate',
      summary: 'Example',
    },
  ],
  factors: [{ name: 'Age', direction: 'increases', contribution: 0.3 }],
  disclaimer: 'Not a diagnosis.',
  input: INPUT,
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/** A fetch stub whose calls are typed, so that the assertions can read them. */
function mockFetch(handler: (url: string, init?: RequestInit) => Promise<Response>) {
  return vi.fn(async (input: RequestInfo | URL, init?: RequestInit) =>
    handler(String(input), init),
  )
}

describe('the HTTP client', () => {
  it('posts the questionnaire to /api/v1/assessments', async () => {
    const fetchImpl = mockFetch(async () => jsonResponse(RESULT))
    const api = new HttpMedRiskApi({ baseUrl: 'http://api.test/', fetchImpl })

    const result = await api.createAssessment(INPUT)

    expect(result.id).toBe('a1')
    expect(fetchImpl).toHaveBeenCalledTimes(1)
    const [url, init] = fetchImpl.mock.calls[0]
    expect(url).toBe('http://api.test/api/v1/assessments')
    expect(init?.method).toBe('POST')
    expect(init?.headers).toMatchObject({ 'Content-Type': 'application/json' })
    expect(JSON.parse(String(init?.body))).toEqual(INPUT)
  })

  it('lists the assessments and deletes one record', async () => {
    const fetchImpl = mockFetch(async (url) => {
      if (url.endsWith('/api/v1/assessments')) {
        return jsonResponse([{ id: 'a1' }])
      }
      return new Response(null, { status: 204 })
    })
    const api = new HttpMedRiskApi({ baseUrl: 'http://api.test', fetchImpl })

    await api.listAssessments()
    await api.deleteAssessment('a1')

    expect(fetchImpl.mock.calls[0][0]).toBe('http://api.test/api/v1/assessments')
    expect(fetchImpl.mock.calls[1][0]).toBe('http://api.test/api/v1/assessments/a1')
    expect(fetchImpl.mock.calls[1][1]?.method).toBe('DELETE')
  })

  it('sends the access token when the authenticated mode is used', async () => {
    const fetchImpl = mockFetch(async () => jsonResponse(RESULT))
    const api = new HttpMedRiskApi({
      baseUrl: 'http://api.test',
      fetchImpl,
      getAccessToken: () => 'token-123',
    })

    await api.getAssessment('a1')

    expect(fetchImpl.mock.calls[0][1]?.headers).toMatchObject({
      Authorization: 'Bearer token-123',
    })
  })

  it('turns a validation error into a readable message', async () => {
    const fetchImpl = mockFetch(async () => jsonResponse({ detail: 'invalid' }, 422))
    const api = new HttpMedRiskApi({ baseUrl: 'http://api.test', fetchImpl })

    await expect(api.createAssessment(INPUT)).rejects.toBeInstanceOf(ApiError)
    await expect(api.createAssessment(INPUT)).rejects.toThrow(/not accepted/)
  })

  it('reports an unreachable service', async () => {
    const fetchImpl = mockFetch(async () => {
      throw new TypeError('Failed to fetch')
    })
    const api = new HttpMedRiskApi({ baseUrl: 'http://api.test', fetchImpl })

    await expect(api.listAssessments()).rejects.toThrow(/not reachable/)
  })
})
