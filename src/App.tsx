import { DailyBoard } from './components/DailyBoard'
import { AllTimeTable } from './components/AllTimeTable'
import { allTime, dailyRanking, latestPuzzle } from './lib/rank'
import { useScores } from './hooks/useScores'

function App() {
  const state = useScores()

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

  return (
    <main>
      <h1>Krillion Leaderboard</h1>
      {latest !== null && (
        <DailyBoard puzzle={latest} rows={dailyRanking(scores, latest)} />
      )}
      <AllTimeTable players={allTime(scores)} />
    </main>
  )
}

export default App
