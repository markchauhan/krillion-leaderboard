import type { ParseResult } from './types'

const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

export function parseShare(text: string, name: string): ParseResult {
  const player = name.trim()
  if (player === '') {
    return { ok: false, error: 'Enter a player name' }
  }

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== '')

  if (lines.length < 3) {
    return { ok: false, error: 'Expected a title, a score, and an emoji row' }
  }

  const title = lines[0].match(/^Krillion #(\d+)/)
  if (!title) {
    return { ok: false, error: 'First line should look like "Krillion #86"' }
  }

  if (!/^\d+$/.test(lines[1])) {
    return { ok: false, error: 'Second line should be the score' }
  }

  const emojis = [...segmenter.segment(lines[2])]
    .map((part) => part.segment)
    .filter((part) => part.trim() !== '')

  if (emojis.length !== 7) {
    return { ok: false, error: `Expected 7 emoji, found ${emojis.length}` }
  }

  return {
    ok: true,
    value: {
      puzzle: Number(title[1]),
      name: player,
      score: Number(lines[1]),
      emojis,
    },
  }
}

// Splits a tile row into whole emoji. An emoji can span several code
export function splitEmojis(row: string): string[] {
  return [...segmenter.segment(row)]
    .map((part) => part.segment)
    .filter((part) => part.trim() !== '')
}
