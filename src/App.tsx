import { AllTimeTable } from './components/AllTimeTable'
import { DailyBoard } from './components/DailyBoard'
import { SubmitScore } from './components/SubmitScore'
import { useScores } from './hooks/useScores'
import { allTime, dailyRanking, latestPuzzle } from './lib/rank'

function App() {
  const { state, reload } = useScores()

  if (state.status === 'loading') {
    return (
      <main>
        <h1>Krillion Leaderboard</h1>
        <p>Loading scores…</p>
      </main>
    )
  }

  if (state.status === 'error') {
    return (
      <main>
        <h1>Krillion Leaderboard</h1>
        <p>Could not load scores: {state.message}</p>
      </main>
    )
  }

  const { scores } = state
  const latest = latestPuzzle(scores)
  const players = allTime(scores)

  return (
    <main>
      <h1>Krillion Leaderboard</h1>
      {latest !== null && (
        <DailyBoard puzzle={latest} rows={dailyRanking(scores, latest)} />
      )}
      <AllTimeTable players={players} />
      <SubmitScore players={players.map((p) => p.name)} onSubmitted={reload} />
    </main>
  )
}

export default App