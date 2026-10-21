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

  /* --------------------------------------------------------- placeholder */
  'placeholder.assessment':
    'The questionnaire form (12 questions, validation, progress and the error summary) is ' +
    'implemented in task DIP-36.',
  'placeholder.report':
    'The risk report screen (both risks, the categories, the factor list and the ' +
    'disclaimer) is implemented in task DIP-37.',
  'placeholder.history':
    'The history and trend screen is implemented in task DIP-38.',

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
} as const

export type TranslationKey = keyof typeof en
