import { t } from '../i18n'
import type { RiskTarget } from '../api/types'
import { chartGeometry, chartMaxPercent, chartSummary, type TrendPoint } from '../risk/trend'

/**
 * The trend chart (FR-07).
 *
 * The chart is an inline SVG with no chart library: two lines (one per risk) over
 * the assessments, the oldest on the left. It is not the only representation of
 * the data — the table of the history below it contains the same values, and the
 * chart itself carries a text summary in its accessible name. The two lines are
 * distinguished by the line style (solid / dashed) and by the legend, not by the
 * colour alone (WCAG 1.4.1).
 */
export function TrendChart({ points }: { points: TrendPoint[] }) {
  if (points.length < 2) {
    return <p className="notice">{t('history.trend_hint')}</p>
  }

  const maxPercent = chartMaxPercent(points)
  const geometry = chartGeometry(points, maxPercent)
  const summary = chartSummary(points)

  return (
    <figure className="chart">
      <svg
        className="chart__canvas"
        viewBox={`0 0 ${geometry.width} ${geometry.height}`}
        role="img"
        aria-label={t('history.chart_label', { summary })}
      >
        {geometry.gridValues.map((value) => {
          const y = geometry.y(value / 100)
          return (
            <g key={value}>
              <line
                className="chart__grid"
                x1={geometry.padding.left}
                y1={y}
                x2={geometry.width - geometry.padding.right}
                y2={y}
              />
              <text
                className="chart__axis-label"
                x={geometry.padding.left - 8}
                y={y + 4}
                textAnchor="end"
              >
                {`${value} %`}
              </text>
            </g>
          )
        })}

        {points.map((point, index) => (
          <text
            key={point.id}
            className="chart__axis-label"
            x={geometry.x(index)}
            y={geometry.height - geometry.padding.bottom + 20}
            textAnchor="middle"
          >
            {point.label}
          </text>
        ))}

        <Series points={points} geometry={geometry} target="cvd" />
        <Series points={points} geometry={geometry} target="t2d" />
      </svg>

      <figcaption className="chart__legend">
        <span className="chart__legend-item">
          <svg className="chart__legend-sample" viewBox="0 0 40 10" aria-hidden="true">
            <line
              className="chart__line chart__line--cvd"
              x1="0"
              y1="5"
              x2="40"
              y2="5"
            />
          </svg>
          {t('history.legend_cvd')}
        </span>
        <span className="chart__legend-item">
          <svg className="chart__legend-sample" viewBox="0 0 40 10" aria-hidden="true">
            <line
              className="chart__line chart__line--t2d"
              x1="0"
              y1="5"
              x2="40"
              y2="5"
            />
          </svg>
          {t('history.legend_t2d')}
        </span>
      </figcaption>
    </figure>
  )
}

/** One line of the chart with the points of the assessments. */
function Series({
  points,
  geometry,
  target,
}: {
  points: TrendPoint[]
  geometry: ReturnType<typeof chartGeometry>
  target: RiskTarget
}) {
  const coordinates = points
    .map((point, index) => ({ point, x: geometry.x(index), y: geometry.y(point.values[target] ?? 0) }))
    .filter((entry) => entry.point.values[target] !== null)

  if (coordinates.length === 0) {
    return null
  }

  const path = coordinates.map((entry) => `${entry.x},${entry.y}`).join(' ')

  return (
    <g>
      <polyline className={`chart__line chart__line--${target}`} points={path} />
      {coordinates.map((entry) => (
        <circle
          key={entry.point.id}
          className={`chart__point chart__point--${target}`}
          cx={entry.x}
          cy={entry.y}
          r="4"
        />
      ))}
    </g>
  )
}
