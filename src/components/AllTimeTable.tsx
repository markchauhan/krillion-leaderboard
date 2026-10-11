import type { PlayerStats } from '../lib/rank'

type Props = {
  players: PlayerStats[]
}

// Every player's stats across all puzzles.
export function AllTimeTable({ players }: Props) {
  // An empty table with only headers looks broken, so say why it's empty.
  if (players.length === 0) {
    return <p>No scores yet.</p>
  }

  return (
    <section>
      <h2>All time</h2>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Games</th>
            <th>Average</th>
            <th>Best</th>
            <th>Total</th>
            <th>Wins</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p.name}>
              <td>{p.name}</td>
              <td>{p.games}</td>
              <td>{p.average.toFixed(1)}</td>
              <td>{p.best}</td>
              <td>{p.total}</td>
              <td>{p.wins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}