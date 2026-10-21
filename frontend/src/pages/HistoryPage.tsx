import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../api/ApiContext'
import type { AssessmentSummary, RiskTarget } from '../api/types'
import { TrendChart } from '../components/TrendChart'
import { t } from '../i18n'
import {
  RISK_BADGE_CLASSES,
  RISK_CATEGORY_LABELS,
  RISK_SYMBOLS,
  formatProbability,
} from '../risk/format'
import { buildTrendPoints, formatDate } from '../risk/trend'

/**
 * The history and the trend (FR-06, FR-07, NFR-04).
 *
 * The screen lists every assessment of the account with its date, both risks and
 * their category, allows the deletion of a single record and shows the trend of
 * the risk over time as soon as there are two assessments.
 */
export function HistoryPage() {
  const api = useApi()
  const [assessments, setAssessments] = useState<AssessmentSummary[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)
  const [confirmAccountDelete, setConfirmAccountDelete] = useState(false)
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let active = true
    api
      .listAssessments()
      .then((list) => {
        if (active) setAssessments(list)
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : t('history.load_error'))
          setAssessments([])
        }
      })
    return () => {
      active = false
    }
  }, [api])

  // The confirmation button gets the focus, so that the keyboard user stays in
  // the context of the action.
  useEffect(() => {
    if (pendingDelete) {
      confirmRef.current?.focus()
    }
  }, [pendingDelete])

  async function handleDelete(id: string) {
    setError(null)
    try {
      await api.deleteAssessment(id)
      setAssessments((current) => (current ?? []).filter((item) => item.id !== id))
      setStatus(t('history.deleted'))
      setPendingDelete(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('history.delete_error'))
      setPendingDelete(null)
    }
  }

  async function handleDeleteAccount() {
    setError(null)
    try {
      await api.deleteAccount()
      setAssessments([])
      setConfirmAccountDelete(false)
      setStatus(t('history.account_deleted'))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('history.delete_error'))
    }
  }

  const points = buildTrendPoints(assessments ?? [])

  return (
    <>
      <h1>{t('history.title')}</h1>
      <p className="lead">{t('history.intro')}</p>

      {error ? (
        <p className="disclaimer-top" role="alert">
          {error}
        </p>
      ) : null}

      {status ? (
        <p className="notice" role="status">
          {status}
        </p>
      ) : null}

      <section className="card" aria-labelledby="trend-title">
        <h2 className="card__title" id="trend-title">
          {t('history.trend_title')}
        </h2>
        <p>{t('history.trend_intro')}</p>
        {assessments === null ? (
          <p>{t('history.loading')}</p>
        ) : (
          <TrendChart points={points} />
        )}
      </section>

      <section className="card" aria-labelledby="list-title">
        <h2 className="card__title" id="list-title">
          {t('history.list_title')}
        </h2>

        {assessments === null ? (
          <p>{t('history.loading')}</p>
        ) : assessments.length === 0 ? (
          <>
            <p>{t('history.empty')}</p>
            <p>
              <Link className="btn" to="/assessment">
                {t('history.start')}
              </Link>
            </p>
          </>
        ) : (
          <table className="result-table history-table">
            <caption>{t('history.list_caption')}</caption>
            <thead>
              <tr>
                <th scope="col">{t('history.column_date')}</th>
                <th scope="col">{t('history.column_cvd')}</th>
                <th scope="col">{t('history.column_t2d')}</th>
                <th scope="col">{t('history.column_model')}</th>
                <th scope="col">{t('history.column_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((assessment) => (
                <tr key={assessment.id}>
                  <th scope="row">{formatDate(assessment.created_at)}</th>
                  <td>
                    <RiskCell assessment={assessment} target="cvd" />
                  </td>
                  <td>
                    <RiskCell assessment={assessment} target="t2d" />
                  </td>
                  <td className="mono">{assessment.model_version}</td>
                  <td>
                    {pendingDelete === assessment.id ? (
                      <div className="history__confirm">
                        <p>{t('history.delete_confirm')}</p>
                        <p className="actions">
                          <button
                            className="btn btn--danger"
                            type="button"
                            ref={confirmRef}
                            onClick={() => handleDelete(assessment.id)}
                          >
                            {t('history.delete_yes')}
                          </button>
                          <button
                            className="btn btn--secondary"
                            type="button"
                            onClick={() => setPendingDelete(null)}
                          >
                            {t('history.delete_cancel')}
                          </button>
                        </p>
                      </div>
                    ) : (
                      <p className="actions">
                        <Link
                          className="btn btn--secondary"
                          to={`/report/${assessment.id}`}
                        >
                          {t('history.open_report')}
                        </Link>
                        <button
                          className="btn btn--secondary"
                          type="button"
                          onClick={() => {
                            setStatus(null)
                            setPendingDelete(assessment.id)
                          }}
                        >
                          {t('history.delete')}
                        </button>
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="card" aria-labelledby="account-title">
        <h2 className="card__title" id="account-title">
          {t('history.account_title')}
        </h2>
        <p>{t('history.account_intro')}</p>
        {confirmAccountDelete ? (
          <div className="history__confirm">
            <p className="disclaimer-top" role="alert">
              {t('history.delete_account_confirm', { count: assessments?.length ?? 0 })}
            </p>
            <p className="actions">
              <button className="btn btn--danger" type="button" onClick={handleDeleteAccount}>
                {t('history.delete_account_yes')}
              </button>
              <button
                className="btn btn--secondary"
                type="button"
                onClick={() => setConfirmAccountDelete(false)}
              >
                {t('history.delete_cancel')}
              </button>
            </p>
          </div>
        ) : (
          <p className="actions">
            <button
              className="btn btn--secondary"
              type="button"
              onClick={() => setConfirmAccountDelete(true)}
            >
              {t('history.delete_account')}
            </button>
          </p>
        )}
      </section>
    </>
  )
}

/** One cell of the table: the probability and the category of a risk. */
function RiskCell({
  assessment,
  target,
}: {
  assessment: AssessmentSummary
  target: RiskTarget
}) {
  const risk = assessment.risks.find((entry) => entry.target === target)
  if (!risk) {
    return <span className="history__missing">—</span>
  }

  return (
    <>
      <span className="history__probability">{formatProbability(risk.probability)}</span>{' '}
      <span className={`risk-badge ${RISK_BADGE_CLASSES[risk.category]}`}>
        <span className="risk-badge__symbol" aria-hidden="true">
          {RISK_SYMBOLS[risk.category]}
        </span>
        {t(RISK_CATEGORY_LABELS[risk.category])}
      </span>
    </>
  )
}
