import { DailyBoard } from './components/DailyBoard'
import { AllTimeTable } from './components/AllTimeTable'
import { allTime, dailyRanking } from './lib/rank'
import type { Score } from './lib/types'

// Placeholder data until scores load from the database.
const sample: Score[] = [
  { puzzle: 86, name: 'Flash', score: 215, emojis: ['🫧', '⬛', '🐟', '🦑', '🏮', '🐟', '⬛'] },
  { puzzle: 86, name: 'Aquaman', score: 360, emojis: ['🏮', '🐟', '🫧', '🐟', '🦑', '🏮', '🦑'] },
  { puzzle: 86, name: 'Batman', score: 240, emojis: ['🦑', '🫧', '🦑', '🐟', '🫧', '🫧', '🦑'] },
  { puzzle: 86, name: 'Cyborg', score: 240, emojis: ['🐟', '🐟', '🐟', '🐟', '🦑', '🐟', '🐟'] },
]

function App() {
  return (
    <main>
      <h1>Krillion Leaderboard</h1>
      <DailyBoard puzzle={86} rows={dailyRanking(sample, 86)} />
      <AllTimeTable players={allTime(sample)} />
    </main>
  )
}

export default App