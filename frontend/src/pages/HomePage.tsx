import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../api/ApiContext'
import type { ModelInfo } from '../api/types'
import { t } from '../i18n'

/**
 * The start page (FR-03): what the tool does, what it cannot do and the way
 * into the questionnaire. The page never promises a diagnosis.
 */
export function HomePage() {
  return (
    <>
      <h1>{t('home.title')}</h1>
      <p className="lead">{t('home.intro')}</p>

      <section className="card" aria-labelledby="safety-title">
        <h2 className="card__title" id="safety-title">
          {t('home.cannot_title')}
        </h2>
        <p>{t('home.cannot_diagnosis')}</p>
        <p>{t('home.cannot_treatment')}</p>
        <p>{t('home.cannot_help')}</p>
      </section>

      <p className="actions">
        <Link className="btn" to="/assessment">
          {t('home.start')}
        </Link>
        <Link className="btn btn--secondary" to="/history">
          {t('home.history')}
        </Link>
      </p>

      <section className="card" aria-labelledby="model-info-title">
        <h2 className="card__title" id="model-info-title">
          {t('home.model_title')}
        </h2>
        <ModelInfo />
      </section>
    </>
  )
}

/**
 * The model information block (FR-09). It is loaded through the API adapter; in
 * mock mode it shows the placeholders of the mock adapter.
 */
function ModelInfo() {
  const api = useApi()
  const [model, setModel] = useState<ModelInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    api
      .getCurrentModel()
      .then((info) => {
        if (active) setModel(info)
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : String(cause))
      })
    return () => {
      active = false
    }
  }, [api])

  if (error) {
    return <p className="field__error">{error}</p>
  }
  if (!model) {
    return <p>{t('generic.loading')}</p>
  }

  return (
    <>
      {api.mode === 'mock' ? <p className="notice">{t('home.model_pending')}</p> : null}
      <dl className="definition-list">
        <dt>{t('home.model_version')}</dt>
        <dd className="mono">{model.version}</dd>
        <dt>{t('home.model_trained_at')}</dt>
        <dd>{model.trained_at.slice(0, 10)}</dd>
        <dt>{t('home.model_datasets')}</dt>
        <dd>{model.datasets.join(', ')}</dd>
        <dt>{t('home.model_metrics')}</dt>
        <dd>
          {Object.entries(model.metrics).map(([name, value]) => (
            <span className="metric" key={name}>
              <span className="mono">{name}</span>: {value}
            </span>
          ))}
        </dd>
      </dl>
    </>
  )
}
