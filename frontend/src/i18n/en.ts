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
} as const

export type TranslationKey = keyof typeof en
