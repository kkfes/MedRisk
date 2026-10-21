import type { AssessmentSummary, RiskTarget } from '../api/types'

/**
 * The data of the trend chart (FR-07).
 *
 * The functions here are pure: they prepare the points of the chart from the
 * list of the assessments and can therefore be tested without a browser.
 */

/** One point of the trend: one assessment with its date and its two risks. */
export interface TrendPoint {
  id: string
  /** The date of the assessment, as `YYYY-MM-DD`. */
  date: string
  /** The label of the point on the axis. */
  label: string
  /** The probability of each risk, or `null` if the risk is not in the record. */
  values: Record<RiskTarget, number | null>
}

function probabilityOf(
  assessment: AssessmentSummary,
  target: RiskTarget,
): number | null {
  const risk = assessment.risks.find((entry) => entry.target === target)
  return risk ? risk.probability : null
}

/** The date of an assessment as `YYYY-MM-DD` — unambiguous and locale-independent. */
export function formatDate(isoDate: string): string {
  return isoDate.slice(0, 10)
}

/**
 * The points of the trend, the oldest assessment first.
 *
 * The API returns the assessments with the newest first (FR-06); a trend chart
 * needs them the other way round.
 */
export function buildTrendPoints(assessments: AssessmentSummary[]): TrendPoint[] {
  return [...assessments]
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map((assessment) => ({
      id: assessment.id,
      date: formatDate(assessment.created_at),
      label: formatDate(assessment.created_at),
      values: {
        cvd: probabilityOf(assessment, 'cvd'),
        t2d: probabilityOf(assessment, 't2d'),
      },
    }))
}

/** The largest probability of the chart, in percent, rounded up to a step of 10. */
export function chartMaxPercent(points: TrendPoint[]): number {
  const largest = points.reduce((max, point) => {
    const values = Object.values(point.values).filter((value): value is number => value !== null)
    return Math.max(max, ...values)
  }, 0)
  const percent = Math.ceil(largest * 100 / 10) * 10
  return Math.max(10, percent)
}

/** The geometry of the chart. */
export interface ChartGeometry {
  width: number
  height: number
  padding: { top: number; right: number; bottom: number; left: number }
  innerWidth: number
  innerHeight: number
  /** The horizontal position of a point. */
  x: (index: number) => number
  /** The vertical position of a probability. */
  y: (probability: number) => number
  /** The labels of the horizontal grid lines, from the top to the bottom. */
  gridValues: number[]
}

/** Builds the geometry of the chart for the given points. */
export function chartGeometry(points: TrendPoint[], maxPercent: number): ChartGeometry {
  const width = 640
  const height = 240
  const padding = { top: 16, right: 16, bottom: 44, left: 48 }
  const innerWidth = width - padding.left - padding.right
  const innerHeight = height - padding.top - padding.bottom
  const steps = Math.max(2, Math.round(maxPercent / 10))

  return {
    width,
    height,
    padding,
    innerWidth,
    innerHeight,
    x: (index: number) =>
      points.length <= 1
        ? padding.left + innerWidth / 2
        : padding.left + (index * innerWidth) / (points.length - 1),
    y: (probability: number) =>
      padding.top + innerHeight * (1 - (probability * 100) / maxPercent),
    gridValues: Array.from({ length: steps + 1 }, (_, index) => (maxPercent / steps) * (steps - index)),
  }
}

/**
 * The summary of the chart for the accessible name of the image.
 *
 * It names the direction of the trend — the only thing the chart says that the
 * table below it does not say.
 */
export function chartSummary(points: TrendPoint[]): string {
  const first = points[0]
  const last = points[points.length - 1]
  if (!first || !last) {
    return ''
  }
  const parts: string[] = []
  for (const target of ['cvd', 't2d'] as RiskTarget[]) {
    const from = first.values[target]
    const to = last.values[target]
    if (from === null || to === null) {
      continue
    }
    const direction = to > from ? 'rose' : to < from ? 'fell' : 'stayed the same'
    parts.push(
      `the ${target === 'cvd' ? 'cardiovascular' : 'type 2 diabetes'} risk ${direction} ` +
        `from ${Math.round(from * 100)} % to ${Math.round(to * 100)} %`,
    )
  }
  return `${parts.join(', ')} between ${first.label} and ${last.label}.`
}
