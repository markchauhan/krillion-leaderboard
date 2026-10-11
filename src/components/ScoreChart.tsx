import { useState } from 'react'
import type { Score } from '../lib/types'

type Props = {
  scores: Score[]
}

const WIDTH = 640
const HEIGHT = 280
const PAD = { top: 12, right: 16, bottom: 28, left: 40 }
const SERIES_SLOTS = 8

// Each player's score by puzzle, one line per player.
export function ScoreChart({ scores }: Props) {
  const [active, setActive] = useState<string | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  if (scores.length === 0) return null

  const puzzles = [...new Set(scores.map((s) => s.puzzle))].sort((a, b) => a - b)

  // Players in order of first appearance. New players are appended, so
  // nobody's color changes when someone joins.
  const names = [
    ...new Set(
      [...scores]
        .sort((a, b) => a.puzzle - b.puzzle || a.name.localeCompare(b.name))
        .map((s) => s.name),
    ),
  ]

  const first = puzzles[0]
  const last = puzzles[puzzles.length - 1]
  // Round the top of the axis up to the next hundred.
  const top = Math.ceil(Math.max(...scores.map((s) => s.score)) / 100) * 100 || 100

  // Scales: convert a data value into a pixel position.
  const x = (puzzle: number) =>
    PAD.left +
    (last === first ? 0.5 : (puzzle - first) / (last - first)) *
      (WIDTH - PAD.left - PAD.right)
  const y = (score: number) =>
    HEIGHT - PAD.bottom - (score / top) * (HEIGHT - PAD.top - PAD.bottom)

  const color = (name: string) => {
    const slot = names.indexOf(name)
    return slot < SERIES_SLOTS ? `var(--series-${slot + 1})` : 'var(--muted)'
  }

  const series = names.map((name) => {
    const points = scores
      .filter((s) => s.name === name)
      .sort((a, b) => a.puzzle - b.puzzle)

    // "M" lifts the pen; "C" draws a curve. Lifting whenever a player
    // skipped a puzzle leaves a gap instead of a line through missed days.
    const path = points
      .map((s, i) => {
        const px = x(s.puzzle)
        const py = y(s.score)
        const prev = points[i - 1]
        const connected =
          i > 0 && puzzles.indexOf(s.puzzle) - puzzles.indexOf(prev.puzzle) === 1

        if (!connected) return `M${px.toFixed(1)},${py.toFixed(1)}`

        // Both control points sit at the horizontal midpoint, one at each
        // end's height. The curve leaves and arrives flat, so it never
        // overshoots above or below the real scores.
        const mid = ((x(prev.puzzle) + px) / 2).toFixed(1)
        return `C${mid},${y(prev.score).toFixed(1)} ${mid},${py.toFixed(1)} ${px.toFixed(1)},${py.toFixed(1)}`
      })
      .join('')

    return { name, points, path }
  })

  const ticks = Array.from({ length: top / 100 + 1 }, (_, i) => i * 100)
  const labelEvery = Math.max(1, Math.ceil(puzzles.length / 6))
  const columnWidth = (WIDTH - PAD.left - PAD.right) / Math.max(1, last - first)
  const readout =
    hovered === null
      ? []
      : scores.filter((s) => s.puzzle === hovered).sort((a, b) => b.score - a.score)

  return (
    <section className="chart">
      <h2>Scores over time</h2>

      <div className="legend">
        {names.map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={active === name}
            onClick={() => setActive(active === name ? null : name)}
          >
            <span className="swatch" style={{ background: color(name) }} />
            {name}
          </button>
        ))}
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="Line chart of each player's score by puzzle"
        onPointerLeave={() => setHovered(null)}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line className="grid" x1={PAD.left} x2={WIDTH - PAD.right} y1={y(t)} y2={y(t)} />
            <text className="axis" x={PAD.left - 8} y={y(t)} textAnchor="end" dominantBaseline="middle">
              {t}
            </text>
          </g>
        ))}

        {puzzles
          .filter((_, i) => i % labelEvery === 0)
          .map((p) => (
            <text key={p} className="axis" x={x(p)} y={HEIGHT - 8} textAnchor="middle">
              #{p}
            </text>
          ))}

        {hovered !== null && (
          <line
            className="crosshair"
            x1={x(hovered)}
            x2={x(hovered)}
            y1={PAD.top}
            y2={HEIGHT - PAD.bottom}
          />
        )}

        {series.map(({ name, points, path }) => (
          <g key={name} opacity={active === null || active === name ? 1 : 0.15}>
            <path
              d={path}
              fill="none"
              stroke={color(name)}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {points.map((s) => (
              <circle
                key={s.puzzle}
                className="dot"
                cx={x(s.puzzle)}
                cy={y(s.score)}
                r={hovered === s.puzzle ? 5 : 3}
                fill={color(name)}
              />
            ))}
          </g>
        ))}

        {/* Invisible full-height columns, so you don't have to hit a tiny dot. */}
        {puzzles.map((p) => (
          <rect
            key={p}
            x={x(p) - columnWidth / 2}
            y={PAD.top}
            width={columnWidth}
            height={HEIGHT - PAD.top - PAD.bottom}
            fill="transparent"
            onPointerEnter={() => setHovered(p)}
            onClick={() => setHovered(p)}
          />
        ))}
      </svg>

      <p className="readout">
        {hovered === null ? (
          'Hover or tap the chart to see that day’s scores.'
        ) : (
          <>
            <strong>#{hovered}</strong>
            {readout.map((s) => (
              <span key={s.name}>
                <span className="swatch" style={{ background: color(s.name) }} />
                {s.name} {s.score}
              </span>
            ))}
          </>
        )}
      </p>
    </section>
  )
}