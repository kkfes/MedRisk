import { HttpMedRiskApi } from './client'
import { MockMedRiskApi } from './mock'
import type { MedRiskApi } from './port'

export type { MedRiskApi } from './port'
export { ApiError, HttpMedRiskApi } from './client'
export { MockMedRiskApi, MOCK_DISCLAIMER } from './mock'
export type * from './types'

/**
 * Creates the adapter the application uses.
 *
 * The mode is read from the Vite environment variable `VITE_API_MODE`
 * (see `frontend/.env.example`):
 *
 *   `mock` (default) — the illustrative example adapter, no backend needed;
 *   `live`           — the HTTP client against `VITE_API_BASE_URL`.
 */
export function createApi(
  env: ImportMetaEnv = import.meta.env,
): MedRiskApi {
  const mode = env.VITE_API_MODE ?? 'mock'
  if (mode === 'live') {
    const baseUrl = env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'
    return new HttpMedRiskApi({ baseUrl })
  }
  return new MockMedRiskApi()
}
