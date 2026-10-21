import type { ReactNode } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { ApiContext } from './api/ApiContext'
import { createApi } from './api'
import type { MedRiskApi } from './api/port'
import { t } from './i18n'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PlaceholderPage } from './pages/PlaceholderPage'

/**
 * The application shell: skip link, header, navigation, the mock notice, the
 * main landmark and the footer. The landmarks are the same as in the static
 * prototype (DIP-8), so the accessibility check of the prototype applies here.
 */
export function AppShell({ api, children }: { api: MedRiskApi; children: ReactNode }) {
  return (
    <ApiContext.Provider value={api}>
      <a className="skip-link" href="#main-content">
        {t('app.skip_to_content')}
      </a>

      <header className="site-header">
        <div className="site-header__inner">
          <Link className="site-header__brand" to="/">
            {t('app.name')}
          </Link>
          <p className="site-header__tagline">{t('app.tagline')}</p>
          <nav className="site-nav" aria-label={t('app.main_navigation')}>
            <Link to="/">{t('nav.home')}</Link>
            <Link to="/assessment">{t('nav.assessment')}</Link>
            <Link to="/history">{t('nav.history')}</Link>
          </nav>
        </div>
      </header>

      {api.mode === 'mock' ? <p className="notice site-notice">{t('app.mock_notice')}</p> : null}

      <main className="site-main" id="main-content" tabIndex={-1}>
        {children}
      </main>

      <footer className="site-footer">
        <p>{t('app.footer_note')}</p>
      </footer>
    </ApiContext.Provider>
  )
}

/**
 * The routes of the application. The screens of DIP-36 … DIP-38 are already
 * routed, so that the navigation can be reviewed in an early state.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/assessment"
        element={
          <PlaceholderPage title={t('nav.assessment')} message="placeholder.assessment" />
        }
      />
      <Route
        path="/report/:id"
        element={<PlaceholderPage title={t('nav.report')} message="placeholder.report" />}
      />
      <Route
        path="/history"
        element={<PlaceholderPage title={t('nav.history')} message="placeholder.history" />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

/** The whole application. */
export function App({ api = createApi() }: { api?: MedRiskApi }) {
  return (
    <BrowserRouter>
      <AppShell api={api}>
        <AppRoutes />
      </AppShell>
    </BrowserRouter>
  )
}
