/**
 * English translation table (FR-12).
 *
 * Every user-visible string of the application comes from this table, so that
 * Russian and Kazakh can be added later without touching the components.
 * The keys are grouped by the screen that uses them.
 */
export const en = {
  /* ------------------------------------------------------------------ app */
  'app.name': 'MedRisk',
  'app.tagline': 'Cardiovascular and type 2 diabetes risk estimate',
  'app.skip_to_content': 'Skip to the main content',
  'app.main_navigation': 'Main navigation',
  'app.footer_note':
    'MedRisk is a decision-support tool for a diploma project. It estimates risk and ' +
    'explains which factors contribute to it. It does not diagnose, does not prescribe ' +
    'and is not a substitute for a consultation with a doctor.',
  'app.mock_notice':
    'Mock mode: the application shows illustrative example data. The real model and the ' +
    'backend service are not connected yet, so no real risk is calculated here.',
  'app.placeholder_badge': 'Not implemented yet',

  /* ------------------------------------------------------------ navigation */
  'nav.home': 'Start page',
  'nav.assessment': 'Questionnaire',
  'nav.report': 'Risk report',
  'nav.history': 'History',

  /* ---------------------------------------------------------------- home */
  'home.title': 'Estimate your 10-year risk',
  'home.intro':
    'Answer 12 questions about your age, blood pressure, cholesterol, lifestyle and ' +
    'family history. You will get an estimate of the 10-year risk of cardiovascular ' +
    'disease and of type 2 diabetes, together with the factors that contribute most.',
  'home.start': 'Start the questionnaire',
  'home.history': 'View my assessment history',
  'home.model_title': 'Model information',
  'home.model_version': 'Model version',
  'home.model_trained_at': 'Trained on',
  'home.model_datasets': 'Training data',
  'home.model_metrics': 'Evaluation metrics',
  'home.model_pending':
    'The trained model is not connected yet. The values below are placeholders.',
  'home.cannot_title': 'What this tool cannot tell you',
  'home.cannot_diagnosis':
    'It does not diagnose. A risk estimate is a probability, not a conclusion about your health.',
  'home.cannot_treatment':
    'It does not give treatment or medication advice and it does not tell you what to change.',
  'home.cannot_help':
    'It shows where to seek help: with a family doctor, a therapist or an emergency service.',
  'home.safety_title': 'Safety note',

  /* -------------------------------------------------------------- generic */
  'generic.back_home': 'Back to the start page',
  'generic.loading': 'Loading …',
  'generic.error_title': 'Something went wrong',
  'generic.not_found_title': 'Page not found',
  'generic.not_found_text':
    'The address you opened does not exist. The pages of the application are listed in ' +
    'the navigation above.',
  'generic.action': 'Action',

  /* ------------------------------------------------------- questionnaire */
  'questionnaire.title': 'Health questionnaire',
  'questionnaire.intro':
    'Answer the questions about your health and lifestyle. Eight questions are required; ' +
    'the four measurements are optional and can be skipped if you do not know them. You can ' +
    'change every answer before you submit.',
  'questionnaire.progress_label': 'Questionnaire progress',
  'questionnaire.progress_text':
    '{answered} of {total} answered · {answeredRequired} of {required} required · ' +
    '{optional} optional measurements can be skipped',
  'questionnaire.required_legend': 'Required questions',
  'questionnaire.optional_legend': 'Optional measurements',
  'questionnaire.required_badge': 'Required',
  'questionnaire.optional_badge': 'Optional',
  'questionnaire.submit': 'Calculate my risk',
  'questionnaire.submitting': 'Calculating …',
  'questionnaire.back_home': 'Back to the start page',
  'questionnaire.api_error':
    'The risk could not be calculated at the moment. Please try again in a few minutes.',
  'questionnaire.mock_note':
    'The example values you will see afterwards are fixed examples of the mock adapter — ' +
    'they are not calculated from your answers.',

  /* ------------------------------------------------------ question labels */
  'question.age.label': 'Age',
  'question.age.hint': 'Years (18–90)',
  'question.sex.label': 'Sex',
  'question.height.label': 'Height',
  'question.height.hint': 'Centimetres (120–230)',
  'question.weight.label': 'Weight',
  'question.weight.hint': 'Kilograms (30–250, step 0.5)',
  'question.systolic_bp.label': 'Systolic blood pressure',
  'question.systolic_bp.hint': 'mmHg (80–250). Leave the field empty if you do not know it.',
  'question.total_cholesterol.label': 'Total cholesterol',
  'question.total_cholesterol.hint': 'mmol/L (2–15). Leave the field empty if you do not know it.',
  'question.hdl_cholesterol.label': 'HDL cholesterol',
  'question.hdl_cholesterol.hint': 'mmol/L (0.5–4). Leave the field empty if you do not know it.',
  'question.fasting_glucose.label': 'Fasting glucose',
  'question.fasting_glucose.hint': 'mmol/L (2–30). Leave the field empty if you do not know it.',
  'question.smoking.label': 'Do you smoke?',
  'question.physical_activity.label':
    'Physical activity of at least 150 minutes per week?',
  'question.hypertension.label':
    'Have you been diagnosed with high blood pressure (hypertension)?',
  'question.family_history.label':
    'Do any of your parents or siblings have heart disease or diabetes?',

  /* ---------------------------------------------------------- answer options */
  'option.sex.female': 'Female',
  'option.sex.male': 'Male',
  'option.smoking.no': 'No',
  'option.smoking.yes': 'Yes',
  'option.smoking.former': 'I used to, but I stopped',
  'option.yesno.no': 'No',
  'option.yesno.yes': 'Yes',

  /* ------------------------------------------------------------ validation */
  'validation.required': 'Enter a value for “{label}”.',
  'validation.number': 'Enter a number for “{label}”.',
  'validation.integer': 'Enter a whole number for “{label}”.',
  'validation.range': 'The value for “{label}” must be between {min} and {max} {unit}.',
  'validation.step': 'The value for “{label}” must be a multiple of {step}.',
  'validation.choice_required': 'Select one option for “{label}”.',
  'validation.summary_title': 'The form contains errors',
  'validation.summary_intro':
    'Fix the {count} errors below and send the form again. Every error links to its field.',
  'validation.summary_link': 'Go to {label}',

  /* ------------------------------------------------------------- report */
  'report.title': 'Your risk report',
  'report.loading': 'Loading the result …',
  'report.not_found':
    'The assessment could not be found. It may have been deleted.',
  'report.entered_title': 'What you entered',
  'report.entered_caption': 'The answers of your questionnaire.',
  'report.risk_title': 'Estimated risk',
  'report.risk_value_label': 'Estimated 10-year risk',
  'report.not_answered': 'not answered',
  'report.factors_title': 'What drives your risk',
  'report.factors_list': 'Factors that influence the estimate',
  'report.factors_intro':
    'Each row shows one factor and how much it moved your estimate. The magnitude is ' +
    'given as a share of the largest contribution in this estimate.',
  'report.factor_increases': 'increases your risk',
  'report.factor_decreases': 'decreases your risk',
  'report.factor_share': '{share} % of the largest contribution in this estimate',
  'report.help_title': 'Who can help you interpret this result',
  'report.help_physician':
    'Start with a primary-care physician (therapist / GP / family doctor).',
  'report.help_diagnosed':
    'If you already have a diagnosis (for example hypertension or diabetes), mention it — ' +
    'the estimate does not replace it.',
  'report.help_take_page':
    'Bring this page with you: the table of your answers and the factor list make the ' +
    'conversation easier.',
  'report.cannot_title': 'What this tool cannot tell you',
  'report.cannot_diagnosis':
    'It does not diagnose. The numbers are probabilities, not a conclusion about your health.',
  'report.cannot_treatment':
    'It does not tell you what to change, how to change it or which medicine to take.',
  'report.new_assessment': 'Make another assessment',
  'report.history': 'Open the history',
  'report.model_version': 'Model version',
  'report.created_at': 'Date of the assessment',

  /* --------------------------------------------------------- risk levels */
  'risk_category.low': 'Low risk',
  'risk_category.moderate': 'Moderate risk',
  'risk_category.high': 'High risk',
  'risk_category.very_high': 'Very high risk',

  /* -------------------------------------------------------------- units */
  'unit.years': 'years',
  'unit.cm': 'cm',
  'unit.kg': 'kg',

  /* ------------------------------------------------------------- history */
  'history.title': 'Assessment history',
  'history.intro':
    'Every assessment of this account with its date, both risks and their category. ' +
    'You can delete a single record or the whole account.',
  'history.loading': 'Loading the assessments …',
  'history.load_error': 'The assessments could not be loaded.',
  'history.delete_error': 'The record could not be deleted. Please try again.',
  'history.empty': 'There is no assessment yet.',
  'history.start': 'Make an assessment',
  'history.trend_title': 'Trend of your risk over time',
  'history.trend_intro':
    'Each point is one assessment, the oldest on the left. The solid line is the ' +
    'cardiovascular risk, the dashed line is the type 2 diabetes risk.',
  'history.trend_hint':
    'Make at least two assessments to see the trend of your risk over time.',
  'history.chart_label': 'Line chart of the two risks over time: {summary}',
  'history.legend_cvd': 'Cardiovascular disease (solid line)',
  'history.legend_t2d': 'Type 2 diabetes (dashed line)',
  'history.list_title': 'All assessments',
  'history.list_caption': 'The assessments of this account, newest first.',
  'history.column_date': 'Date',
  'history.column_cvd': 'Cardiovascular disease',
  'history.column_t2d': 'Type 2 diabetes',
  'history.column_model': 'Model',
  'history.column_actions': 'Actions',
  'history.open_report': 'Open the report',
  'history.delete': 'Delete this record',
  'history.delete_confirm': 'Delete this record? It cannot be undone.',
  'history.delete_yes': 'Yes, delete the record',
  'history.delete_cancel': 'Cancel',
  'history.deleted': 'The record was deleted.',
  'history.account_title': 'Your data',
  'history.account_intro':
    'You can delete your account with all its assessment records. This cannot be undone.',
  'history.delete_account': 'Delete my account',
  'history.delete_account_confirm':
    'Delete the account and all {count} records? This cannot be undone.',
  'history.delete_account_yes': 'Yes, delete the account',
  'history.account_deleted': 'The account and all its records were deleted.',
} as const

export type TranslationKey = keyof typeof en
