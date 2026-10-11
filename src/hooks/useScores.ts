import { useEffect, useState } from 'react'
import { loadScores } from '../lib/loadScores'
import type { Score } from '../lib/types'

export type ScoresState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; scores: Score[] }

export function useScores(): ScoresState {
  const [state, setState] = useState<ScoresState>({ status: 'loading' })

  useEffect(() => {
    // If the component unmounts before the fetch resolves, we must not call
    // setState — React would warn and we would leak the stale response.
    let cancelled = false

    loadScores()
      .then((scores) => {
        if (!cancelled) setState({ status: 'ready', scores })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message = err instanceof Error ? err.message : String(err)
        setState({ status: 'error', message })
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
