import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRoutes, AppShell } from '../App'
import { MockMedRiskApi } from '../api/mock'
import type { MedRiskApi } from '../api/port'

function renderHistory(api: MedRiskApi = new MockMedRiskApi()) {
  const user = userEvent.setup()
  render(
    <MemoryRouter initialEntries={['/history']}>
      <AppShell api={api}>
        <AppRoutes />
      </AppShell>
    </MemoryRouter>,
  )
  return { user, api }
}

describe('the assessment history', () => {
  it('lists every assessment with its date, both risks and their category (FR-06)', async () => {
    renderHistory()

    await waitFor(() =>
      expect(screen.getByRole('table')).toBeInTheDocument(),
    )

    const rows = screen.getAllByRole('row')
    // The header row and the two example records.
    expect(rows).toHaveLength(3)

    expect(screen.getByRole('rowheader', { name: '2026-06-04' })).toBeInTheDocument()
    expect(screen.getByRole('rowheader', { name: '2026-01-12' })).toBeInTheDocument()
    expect(screen.getByText('7 %')).toBeInTheDocument()
    expect(screen.getByText('9 %')).toBeInTheDocument()
    expect(screen.getAllByText('Low risk')).toHaveLength(4)
  })

  it('links every record to its report', async () => {
    renderHistory()

    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument())
    const links = screen.getAllByRole('link', { name: 'Open the report' })
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAttribute('href', '/report/mock-assessment-2')
  })

  it('shows the trend chart when there are two assessments (FR-07)', async () => {
    renderHistory()

    await waitFor(() => expect(screen.getByRole('img')).toBeInTheDocument())
    const chart = screen.getByRole('img')
    expect(chart).toHaveAccessibleName(
      /cardiovascular risk rose from 7 % to 9 %, the type 2 diabetes risk rose from 4 % to 5 %/,
    )
    // Two series, each with a point per assessment.
    expect(document.querySelectorAll('.chart__point--cvd')).toHaveLength(2)
    expect(document.querySelectorAll('.chart__point--t2d')).toHaveLength(2)
  })

  it('shows a hint instead of the chart with less than two assessments (FR-07)', async () => {
    renderHistory(new MockMedRiskApi([]))

    await waitFor(() =>
      expect(
        screen.getByText('Make at least two assessments to see the trend of your risk over time.'),
      ).toBeInTheDocument(),
    )
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('asks before a record is deleted and deletes it after the confirmation (FR-06)', async () => {
    const { user } = renderHistory()

    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument())
    const buttons = screen.getAllByRole('button', { name: 'Delete this record' })
    await user.click(buttons[0])

    expect(screen.getByText('Delete this record? It cannot be undone.')).toBeInTheDocument()
    // Nothing is deleted before the confirmation.
    expect(screen.getAllByRole('row')).toHaveLength(3)

    await user.click(screen.getByRole('button', { name: 'Yes, delete the record' }))

    await waitFor(() => expect(screen.getAllByRole('row')).toHaveLength(2))
    expect(screen.getByText('The record was deleted.')).toBeInTheDocument()
  })

  it('keeps the record when the confirmation is cancelled', async () => {
    const { user } = renderHistory()

    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument())
    await user.click(screen.getAllByRole('button', { name: 'Delete this record' })[0])
    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.getAllByRole('row')).toHaveLength(3)
    expect(screen.queryByText('The record was deleted.')).toBeNull()
  })

  it('deletes the account with all its records (NFR-04)', async () => {
    const { user } = renderHistory()

    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument())
    await user.click(screen.getByRole('button', { name: 'Delete my account' }))

    expect(screen.getByText('Delete the account and all 2 records? This cannot be undone.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Yes, delete the account' }))

    await waitFor(() => expect(screen.queryByRole('table')).toBeNull())
    expect(screen.getByText('The account and all its records were deleted.')).toBeInTheDocument()
    expect(screen.getByText('There is no assessment yet.')).toBeInTheDocument()
  })

  it('shows an empty state when there is no assessment', async () => {
    renderHistory(new MockMedRiskApi([]))

    await waitFor(() => expect(screen.getByText('There is no assessment yet.')).toBeInTheDocument())
    expect(screen.getByRole('link', { name: 'Make an assessment' })).toHaveAttribute(
      'href',
      '/assessment',
    )
  })

  it('shows the model version of every record', async () => {
    renderHistory()

    await waitFor(() => expect(screen.getByRole('table')).toBeInTheDocument())
    const row = screen.getAllByRole('row')[1]
    expect(within(row).getAllByText(/mock-illustrative-1\.0/).length).toBeGreaterThan(0)
  })
})
