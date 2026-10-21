import type {
  AssessmentInput,
  Sex,
  SmokingStatus,
  YesNo,
} from '../api/types'
import { t } from '../i18n'
import {
  QUESTIONS,
  type ChoiceQuestion,
  type NumberQuestion,
  type Question,
  type QuestionId,
  type QuestionnaireValues,
} from './questions'

/** One validation problem of the form. */
export interface FieldError {
  id: QuestionId
  /** The message that is shown next to the field and in the error summary. */
  message: string
}

/** The result of the validation of the whole form. */
export interface ValidationOutcome {
  valid: boolean
  errors: FieldError[]
  /** The answers, ready for the API — only set when the form is valid. */
  input?: AssessmentInput
}

function isMultipleOf(value: number, step: number): boolean {
  const quotient = value / step
  return Math.abs(quotient - Math.round(quotient)) < 1e-9
}

function validateNumber(
  question: NumberQuestion,
  rawValue: string,
): { error?: string; value?: number } {
  const label = t(question.labelKey)
  const value = rawValue.trim()

  if (value === '') {
    return question.required
      ? { error: t('validation.required', { label }) }
      : {}
  }

  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    return { error: t('validation.number', { label }) }
  }
  if (question.integer && !Number.isInteger(parsed)) {
    return { error: t('validation.integer', { label }) }
  }
  if (parsed < question.min || parsed > question.max) {
    return {
      error: t('validation.range', {
        label,
        min: question.min,
        max: question.max,
        unit: question.unit,
      }),
    }
  }
  if (!isMultipleOf(parsed, question.step)) {
    return { error: t('validation.step', { label, step: question.step }) }
  }
  return { value: parsed }
}

function validateChoice(
  question: ChoiceQuestion,
  rawValue: string,
): { error?: string; value?: string } {
  const value = rawValue.trim()
  if (value === '') {
    return question.required
      ? { error: t('validation.choice_required', { label: t(question.labelKey) }) }
      : {}
  }
  if (!question.options.some((option) => option.value === value)) {
    return { error: t('validation.choice_required', { label: t(question.labelKey) }) }
  }
  return { value }
}

/**
 * Validates the answers of the questionnaire (FR-01).
 *
 * The rules are the ones of the prototype (DIP-8): the ranges of the numbers and
 * the fact that the optional measurements may be empty. An invalid value is
 * rejected with a message that is linked to its field.
 */
export function validateQuestionnaire(values: QuestionnaireValues): ValidationOutcome {
  const errors: FieldError[] = []
  const numbers: Partial<Record<QuestionId, number>> = {}
  const choices: Partial<Record<QuestionId, string>> = {}

  for (const question of QUESTIONS) {
    const rawValue = values[question.id] ?? ''
    if (question.kind === 'number') {
      const result = validateNumber(question, rawValue)
      if (result.error) {
        errors.push({ id: question.id, message: result.error })
      } else if (result.value !== undefined) {
        numbers[question.id] = result.value
      }
    } else {
      const result = validateChoice(question, rawValue)
      if (result.error) {
        errors.push({ id: question.id, message: result.error })
      } else if (result.value !== undefined) {
        choices[question.id] = result.value
      }
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return { valid: true, errors, input: toAssessmentInput(numbers, choices) }
}

/** Builds the payload of the API from the validated answers. */
function toAssessmentInput(
  numbers: Partial<Record<QuestionId, number>>,
  choices: Partial<Record<QuestionId, string>>,
): AssessmentInput {
  const input: AssessmentInput = {
    age: numbers.age as number,
    sex: choices.sex as Sex,
    height_cm: numbers.height as number,
    weight_kg: numbers.weight as number,
    smoking_status: choices.smoking as SmokingStatus,
    physical_activity_150min: choices.physical_activity as YesNo,
    diagnosed_hypertension: choices.hypertension as YesNo,
    family_history: choices.family_history as YesNo,
  }

  if (numbers.systolic_bp !== undefined) input.systolic_bp = numbers.systolic_bp
  if (numbers.total_cholesterol !== undefined) input.total_cholesterol = numbers.total_cholesterol
  if (numbers.hdl_cholesterol !== undefined) input.hdl_cholesterol = numbers.hdl_cholesterol
  if (numbers.fasting_glucose !== undefined) input.fasting_glucose = numbers.fasting_glucose

  return input
}

/** Counts the questions that have an answer. */
export function countAnswered(values: QuestionnaireValues): number {
  return QUESTIONS.filter((question) => (values[question.id] ?? '').trim() !== '').length
}

/** Counts the required questions that have an answer. */
export function countAnsweredRequired(values: QuestionnaireValues): number {
  return QUESTIONS.filter(
    (question) => question.required && (values[question.id] ?? '').trim() !== '',
  ).length
}

/** The questions of one group, in the order they are shown. */
export function questionsOfGroup(group: 'required' | 'optional'): Question[] {
  return QUESTIONS.filter((question) => (group === 'required' ? question.required : !question.required))
}
