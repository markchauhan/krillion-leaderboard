import { splitEmojis } from './parseShare'
import { dedupe } from './rank'
import { supabase } from './supabase'
import type { Score } from './types'

// A row as the database returns it: tiles are one string, not an array.
type Row = { puzzle: number; name: string; score: number; emojis: string }

// Fetches every score and converts it to the app's Score shape.
export async function loadScores(): Promise<Score[]> {
  const { data, error } = await supabase
    .from('scores')
    .select('puzzle, name, score, emojis')

  if (error) throw new Error(error.message)

  const rows = data as Row[]
  return dedupe(rows.map((row) => ({ ...row, emojis: splitEmojis(row.emojis) })))
}