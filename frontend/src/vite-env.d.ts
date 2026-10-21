/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** `mock` (illustrative example data) or `live` (HTTP client). */
  readonly VITE_API_MODE?: 'mock' | 'live'
  /** Base URL of the MedRisk REST API, used when VITE_API_MODE is `live`. */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
