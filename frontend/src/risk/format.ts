import type { RiskCategory, RiskEstimate, RiskTarget } from '../api/types'
import type { TranslationKey } from '../i18n'

/**
 * The formatting of the risk result (FR-03, FR-04).
 *
 * The rules of the design system (DIP-19) are applied here: a risk level is
 * always a symbol **and** a text label, and the direction of a factor is a word
 * and a symbol — never a colour alone.
 */

/** The symbol of every risk level (design-system.md §2.3). */
export const RISK_SYMBOLS: Record<RiskCategory, string> = {
  low: '●',
  moderate: '◆',
  high: '▲',
  very_high: '■',
}

/** The modifier of the badge class of every risk level. */
export const RISK_BADGE_CLASSES: Record<RiskCategory, string> = {
  low: 'risk-badge--low',
  moderate: 'risk-badge--moderate',
  high: 'risk-badge--high',
  very_high: 'risk-badge--very-high',
}

/** The text label of every risk level (design-system.md §2.3). */
export const RISK_CATEGORY_LABELS: Record<RiskCategory, TranslationKey> = {
  low: 'risk_category.low',
  moderate: 'risk_category.moderate',
  high: 'risk_category.high',
  very_high: 'risk_category.very_high',
}

/** The symbol of the direction of a factor. */
export const DIRECTION_SYMBOLS = {
  increases: '▲',
  decreases: '▼',
} as const

/** The title of a risk target. */
export const RISK_TARGET_TITLES: Record<RiskTarget, string> = {
  cvd: 'Cardiovascular disease · 10 years',
  t2d: 'Type 2 diabetes · 10 years',
}

/** Formats a probability of 0…1 as a percentage with one decimal-free integer. */
export function formatProbability(probability: number): string {
  const percent = probability * 100
  const rounded = Math.round(percent * 10) / 10
  return `${rounded} %`
}

/**
 * The share of a contribution in the largest contribution of the same result,
 * as a whole number between 0 and 100.
 */
export function shareOfLargest(contribution: number, largest: number): number {
  if (largest <= 0) {
    return 0
  }
  return Math.round((contribution / largest) * 100)
}

/**
 * Sorts the factors by their contribution, the largest first (FR-04).
 * The copy is sorted, the array of the API stays untouched.
 */
export function sortFactorsByContribution<T extends { contribution: number }>(factors: T[]): T[] {
  return [...factors].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
}

/** The largest absolute contribution of a list of factors. */
export function largestContribution(factors: Array<{ contribution: number }>): number {
  return factors.reduce((max, factor) => Math.max(max, Math.abs(factor.contribution)), 0)
}

/** Finds the estimate of a risk target. */
export function estimateFor(
  risks: RiskEstimate[],
  target: RiskTarget,
): RiskEstimate | undefined {
  return risks.find((risk) => risk.target === target)
}
