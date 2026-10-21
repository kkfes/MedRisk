import { en } from './en'
import type { TranslationKey } from './en'

export type { TranslationKey } from './en'

/**
 * The available locales (FR-12). English is the only one in version 1 —
 * Russian and Kazakh are planned and need a new dictionary plus a language
 * switcher, but no change in the components.
 */
export const dictionaries = { en } as const

export type Locale = keyof typeof dictionaries

export const DEFAULT_LOCALE: Locale = 'en'

/**
 * Translates a key of the given locale. Placeholders of the form `{name}` are
 * replaced by the given values.
 */
export function translate(
  locale: Locale,
  key: TranslationKey,
  values?: Record<string, string | number>,
): string {
  const template: string = dictionaries[locale][key]
  if (!values) {
    return template
  }
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in values ? String(values[name]) : match,
  )
}

/** Translates a key in the default locale. */
export function t(key: TranslationKey, values?: Record<string, string | number>): string {
  return translate(DEFAULT_LOCALE, key, values)
}
