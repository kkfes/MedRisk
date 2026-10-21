import type { TranslationKey } from '../i18n'

/**
 * The questionnaire of MedRisk (FR-01).
 *
 * The definition of the questions is data, not markup: the form, the validation
 * and the tests all read the same list, so a question can never be added to the
 * form without its rule. The ranges are the ones of the prototype (DIP-8).
 *
 * Eight questions are required, four are optional measurements that a
 * participant may not know — that is the limit of the FR-01 questionnaire.
 */
export type QuestionId =
  | 'age'
  | 'sex'
  | 'height'
  | 'weight'
  | 'systolic_bp'
  | 'total_cholesterol'
  | 'hdl_cholesterol'
  | 'fasting_glucose'
  | 'smoking'
  | 'physical_activity'
  | 'hypertension'
  | 'family_history'

/** The raw answers of the form. Everything is a string while the user types. */
export type QuestionnaireValues = Record<QuestionId, string>

interface BaseQuestion {
  id: QuestionId
  labelKey: TranslationKey
  required: boolean
}

export interface NumberQuestion extends BaseQuestion {
  kind: 'number'
  hintKey: TranslationKey
  /** The unit of the value, for example `years` or `mmHg`. */
  unit: string
  min: number
  max: number
  /** The step the value has to be a multiple of. */
  step: number
  /** The field accepts whole numbers only. */
  integer: boolean
}

export interface ChoiceQuestion extends BaseQuestion {
  kind: 'choice'
  options: Array<{ value: string; labelKey: TranslationKey }>
}

export type Question = NumberQuestion | ChoiceQuestion

export const QUESTIONS: Question[] = [
  {
    id: 'age',
    kind: 'number',
    labelKey: 'question.age.label',
    hintKey: 'question.age.hint',
    unit: 'years',
    min: 18,
    max: 90,
    step: 1,
    integer: true,
    required: true,
  },
  {
    id: 'sex',
    kind: 'choice',
    labelKey: 'question.sex.label',
    required: true,
    options: [
      { value: 'female', labelKey: 'option.sex.female' },
      { value: 'male', labelKey: 'option.sex.male' },
    ],
  },
  {
    id: 'height',
    kind: 'number',
    labelKey: 'question.height.label',
    hintKey: 'question.height.hint',
    unit: 'cm',
    min: 120,
    max: 230,
    step: 1,
    integer: true,
    required: true,
  },
  {
    id: 'weight',
    kind: 'number',
    labelKey: 'question.weight.label',
    hintKey: 'question.weight.hint',
    unit: 'kg',
    min: 30,
    max: 250,
    step: 0.5,
    integer: false,
    required: true,
  },
  {
    id: 'systolic_bp',
    kind: 'number',
    labelKey: 'question.systolic_bp.label',
    hintKey: 'question.systolic_bp.hint',
    unit: 'mmHg',
    min: 80,
    max: 250,
    step: 1,
    integer: true,
    required: false,
  },
  {
    id: 'total_cholesterol',
    kind: 'number',
    labelKey: 'question.total_cholesterol.label',
    hintKey: 'question.total_cholesterol.hint',
    unit: 'mmol/L',
    min: 2,
    max: 15,
    step: 0.1,
    integer: false,
    required: false,
  },
  {
    id: 'hdl_cholesterol',
    kind: 'number',
    labelKey: 'question.hdl_cholesterol.label',
    hintKey: 'question.hdl_cholesterol.hint',
    unit: 'mmol/L',
    min: 0.5,
    max: 4,
    step: 0.1,
    integer: false,
    required: false,
  },
  {
    id: 'fasting_glucose',
    kind: 'number',
    labelKey: 'question.fasting_glucose.label',
    hintKey: 'question.fasting_glucose.hint',
    unit: 'mmol/L',
    min: 2,
    max: 30,
    step: 0.1,
    integer: false,
    required: false,
  },
  {
    id: 'smoking',
    kind: 'choice',
    labelKey: 'question.smoking.label',
    required: true,
    options: [
      { value: 'no', labelKey: 'option.smoking.no' },
      { value: 'yes', labelKey: 'option.smoking.yes' },
      { value: 'former', labelKey: 'option.smoking.former' },
    ],
  },
  {
    id: 'physical_activity',
    kind: 'choice',
    labelKey: 'question.physical_activity.label',
    required: true,
    options: [
      { value: 'no', labelKey: 'option.yesno.no' },
      { value: 'yes', labelKey: 'option.yesno.yes' },
    ],
  },
  {
    id: 'hypertension',
    kind: 'choice',
    labelKey: 'question.hypertension.label',
    required: true,
    options: [
      { value: 'no', labelKey: 'option.yesno.no' },
      { value: 'yes', labelKey: 'option.yesno.yes' },
    ],
  },
  {
    id: 'family_history',
    kind: 'choice',
    labelKey: 'question.family_history.label',
    required: true,
    options: [
      { value: 'no', labelKey: 'option.yesno.no' },
      { value: 'yes', labelKey: 'option.yesno.yes' },
    ],
  },
]

/** The questions of the first group — they have to be answered. */
export const REQUIRED_QUESTIONS = QUESTIONS.filter((question) => question.required)

/** The questions of the second group — they can be skipped. */
export const OPTIONAL_QUESTIONS = QUESTIONS.filter((question) => !question.required)

/** An empty answer set. */
export const EMPTY_VALUES: QuestionnaireValues = QUESTIONS.reduce(
  (values, question) => ({ ...values, [question.id]: '' }),
  {} as QuestionnaireValues,
)
