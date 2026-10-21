import { render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppShell } from '../App'
import { MockMedRiskApi } from '../api/mock'
import type { AssessmentResult } from '../api/types'
import { ReportPage } from '../pages/ReportPage'

const RESULT: AssessmentResult = {
  id: 'a1',
  created_at: '2026-06-04T09:30:00.000Z',
  model_version: '1.2.3',
  risks: [
    {
      target: 'cvd',
      probability: 0.12,
      category: 'moderate',
      summary: 'Your cardiovascular risk is 12 % over the next 10 years.',
    },
    {
      target: 't2d',
      probability: 0.28,
      category: 'high',
      summary: 'Your type 2 diabetes risk is 28 % over the next 10 years.',
    },
  ],
  factors: [
    { name: 'Age', direction: 'increases', contribution: 0.2 },
    { name: 'Systolic blood pressure', direction: 'increases', contribution: 0.5 },
    { name: 'Family history', direction: 'increases', contribution: 0.1 },
    { name: 'Physical activity', direction: 'decreases', contribution: 0.3 },
    { name: 'Smoking status', direction: 'increases', contribution: 0.05 },
  ],
  disclaimer: 'This is not a diagnosis and not medical advice.',
  input: {
    age: 52,
    sex: 'female',
    height_cm: 165,
    weight_kg: 70,
    systolic_bp: 142,
    smoking_status: 'former',
    physical_activity_150min: 'no',
    diagnosed_hypertension: 'yes',
    family_history: 'yes',
  },
}

function renderReport(result: AssessmentResult = RESULT) {
  const api = new MockMedRiskApi()
  api.getAssessment = async () => result
  render(
    <MemoryRouter initialEntries={['/report/a1']}>
      <AppShell api={api}>
        <Routes>
          <Route path="/report/:id" element={<ReportPage />} />
        </Routes>
      </AppShell>
    </MemoryRouter>,
  )
  return api
}

describe('the risk report', () => {
  it('shows the numeric value, the category and the summary for both risks (FR-03)', async () => {
    renderReport()

    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Your risk report'),
    )

    // Cardiovascular risk
    expect(screen.getByRole('heading', { name: 'Cardiovascular disease · 10 years' })).toBeInTheDocument()
    expect(screen.getByText('12 %')).toBeInTheDocument()
    expect(screen.getByText('Moderate risk')).toBeInTheDocument()
    expect(
      screen.getByText('Your cardiovascular risk is 12 % over the next 10 years.'),
    ).toBeInTheDocument()

    // Type 2 diabetes risk
    expect(screen.getByRole('heading', { name: 'Type 2 diabetes · 10 years' })).toBeInTheDocument()
    expect(screen.getByText('28 %')).toBeInTheDocument()
    expect(screen.getByText('High risk')).toBeInTheDocument()
    expect(
      screen.getByText('Your type 2 diabetes risk is 28 % over the next 10 years.'),
    ).toBeInTheDocument()
  })

  it('shows the disclaimer of the response (FR-03, NFR-06)', async () => {
    renderReport()

    await waitFor(() =>
      expect(screen.getByText('This is not a diagnosis and not medical advice.')).toBeInTheDocument(),
    )
  })

  it('shows the category with a symbol, never with a colour alone (WCAG 1.4.1)', async () => {
    renderReport()

    await waitFor(() => expect(screen.getByText('Moderate risk')).toBeInTheDocument())
    const badge = screen.getByText('Moderate risk')
    expect(badge).toHaveClass('risk-badge', 'risk-badge--moderate')
    expect(badge.querySelector('.risk-badge__symbol')).toHaveTextContent('◆')
  })

  it('shows the factors in the descending order of their contribution (FR-04)', async () => {
    renderReport()

    await waitFor(() =>
      expect(
        within(screen.getByRole('list', { name: 'Factors that influence the estimate' })).getByText(
          'Systolic blood pressure',
        ),
      ).toBeInTheDocument(),
    )

    const factors = within(screen.getByRole('list', { name: 'Factors that influence the estimate' }))
    const names = factors
      .getAllByRole('listitem')
      .map((item) => item.querySelector('.factor__name')?.textContent)

    expect(names).toEqual([
      'Systolic blood pressure',
      'Physical activity',
      'Age',
      'Family history',
      'Smoking status',
    ])
  })

  it('shows the direction of every factor as a word and a symbol', async () => {
    renderReport()

    await waitFor(() =>
      expect(
        within(screen.getByRole('list', { name: 'Factors that influence the estimate' })).getByText(
          'Systolic blood pressure',
        ),
      ).toBeInTheDocument(),
    )

    const factors = within(screen.getByRole('list', { name: 'Factors that influence the estimate' }))
    expect(factors.getAllByText(/increases your risk/)).toHaveLength(4)
    expect(factors.getAllByText(/decreases your risk/)).toHaveLength(1)
  })

  it('shows the magnitude of every factor as a share of the largest contribution', async () => {
    renderReport()

    await waitFor(() =>
      expect(
        within(screen.getByRole('list', { name: 'Factors that influence the estimate' })).getByText(
          'Systolic blood pressure',
        ),
      ).toBeInTheDocument(),
    )

    const factors = within(screen.getByRole('list', { name: 'Factors that influence the estimate' }))
    // The largest contribution is 0.5 (systolic blood pressure).
    expect(factors.getByText(/100 % of the largest contribution/)).toBeInTheDocument()
    expect(factors.getByText(/60 % of the largest contribution/)).toBeInTheDocument()
  })

  it('shows what the user entered', async () => {
    renderReport()

    await waitFor(() => expect(screen.getByText('What you entered')).toBeInTheDocument())
    expect(screen.getByRole('rowheader', { name: 'Age' })).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: 'Sex' })).toBeInTheDocument()
    expect(screen.getByText('Female')).toBeInTheDocument()
    // The three optional measurements that were not answered.
    expect(screen.getAllByText('not answered')).toHaveLength(3)
  })

  it('shows that the tool does not diagnose and where to seek help', async () => {
    renderReport()

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Who can help you interpret this result' })).toBeInTheDocument(),
    )
    expect(
      screen.getByText(
        'It does not diagnose. The numbers are probabilities, not a conclusion about your health.',
      ),
    ).toBeInTheDocument()
  })

  it('shows an error when the assessment cannot be loaded', async () => {
    const api = new MockMedRiskApi()
    api.getAssessment = async () => {
      throw new Error('The requested record was not found.')
    }
    render(
      <MemoryRouter initialEntries={['/report/unknown']}>
        <AppShell api={api}>
          <Routes>
            <Route path="/report/:id" element={<ReportPage />} />
          </Routes>
        </AppShell>
      </MemoryRouter>,
    )

    await waitFor(() =>
      expect(screen.getByText('The requested record was not found.')).toBeInTheDocument(),
    )
  })
})
