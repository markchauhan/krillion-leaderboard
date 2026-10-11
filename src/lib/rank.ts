import type { Score } from './types'

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