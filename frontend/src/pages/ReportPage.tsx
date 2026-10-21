import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApi } from '../api/ApiContext'
import type { AssessmentResult, RiskEstimate } from '../api/types'
import { t } from '../i18n'
import { describeInput } from '../risk/describeInput'
import {
  DIRECTION_SYMBOLS,
  RISK_BADGE_CLASSES,
  RISK_CATEGORY_LABELS,
  RISK_SYMBOLS,
  RISK_TARGET_TITLES,
  formatProbability,
  largestContribution,
  shareOfLargest,
  sortFactorsByContribution,
} from '../risk/format'

/**
 * The risk report (FR-03, FR-04, NFR-06).
 *
 * The screen shows, for **both** risks: the numeric value, the category with its
 * symbol and text label, the plain-language summary of the API and the
 * disclaimer. Below that, the factors are listed with their direction and their
 * magnitude, sorted by the size of their contribution.
 */
export function ReportPage() {
  const api = useApi()
  const { id } = useParams<{ id: string }>()
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    if (!id) {
      return
    }
    api
      .getAssessment(id)
      .then((assessment) => {
        if (active) setResult(assessment)
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : t('report.not_found'))
        }
      })
    return () => {
      active = false
    }
  }, [api, id])

  if (!id || error) {
    return (
      <>
        <h1>{t('report.title')}</h1>
        <p className="disclaimer-top" role="alert">
          {error ?? t('report.not_found')}
        </p>
        <p>
          <Link className="btn" to="/assessment">
            {t('report.new_assessment')}
          </Link>
        </p>
      </>
    )
  }

  if (!result) {
    return (
      <>
        <h1>{t('report.title')}</h1>
        <p>{t('report.loading')}</p>
      </>
    )
  }

  return (
    <>
      <h1>{t('report.title')}</h1>

      {/* The disclaimer is mandatory on every result screen (FR-03, NFR-06). */}
      <p className="disclaimer" role="note">
        {result.disclaimer}
      </p>

      <section className="card" aria-labelledby="entered-title">
        <h2 className="card__title" id="entered-title">
          {t('report.entered_title')}
        </h2>
        <table className="result-table">
          <caption>{t('report.entered_caption')}</caption>
          <tbody>
            {describeInput(result.input).map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card" aria-labelledby="risk-title">
        <h2 className="card__title" id="risk-title">
          {t('report.risk_title')}
        </h2>
        {result.risks.map((risk) => (
          <RiskBlock key={risk.target} risk={risk} />
        ))}
      </section>

      <section className="card" aria-labelledby="factors-title">
        <h2 className="card__title" id="factors-title">
          {t('report.factors_title')}
        </h2>
        <p>{t('report.factors_intro')}</p>
        <FactorList factors={result.factors} />
      </section>

      <section className="card" aria-labelledby="help-title">
        <h2 className="card__title" id="help-title">
          {t('report.help_title')}
        </h2>
        <ul>
          <li>{t('report.help_physician')}</li>
          <li>{t('report.help_diagnosed')}</li>
          <li>{t('report.help_take_page')}</li>
        </ul>
        <h3>{t('report.cannot_title')}</h3>
        <ul>
          <li>{t('report.cannot_diagnosis')}</li>
          <li>{t('report.cannot_treatment')}</li>
        </ul>
      </section>

      <p className="actions">
        <Link className="btn" to="/assessment">
          {t('report.new_assessment')}
        </Link>
        <Link className="btn btn--secondary" to="/history">
          {t('report.history')}
        </Link>
      </p>

      <p className="notice">
        {t('report.model_version')}: <span className="mono">{result.model_version}</span> ·{' '}
        {t('report.created_at')}: {result.created_at.slice(0, 10)}
      </p>
    </>
  )
}

/** One risk: the number, the category and the plain-language summary (FR-03). */
function RiskBlock({ risk }: { risk: RiskEstimate }) {
  return (
    <article className="risk-block" aria-labelledby={`risk-${risk.target}`}>
      <h3 id={`risk-${risk.target}`}>{RISK_TARGET_TITLES[risk.target]}</h3>
      <p className="risk-value">
        <span className="visually-hidden">{t('report.risk_value_label')}: </span>
        {formatProbability(risk.probability)}
      </p>
      <p>
        <span className={`risk-badge ${RISK_BADGE_CLASSES[risk.category]}`}>
          <span className="risk-badge__symbol" aria-hidden="true">
            {RISK_SYMBOLS[risk.category]}
          </span>
          {t(RISK_CATEGORY_LABELS[risk.category])}
        </span>
      </p>
      <p>{risk.summary}</p>
    </article>
  )
}

/** The factors with their direction and magnitude, the largest first (FR-04). */
function FactorList({ factors }: { factors: AssessmentResult['factors'] }) {
  const sorted = useMemo(() => sortFactorsByContribution(factors), [factors])
  const largest = useMemo(() => largestContribution(sorted), [sorted])

  return (
    <ul className="factors" aria-label={t('report.factors_list')}>
      {sorted.map((factor) => {
        const share = shareOfLargest(Math.abs(factor.contribution), largest)
        return (
          <li className="factor" key={factor.name}>
            <p className="factor__name">{factor.name}</p>
            <p className="factor__direction">
              <span aria-hidden="true">{DIRECTION_SYMBOLS[factor.direction]}</span>{' '}
              {t(
                factor.direction === 'increases'
                  ? 'report.factor_increases'
                  : 'report.factor_decreases',
              )}{' '}
              — {t('report.factor_share', { share })}
            </p>
            <div className="factor__bar" aria-hidden="true">
              <span
                className={factor.direction === 'increases' ? 'is-up' : 'is-down'}
                style={{ width: `${share}%` }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
