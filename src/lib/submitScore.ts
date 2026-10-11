import { supabase } from './supabase'
import type { Score } from './types'

// Saves one score. Returns null on success, or a message to show the user.
export async function submitScore(score: Score): Promise<string | null> {
  const { error } = await supabase.from('scores').insert({
    puzzle: score.puzzle,
    name: score.name,
    score: score.score,
    // The table stores tiles as one string.
    emojis: score.emojis.join(''),
  })

  if (!error) return null
  // 23505 is Postgres's code for a primary key conflict.
  if (error.code === '23505') {
    return `${score.name} already has a score for #${score.puzzle}`
  }
  return error.message
}