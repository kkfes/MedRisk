import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRoutes, AppShell } from '../App'
import { HttpMedRiskApi } from '../api/client'
import { MockMedRiskApi } from '../api/mock'

function renderApp(path = '/') {
  const api = new MockMedRiskApi()
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppShell api={api}>
        <AppRoutes />
      </AppShell>
    </MemoryRouter>,
  )
  return api
}

describe('the application shell', () => {
  it('shows the start page with the heading of the application', () => {
    renderApp()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Estimate your 10-year risk',
    )
  })

  it('has a skip link that points to the main landmark', () => {
    renderApp()
    const skipLink = screen.getByRole('link', { name: 'Skip to the main content' })
    expect(skipLink).toHaveAttribute('href', '#main-content')
    expect(document.getElementById('main-content')).not.toBeNull()
  })

  it('has a main landmark and a navigation with a label', () => {
    renderApp()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
  })

  it('shows a visible notice that the data is an illustrative example in mock mode', () => {
    renderApp()
    expect(screen.getByText(/Mock mode/)).toBeInTheDocument()
  })

  it('does not show the mock notice in live mode', () => {
    const api = new HttpMedRiskApi({
      baseUrl: 'http://api.test',
      fetchImpl: async () =>
        new Response(
          JSON.stringify({
            version: 'test-1.0',
            trained_at: '2026-01-01T00:00:00.000Z',
            datasets: [],
            metrics: {},
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
    })
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppShell api={api}>
          <AppRoutes />
        </AppShell>
      </MemoryRouter>,
    )
    expect(screen.queryByText(/Mock mode/)).toBeNull()
  })

  it('offers the questionnaire and the history as the next steps', () => {
    renderApp()
    expect(screen.getByRole('link', { name: 'Start the questionnaire' })).toHaveAttribute(
      'href',
      '/assessment',
    )
    expect(screen.getByRole('link', { name: 'View my assessment history' })).toHaveAttribute(
      'href',
      '/history',
    )
  })

  it('states that the tool does not diagnose', () => {
    renderApp()
    expect(
      screen.getByText(
        'It does not diagnose. A risk estimate is a probability, not a conclusion about your health.',
      ),
    ).toBeInTheDocument()
  })
})

describe('the routes', () => {
  it('routes to the questionnaire', () => {
    renderApp('/assessment')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Health questionnaire')
    expect(screen.getByRole('button', { name: 'Calculate my risk' })).toBeInTheDocument()
  })

  it('routes to the history', () => {
    renderApp('/history')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Assessment history')
  })

  it('shows the not-found page for an unknown address', () => {
    renderApp('/does-not-exist')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found')
  })
})
