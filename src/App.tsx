import { useState } from 'react'
import { AllTimeTable } from './components/AllTimeTable'
import { DailyBoard } from './components/DailyBoard'
import { LeaderBars } from './components/LeaderBars'
import { ScoreChart } from './components/ScoreChart'
import { SubmitScore } from './components/SubmitScore'
import { useScores } from './hooks/useScores'
import { allTime, dailyRanking, latestPuzzle, puzzleNumbers } from './lib/rank'

function plural(count: number, noun: string) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`
}

function App() {
  const { state, reload } = useScores()
  // null means "show the latest puzzle". Scores arrive after the first
  // render, so the latest can't be worked out when this state is created.
  const [selected, setSelected] = useState<number | null>(null)

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
  const puzzles = puzzleNumbers(scores)
  const puzzle = selected ?? latestPuzzle(scores)
  const players = allTime(scores)

  return (
    <main>
      <h1>Krillion Leaderboard</h1>
      <p className="summary">
        {plural(scores.length, 'score')} across {plural(puzzles.length, 'puzzle')}
      </p>
      <SubmitScore players={players.map((p) => p.name)} onSubmitted={reload} />
      {puzzle !== null && (
        <DailyBoard
          puzzles={puzzles}
          selected={puzzle}
          rows={dailyRanking(scores, puzzle)}
          onSelect={setSelected}
        />
      )}
      <AllTimeTable players={players} />
      <LeaderBars players={players} />
      <ScoreChart scores={scores} />
    </main>
  )
}

export default App
