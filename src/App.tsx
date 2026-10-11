import { AllTimeTable } from './components/AllTimeTable'
import { DailyBoard } from './components/DailyBoard'
import { LeaderBars } from './components/LeaderBars'
import { ScoreChart } from './components/ScoreChart'
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
      <SubmitScore players={players.map((p) => p.name)} onSubmitted={reload} />
      {latest !== null && (
        <DailyBoard puzzle={latest} rows={dailyRanking(scores, latest)} />
      )}
      <AllTimeTable players={players} />
      <LeaderBars players={players} />
      <ScoreChart scores={scores} />
    </main>
  )
}

export default App