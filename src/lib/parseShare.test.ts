import { describe, it, expect } from 'vitest'
import { parseShare } from './parseShare'

const clean = 'Krillion #86 🦐\n360\n\n🏮🐟🫧🐟🦑🏮🦑'

describe('parseShare', () => {
  it('parses a clean paste', () => {
    expect(parseShare(clean, 'Mark')).toEqual({
      ok: true,
      value: {
        puzzle: 86,
        name: 'Mark',
        score: 360,
        emojis: ['🏮', '🐟', '🫧', '🐟', '🦑', '🏮', '🦑'],
      },
    })
  })

  it('tolerates extra whitespace and blank lines', () => {
    const messy = '\n\n  Krillion #86 🦐  \r\n 360 \n\n\n 🏮🐟🫧🐟🦑🏮🦑 \n'
    expect(parseShare(messy, '  Mark ')).toMatchObject({
      ok: true,
      value: { puzzle: 86, name: 'Mark', score: 360 },
    })
  })

  it('rejects a different game', () => {
    const result = parseShare('Wordle 1,234 4/6\n360\n🏮🐟🫧🐟🦑🏮🦑', 'Mark')
    expect(result.ok).toBe(false)
  })

  it('rejects an empty name', () => {
    expect(parseShare(clean, '   ')).toEqual({
      ok: false,
      error: 'Enter a player name',
    })
  })

  it('rejects a paste with no score line', () => {
    expect(parseShare('Krillion #86 🦐\n\n🏮🐟🫧🐟🦑🏮🦑', 'Mark')).toEqual({
      ok: false,
      error: 'Expected a title, a score, and an emoji row',
    })
  })

  it('rejects a score that is not a number', () => {
    expect(parseShare('Krillion #86 🦐\nabc\n🏮🐟🫧🐟🦑🏮🦑', 'Mark')).toEqual({
      ok: false,
      error: 'Second line should be the score',
    })
  })

  it('rejects an emoji row that is not 7 long', () => {
    expect(parseShare('Krillion #86 🦐\n360\n🏮🐟🫧🐟🦑🏮', 'Mark')).toEqual({
      ok: false,
      error: 'Expected 7 emoji, found 6',
    })
  })
})
