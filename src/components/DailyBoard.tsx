import { adjacentPuzzle } from '../lib/rank'
import type { RankedScore } from '../lib/rank'

type Props = {
  puzzles: number[]
  selected: number
  rows: RankedScore[]
  onSelect: (puzzle: number) => void
}

// One day's leaderboard as a table, with buttons to step between days.
export function DailyBoard({ puzzles, selected, rows, onSelect }: Props) {
  const previous = adjacentPuzzle(puzzles, selected, -1)
  const next = adjacentPuzzle(puzzles, selected, 1)

  return (
    <section>
      <h2>Krillion #{selected}</h2>
      <div className="puzzle-nav">
        <button
          type="button"
          disabled={previous === null}
          onClick={() => previous !== null && onSelect(previous)}
        >
          ← Previous
        </button>
        <button
          type="button"
          disabled={next === null}
          onClick={() => next !== null && onSelect(next)}
        >
          Next →
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
            <th>Tiles</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            // key lets React tell rows apart when the list changes.
            <tr key={row.name}>
              <td>{row.rank}</td>
              <td>{row.name}</td>
              <td>{row.score}</td>
              <td>{row.emojis.join('')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
