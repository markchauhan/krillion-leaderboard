import type { Score } from './types'

// A score plus its position in one day's ranking.
export type RankedScore = Score & { rank: number }


export function dailyRanking(scores: Score[], puzzle: number): RankedScore[] {

  const sorted = scores
    .filter((s) => s.puzzle === puzzle)
    .sort((a, b) => b.score - a.score)

  return sorted.map((s) => ({
    ...s,
    rank: sorted.findIndex((other) => other.score === s.score) + 1,
  }))
}

export function latestPuzzle(scores: Score[]): number | null {
  if (scores.length === 0) return null
  return Math.max(...scores.map((s) => s.puzzle))
}

export const VOLATILITY_WEIGHT = 0.5
export const MIN_GAMES = 5

export type PlayerStats = {
  name: string
  games: number
  total: number
  average: number
  // Standard deviation of their scores. Lower means more consistent.
  spread: number
  // Average minus a penalty for volatility. The table sorts by this.
  rating: number
  best: number
  wins: number
  ranked: boolean
}

// Every player's all-time stats: ranked players first, best rating first.
export function allTime(scores: Score[], minGames = MIN_GAMES): PlayerStats[] {
  // Group each player's scores together.
  const byPlayer = new Map<string, Score[]>()
  for (const s of scores) {
    const played = byPlayer.get(s.name) ?? []
    played.push(s)
    byPlayer.set(s.name, played)
  }

  // The winning score for each puzzle, used to count wins below.
  const topScore = new Map<number, number>()
  for (const s of scores) {
    topScore.set(s.puzzle, Math.max(topScore.get(s.puzzle) ?? 0, s.score))
  }

  return [...byPlayer.entries()]
    .map(([name, played]) => {
      const total = played.reduce((sum, s) => sum + s.score, 0)
      const average = total / played.length
      // Variance is the mean squared distance from the average;
      // its square root puts spread back in score units.
      const variance =
        played.reduce((sum, s) => sum + (s.score - average) ** 2, 0) / played.length
      const spread = Math.sqrt(variance)

      return {
        name,
        games: played.length,
        total,
        average,
        spread,
        rating: average - VOLATILITY_WEIGHT * spread,
        best: Math.max(...played.map((s) => s.score)),
        // A tie for first counts as a win for everyone tied.
        wins: played.filter((s) => s.score === topScore.get(s.puzzle)).length,
        ranked: played.length >= minGames,
      }
    })
    .sort((a, b) => Number(b.ranked) - Number(a.ranked) || b.rating - a.rating)
}

// Collapses duplicates so each player has one score per puzzle.
export function dedupe(scores: Score[]): Score[] {
  const spelling = new Map<string, string>()
  const latest = new Map<string, Score>()

  for (const s of scores) {
    const key = s.name.trim().toLowerCase()
    const name = spelling.get(key) ?? s.name.trim()
    spelling.set(key, name)
    latest.set(`${s.puzzle}:${key}`, { ...s, name })
  }

  return [...latest.values()]
}