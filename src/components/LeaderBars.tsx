import { useState } from 'react'
import type { CSSProperties } from 'react'
import type { PlayerStats } from '../lib/rank'

type Props = {
  players: PlayerStats[]
}

type Metric = 'average' | 'best' | 'wins' | 'games'

const METRICS: { key: Metric; label: string }[] = [
  { key: 'average', label: 'Average' },
  { key: 'best', label: 'Best' },
  { key: 'wins', label: 'Wins' },
  { key: 'games', label: 'Games' },
]

// All-time stats as horizontal bars, one row per player.
export function LeaderBars({ players }: Props) {
  const [metric, setMetric] = useState<Metric>('average')

  if (players.length === 0) return null

  // Ties break by name so equal rows don't swap places between renders.
  const rows = [...players].sort(
    (a, b) => b[metric] - a[metric] || a.name.localeCompare(b.name),
  )

  // Everyone can have zero wins; a max of 0 would divide by zero below.
  const max = Math.max(...rows.map((p) => p[metric])) || 1

  const format = (value: number) =>
    metric === 'average' ? value.toFixed(1) : String(value)

  return (
    <section className="leader-bars">
      <h2>Leaderboard</h2>

      <div className="legend">
        {METRICS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            aria-pressed={metric === key}
            onClick={() => setMetric(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <ol>
        {rows.map((p) => (
          <li key={p.name}>
            <span className="name">{p.name}</span>
            {/* The stylesheet turns --fraction into a width, so the layout
                maths lives in one place alongside the value column's size. */}
            <span
              className="bar"
              style={{ '--fraction': p[metric] / max } as CSSProperties}
            />
            <span className="value">{format(p[metric])}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
