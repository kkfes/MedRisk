import type { AssessmentInput, Sex, SmokingStatus, YesNo } from '../api/types'
import { t } from '../i18n'

/** One row of the table "What you entered". */
export interface EnteredValue {
  label: string
  value: string
}

function optionLabel(
  group: 'sex' | 'smoking' | 'yesno',
  value: string,
): string {
  if (group === 'sex') {
    return t(value === 'female' ? 'option.sex.female' : 'option.sex.male')
  }
  if (group === 'smoking') {
    if (value === 'former') return t('option.smoking.former')
    return t(value === 'yes' ? 'option.smoking.yes' : 'option.smoking.no')
  }
  return t(value === 'yes' ? 'option.yesno.yes' : 'option.yesno.no')
}

/**
 * The answers of the questionnaire as rows of the table "What you entered".
 *
 * The labels are the labels of the questionnaire (FR-03), so the report and the
 * form always use the same words. An optional measurement that was not
 * answered is shown as "not answered" instead of an empty cell.
 */
export function describeInput(input: AssessmentInput): EnteredValue[] {
  const rows: EnteredValue[] = [
    { label: t('question.age.label'), value: `${input.age} ${t('unit.years')}` },
    { label: t('question.sex.label'), value: optionLabel('sex', input.sex as Sex) },
    { label: t('question.height.label'), value: `${input.height_cm} ${t('unit.cm')}` },
    { label: t('question.weight.label'), value: `${input.weight_kg} ${t('unit.kg')}` },
  ]

  const optional: Array<[string, number | undefined]> = [
    [t('question.systolic_bp.label'), input.systolic_bp],
    [t('question.total_cholesterol.label'), input.total_cholesterol],
    [t('question.hdl_cholesterol.label'), input.hdl_cholesterol],
    [t('question.fasting_glucose.label'), input.fasting_glucose],
  ]
  for (const [label, value] of optional) {
    rows.push({
      label,
      value: value === undefined ? t('report.not_answered') : String(value),
    })
  }

  rows.push(
    { label: t('question.smoking.label'), value: optionLabel('smoking', input.smoking_status as SmokingStatus) },
    {
      label: t('question.physical_activity.label'),
      value: optionLabel('yesno', input.physical_activity_150min as YesNo),
    },
    {
      label: t('question.hypertension.label'),
      value: optionLabel('yesno', input.diagnosed_hypertension as YesNo),
    },
    {
      label: t('question.family_history.label'),
      value: optionLabel('yesno', input.family_history as YesNo),
    },
  )

  return rows
}
