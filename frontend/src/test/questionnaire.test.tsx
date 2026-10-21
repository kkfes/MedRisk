import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRoutes, AppShell } from '../App'
import { MockMedRiskApi } from '../api/mock'
import type { MedRiskApi } from '../api/port'

function renderQuestionnaire(api: MedRiskApi = new MockMedRiskApi()) {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={['/assessment']}>
      <AppShell api={api}>
        <AppRoutes />
      </AppShell>
    </MemoryRouter>,
  )
  return { user, api }
}

/** Fills the eight required questions with valid values. */
async function fillRequiredAnswers(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^Age/), '52')
  await user.click(screen.getByLabelText('Female'))
  await user.type(screen.getByLabelText(/^Height/), '165')
  await user.type(screen.getByLabelText(/^Weight/), '70')
  await user.click(screen.getByLabelText('No', { selector: '#smoking-no' }))
  await user.click(screen.getByLabelText('No', { selector: '#physical_activity-no' }))
  await user.click(screen.getByLabelText('No', { selector: '#hypertension-no' }))
  await user.click(screen.getByLabelText('No', { selector: '#family_history-no' }))
}

describe('the questionnaire', () => {
  it('shows the twelve questions with a real label', () => {
    renderQuestionnaire()

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Health questionnaire')
    expect(screen.getByLabelText(/^Age/)).toBeInTheDocument()
    expect(screen.getByLabelText('Female')).toBeInTheDocument()
    expect(screen.getByLabelText(/^Height/)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Weight/)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Systolic blood pressure/)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Total cholesterol/)).toBeInTheDocument()
    expect(screen.getByLabelText(/^HDL cholesterol/)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Fasting glucose/)).toBeInTheDocument()
    expect(screen.getByLabelText('I used to, but I stopped')).toBeInTheDocument()
  })

  it('counts the progress while the form is filled', async () => {
    const { user } = renderQuestionnaire()

    expect(screen.getByText(/0 of 12 answered/)).toBeInTheDocument()
    await user.type(screen.getByLabelText(/^Age/), '52')
    expect(screen.getByText(/1 of 12 answered/)).toBeInTheDocument()
    expect(screen.getByText(/1 of 8 required/)).toBeInTheDocument()
  })

  it('rejects an empty form with an error summary and focuses it', async () => {
    const { user } = renderQuestionnaire()

    await user.click(screen.getByRole('button', { name: 'Calculate my risk' }))

    const summary = screen.getByRole('alert')
    expect(summary).toHaveTextContent('The form contains errors')
    expect(summary).toHaveTextContent('8 errors')
    expect(summary).toHaveFocus()
    expect(screen.getByLabelText(/^Age/)).toHaveAttribute('aria-invalid', 'true')
  })

  it('links every error to its field', async () => {
    const { user } = renderQuestionnaire()

    await user.click(screen.getByRole('button', { name: 'Calculate my risk' }))

    // The message appears twice: in the error summary and next to the field.
    const [summaryLink, fieldError] = screen.getAllByText('Enter a value for “Age”.')
    const ageInput = screen.getByLabelText(/^Age/)

    expect(ageInput).toHaveAttribute('aria-invalid', 'true')
    expect(ageInput.getAttribute('aria-describedby')).toContain(
      fieldError.getAttribute('id') as string,
    )
    expect(summaryLink.getAttribute('href')).toBe('#age')
  })

  it('rejects a value that is out of range', async () => {
    const { user } = renderQuestionnaire()

    await user.type(screen.getByLabelText(/^Age/), '10')
    await user.click(screen.getByRole('button', { name: 'Calculate my risk' }))

    expect(
      screen.getAllByText('The value for “Age” must be between 18 and 90 years.').length,
    ).toBeGreaterThan(0)
  })

  it('rejects a value that is not a whole number', async () => {
    const { user } = renderQuestionnaire()

    await user.type(screen.getByLabelText(/^Age/), '52.5')
    await user.click(screen.getByRole('button', { name: 'Calculate my risk' }))

    expect(screen.getAllByText('Enter a whole number for “Age”.').length).toBeGreaterThan(0)
  })

  it('accepts the four optional measurements left empty', async () => {
    const { user } = renderQuestionnaire()

    await fillRequiredAnswers(user)
    await user.click(screen.getByRole('button', { name: 'Calculate my risk' }))

    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('creates the assessment and goes to the report when every answer is valid', async () => {
    const { user, api } = renderQuestionnaire()
    const created: unknown[] = []
    const spy = api.createAssessment.bind(api)
    api.createAssessment = async (input) => {
      created.push(input)
      return spy(input)
    }

    await fillRequiredAnswers(user)
    await user.type(screen.getByLabelText(/^Systolic blood pressure/), '142')
    await user.click(screen.getByRole('button', { name: 'Calculate my risk' }))

    await waitFor(() => expect(screen.getByText(/implemented in task DIP-37/)).toBeInTheDocument())
    expect(created).toHaveLength(1)
    expect(created[0]).toMatchObject({
      age: 52,
      sex: 'female',
      height_cm: 165,
      weight_kg: 70,
      smoking_status: 'no',
      systolic_bp: 142,
    })
  })

  it('shows the error of the service when the assessment fails', async () => {
    const api = new MockMedRiskApi()
    api.createAssessment = async () => {
      throw new Error('The MedRisk service is temporarily unavailable. Please try again later.')
    }
    const { user } = renderQuestionnaire(api)

    await fillRequiredAnswers(user)
    await user.click(screen.getByRole('button', { name: 'Calculate my risk' }))

    await waitFor(() =>
      expect(
        screen.getByText('The MedRisk service is temporarily unavailable. Please try again later.'),
      ).toBeInTheDocument(),
    )
  })
})
