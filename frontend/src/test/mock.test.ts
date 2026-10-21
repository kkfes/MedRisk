import { describe, expect, it } from 'vitest'
import { MockMedRiskApi } from '../api/mock'
import type { AssessmentInput } from '../api/types'

const INPUT: AssessmentInput = {
  age: 45,
  sex: 'male',
  height_cm: 180,
  weight_kg: 85,
  smoking_status: 'yes',
  physical_activity_150min: 'no',
  diagnosed_hypertension: 'no',
  family_history: 'no',
}

describe('the mock adapter', () => {
  it('is marked as mock mode', () => {
    expect(new MockMedRiskApi().mode).toBe('mock')
  })

  it('returns a fixed illustrative example that does not depend on the answers', async () => {
    const api = new MockMedRiskApi()
    const first = await api.createAssessment(INPUT)
    const second = await api.createAssessment({ ...INPUT, age: 80, smoking_status: 'former' })

    expect(first.risks[0].probability).toBe(second.risks[0].probability)
    expect(first.disclaimer).toContain('not a diagnosis')
  })

  it('lists the seeded assessments and the new ones, newest first', async () => {
    const api = new MockMedRiskApi()
    const before = await api.listAssessments()
    expect(before.length).toBeGreaterThanOrEqual(2)

    const created = await api.createAssessment(INPUT)
    const after = await api.listAssessments()

    expect(after.length).toBe(before.length + 1)
    expect(after[0].id).toBe(created.id)
  })

  it('deletes one record and the whole account', async () => {
    const api = new MockMedRiskApi()
    const list = await api.listAssessments()

    await api.deleteAssessment(list[0].id)
    const afterDelete = await api.listAssessments()
    expect(afterDelete.some((item) => item.id === list[0].id)).toBe(false)

    await api.deleteAccount()
    expect(await api.listAssessments()).toHaveLength(0)
  })
})
