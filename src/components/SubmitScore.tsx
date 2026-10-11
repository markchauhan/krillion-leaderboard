import { useState } from 'react'
import { parseShare } from '../lib/parseShare'
import { submitScore } from '../lib/submitScore'

type Props = {
  players: string[]
  onSubmitted: () => void
}

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'error'; message: string }
  | { kind: 'done'; message: string }

// Paste box: parses the share text as you type, then saves it.
export function SubmitScore({ players, onSubmitted }: Props) {
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  // Derived on every render from the two inputs, so it can never be stale.
  const parsed = text.trim() === '' ? null : parseShare(text, name.toUpperCase())

  async function handleSubmit() {
    if (!parsed?.ok) return
    setStatus({ kind: 'sending' })
    const error = await submitScore(parsed.value)
    if (error) {
      setStatus({ kind: 'error', message: error })
      return
    }
    setStatus({
      kind: 'done',
      message: `Saved ${parsed.value.name}: ${parsed.value.score} on #${parsed.value.puzzle}`,
    })
    setText('')
    onSubmitted()
  }

  return (
    <section className="submit">
      <h2>Add a score</h2>

      <label htmlFor="player">Initial</label>
      <input
        id="player"
        list="players"
        maxLength={30}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <datalist id="players">
        {players.map((p) => (
          <option key={p} value={p} />
        ))}
      </datalist>

      <label htmlFor="share">Paste your result</label>
      <textarea
        id="share"
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {parsed?.ok && (
        <p>
          #{parsed.value.puzzle} · {parsed.value.name} · {parsed.value.score} ·{' '}
          {parsed.value.emojis.join('')}
        </p>
      )}
      {parsed && !parsed.ok && <p className="error">{parsed.error}</p>}
      {status.kind === 'error' && <p className="error">{status.message}</p>}
      {status.kind === 'done' && <p>{status.message}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!parsed?.ok || status.kind === 'sending'}
      >
        {status.kind === 'sending' ? 'Saving…' : 'Submit score'}
      </button>
    </section>
  )
}