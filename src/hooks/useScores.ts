import { useCallback, useEffect, useState } from 'react'
import { loadScores } from '../lib/loadScores'
import type { Score } from '../lib/types'

export type ScoresState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; scores: Score[] }

// Loads scores when the page opens, and again whenever reload() is called.
export function useScores() {
  const [state, setState] = useState<ScoresState>({ status: 'loading' })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    // If the component goes away before the request finishes,
    // skip the update instead of writing to something that's gone.
    let cancelled = false

    loadScores()
      .then((scores) => {
        if (!cancelled) setState({ status: 'ready', scores })
      })
      .catch((e: unknown) => {
        const message = e instanceof Error ? e.message : 'Unknown error'
        if (!cancelled) setState({ status: 'error', message })
      })

    return () => {
      cancelled = true
    }
  }, [version])

  const reload = useCallback(() => setVersion((v) => v + 1), [])

  return { state, reload }
}