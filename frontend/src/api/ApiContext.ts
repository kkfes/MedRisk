import { createContext, useContext } from 'react'
import type { MedRiskApi } from './port'

/**
 * The adapter the components read from. It is provided once by the application
 * shell, so that no component has to know whether the data comes from the mock
 * adapter or from the HTTP client.
 */
export const ApiContext = createContext<MedRiskApi | null>(null)

/** Returns the API adapter of the current application. */
export function useApi(): MedRiskApi {
  const api = useContext(ApiContext)
  if (!api) {
    throw new Error(
      'No API adapter found. The component tree has to be wrapped in an <ApiContext.Provider>.',
    )
  }
  return api
}
