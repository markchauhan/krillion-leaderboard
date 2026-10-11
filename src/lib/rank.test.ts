import { describe, expect, it } from 'vitest'
import type { Score } from './types'
import { dailyRanking, latestPuzzle } from './rank'

function score(puzzle: number, name: string, points: number): Score {
  return { puzzle, name, score: points, emojis: [] }
}

const scores: Score[] = [
  score(86, 'Flash', 215),
  score(86, 'Aquaman', 360),
  score(85, 'Aquaman', 300),
  score(86, 'Batman', 240),
  score(86, 'Cyborg', 240),
]

describe('dailyRanking', () => {
  it('returns one puzzle sorted highest first', () => {
    const names = dailyRanking(scores, 86).map((s) => s.name)
    expect(names).toEqual(['Aquaman', 'Batman', 'Cyborg', 'Flash'])
  })

  it('returns an empty list for a puzzle nobody played', () => {
    expect(dailyRanking(scores, 99)).toEqual([])
  })

  it('does not reorder the input', () => {
    dailyRanking(scores, 86)
    expect(scores[0].name).toBe('Flash')
  })

   it('gives tied scores the same rank and skips the next', () => {
    const ranks = dailyRanking(scores, 86).map((s) => s.rank)
    expect(ranks).toEqual([1, 2, 2, 4])
  })
})

describe('latestPuzzle', () => {
  it('returns the highest puzzle number', () => {
    expect(latestPuzzle(scores)).toBe(86)
  })

  it('returns null when there are no scores', () => {
    expect(latestPuzzle([])).toBeNull()
  })
})