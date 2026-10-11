import type { RankedScore } from '../lib/rank'

type Props = {
  puzzle: number
  rows: RankedScore[]
}

// One day's leaderboard as a table.
export function DailyBoard({ puzzle, rows }: Props) {
  return (
    <section>
      <h2>Krillion #{puzzle}</h2>
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