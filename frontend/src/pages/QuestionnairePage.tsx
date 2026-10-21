import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../api/ApiContext'
import { t } from '../i18n'
import {
  EMPTY_VALUES,
  QUESTIONS,
  REQUIRED_QUESTIONS,
  type ChoiceQuestion,
  type NumberQuestion,
  type Question,
  type QuestionId,
  type QuestionnaireValues,
} from '../questionnaire/questions'
import {
  countAnswered,
  countAnsweredRequired,
  questionsOfGroup,
  validateQuestionnaire,
} from '../questionnaire/validation'

/**
 * The questionnaire (FR-01).
 *
 * The screen shows the same 12 questions as the prototype (DIP-8): eight of them
 * are required, four measurements are optional. The validation runs on the
 * values of the schema in `src/questionnaire/questions.ts`, the messages are
 * linked to their field and the error summary at the top of the form links to
 * the invalid fields.
 */
export function QuestionnairePage() {
  const api = useApi()
  const navigate = useNavigate()

  const [values, setValues] = useState<QuestionnaireValues>(EMPTY_VALUES)
  const [errors, setErrors] = useState<Partial<Record<QuestionId, string>>>({})
  const [errorCount, setErrorCount] = useState(0)
  const [focusToken, setFocusToken] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const summaryRef = useRef<HTMLDivElement>(null)

  const requiredQuestions = useMemo(() => questionsOfGroup('required'), [])
  const optionalQuestions = useMemo(() => questionsOfGroup('optional'), [])
  const answered = countAnswered(values)
  const answeredRequired = countAnsweredRequired(values)

  // After a failed submission the focus goes to the error summary, which links
  // to every invalid field (the pattern of the GOV.UK error summary).
  useEffect(() => {
    if (focusToken > 0) {
      summaryRef.current?.focus()
    }
  }, [focusToken])

  function setValue(id: QuestionId, value: string) {
    setValues((current) => ({ ...current, [id]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) {
      return
    }

    const outcome = validateQuestionnaire(values)
    const errorMap: Partial<Record<QuestionId, string>> = {}
    for (const error of outcome.errors) {
      errorMap[error.id] = error.message
    }
    setErrors(errorMap)
    setErrorCount(outcome.errors.length)

    if (!outcome.valid || !outcome.input) {
      setFocusToken((token) => token + 1)
      return
    }

    setSubmitting(true)
    setApiError(null)
    try {
      const result = await api.createAssessment(outcome.input)
      navigate(`/report/${result.id}`)
    } catch (cause) {
      setApiError(cause instanceof Error ? cause.message : t('questionnaire.api_error'))
      setSubmitting(false)
    }
  }

  return (
    <>
      <h1>{t('questionnaire.title')}</h1>
      <p className="lead">{t('questionnaire.intro')}</p>

      <div className="questionnaire-progress">
        <label
          className="progress__label"
          id="questionnaire-progress-label"
          htmlFor="questionnaire-progress"
        >
          {t('questionnaire.progress_label')}
        </label>
        <progress
          className="progress"
          id="questionnaire-progress"
          max={QUESTIONS.length}
          value={answered}
          aria-labelledby="questionnaire-progress-label"
          aria-describedby="questionnaire-progress-text"
        />
        <p className="progress__label" id="questionnaire-progress-text">
          {t('questionnaire.progress_text', {
            answered,
            total: QUESTIONS.length,
            answeredRequired,
            required: REQUIRED_QUESTIONS.length,
            optional: optionalQuestions.length,
          })}
        </p>
      </div>

      {errorCount > 0 ? (
        <div
          className="disclaimer-top"
          id="error-summary"
          ref={summaryRef}
          role="alert"
          tabIndex={-1}
          aria-labelledby="error-summary-title"
        >
          <h2 id="error-summary-title">{t('validation.summary_title')}</h2>
          <p>{t('validation.summary_intro', { count: errorCount })}</p>
          <ul>
            {Object.entries(errors).map(([id, message]) => (
              <li key={id}>
                <a href={`#${id}`}>{message}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {apiError ? (
        <p className="disclaimer-top" role="alert">
          {apiError}
        </p>
      ) : null}

      {api.mode === 'mock' ? <p className="notice">{t('questionnaire.mock_note')}</p> : null}

      <form noValidate onSubmit={handleSubmit} aria-busy={submitting}>
        <fieldset className="choice-group">
          <legend className="choice-group__legend">{t('questionnaire.required_legend')}</legend>
          {requiredQuestions.map((question) => (
            <QuestionField
              key={question.id}
              question={question}
              value={values[question.id] ?? ''}
              error={errors[question.id]}
              onChange={setValue}
            />
          ))}
        </fieldset>

        <fieldset className="choice-group">
          <legend className="choice-group__legend">
            {t('questionnaire.optional_legend')}
          </legend>
          {optionalQuestions.map((question) => (
            <QuestionField
              key={question.id}
              question={question}
              value={values[question.id] ?? ''}
              error={errors[question.id]}
              onChange={setValue}
            />
          ))}
        </fieldset>

        <p className="actions">
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? t('questionnaire.submitting') : t('questionnaire.submit')}
          </button>
        </p>
      </form>
    </>
  )
}

/** One field of the form — a number field or a group of radio buttons. */
function QuestionField({
  question,
  value,
  error,
  onChange,
}: {
  question: Question
  value: string
  error?: string
  onChange: (id: QuestionId, value: string) => void
}) {
  if (question.kind === 'number') {
    return (
      <NumberField question={question} value={value} error={error} onChange={onChange} />
    )
  }
  return <ChoiceField question={question} value={value} error={error} onChange={onChange} />
}

function NumberField({
  question,
  value,
  error,
  onChange,
}: {
  question: NumberQuestion
  value: string
  error?: string
  onChange: (id: QuestionId, value: string) => void
}) {
  const hintId = `${question.id}-hint`
  const errorId = `${question.id}-error`

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(question.id, event.target.value)
  }

  return (
    <div className={`field${error ? ' field--invalid' : ''}`}>
      <label className="field__label" htmlFor={question.id}>
        {t(question.labelKey)}
        <span className="visually-hidden">
          {question.required ? t('questionnaire.required_badge') : t('questionnaire.optional_badge')}
        </span>
      </label>
      <p className="field__hint" id={hintId}>
        {t(question.hintKey)}
      </p>
      <input
        className="field__input"
        id={question.id}
        name={question.id}
        type="number"
        inputMode={question.integer ? 'numeric' : 'decimal'}
        min={question.min}
        max={question.max}
        step={question.step}
        required={question.required}
        value={value}
        onChange={handleChange}
        aria-describedby={error ? `${hintId} ${errorId}` : hintId}
        aria-invalid={error ? 'true' : undefined}
      />
      {error ? (
        <p className="field__error" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

function ChoiceField({
  question,
  value,
  error,
  onChange,
}: {
  question: ChoiceQuestion
  value: string
  error?: string
  onChange: (id: QuestionId, value: string) => void
}) {
  const errorId = `${question.id}-error`

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(question.id, event.target.value)
  }

  return (
    <fieldset
      className="choice-group"
      aria-describedby={error ? errorId : undefined}
      aria-invalid={error ? 'true' : undefined}
    >
      <legend className="choice-group__legend">{t(question.labelKey)}</legend>
      <div className="choice-group__options">
        {question.options.map((option) => {
          const optionId = `${question.id}-${option.value}`
          return (
            <label className="choice" key={option.value}>
              <input
                id={optionId}
                type="radio"
                name={question.id}
                value={option.value}
                required={question.required}
                checked={value === option.value}
                onChange={handleChange}
                aria-describedby={error ? errorId : undefined}
                aria-invalid={error ? 'true' : undefined}
              />
              {t(option.labelKey)}
            </label>
          )
        })}
      </div>
      {error ? (
        <p className="field__error" id={errorId}>
          {error}
        </p>
      ) : null}
    </fieldset>
  )
}
