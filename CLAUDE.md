# Krillion Leaderboard

A leaderboard for Mark's friend group's daily Krillion scores. Personal project, built to learn front-end development.

## How to work with Mark

- Mark is a C / low-latency systems engineer who is new to React and TypeScript. He is building this to learn.
- **Teach as you go.** Before each step, explain what the piece is and why it exists. C analogies land well (struct, header, Makefile target, -Wall).
- **He types the real code himself.** Describe what to write and show a small pattern example; let him write it, then review what he pastes. Boilerplate and config he is happy to have written for him.
- When you give a snippet to add, show **only the new lines** and say where they go. Showing neighbouring lines for context has caused duplicate-paste mistakes twice.
- Keep steps small, one at a time, each with a way to verify it worked.
- For bulk or mechanical edits, just do them.

## Stack

- Vite 8, React 19, TypeScript 6 (strict), Vitest 5, ESLint
- Node 26 via Homebrew (`/opt/homebrew/bin/node`)
- Hosting: GitHub Pages at `markchauhan.github.io/krillion-leaderboard`, deployed by GitHub Actions
- Data: Supabase (hosted Postgres, free tier) so scores can be submitted from the page. Mark was leaning this way but has not created the project yet; confirm before building on it. Fallback is `public/scores.csv` plus manual commits.
- Everything must stay on free tiers.

## Design

- `src/lib/` holds pure TypeScript with tests; components stay thin.
- `Score` type: `puzzle: number`, `name: string`, `score: number`, `emojis: string[]`
- Parsers return a result type (`{ ok: true; value } | { ok: false; error }`), they do not throw.
- Split emoji with `Intl.Segmenter` (grapheme), never `split("")`.
- One row per `(puzzle, name)`; names match case-insensitively.
- Ties share a rank (240, 240 are both 2nd; next is 4th). Higher score is assumed better.
- With Supabase: row-level security is required, since the anon key is public. Inserts gated by a shared passcode.

### Share text format

```
Krillion #86 🦐
360

🏮🐟🫧🐟🦑🏮🦑
```

Line 1 puzzle number, line 2 score, blank line, 7 emoji. The player's name is not included and must be supplied separately.

### Seed data (puzzle 86)

```csv
puzzle,name,score,emojis
86,Mark,360,🏮🐟🫧🐟🦑🏮🦑
86,Joshua,240,🦑🫧🦑🐟🫧🫧🦑
86,Rachel,240,🐟🐟🐟🐟🦑🐟🐟
86,Katia,215,🫧⬛🐟🦑🏮🐟⬛
86,UNKNOWN,205,🏮⬛🫧🦑🫧🐟🫧
```

The fifth player's name is unknown; ask Mark.

## Milestones

Keep this checklist current. Tick an item only after verifying it in the repo (file exists, test passes, command works), not because it was discussed.

### 0. Setup
- [x] Scaffold with Vite react-ts template
- [x] Install Vitest, add `"test": "vitest"` script
- [x] `"strict": true` in `tsconfig.app.json` (no duplicated `noUnusedLocals`)
- [ ] Demo cleared: `App.css` and `src/assets/` deleted and `index.css` emptied ✓, but `App.tsx` still has stale `useState`/`heroImg`/`reactLogo`/`viteLogo`/`./App.css` imports — build fails on TS6133
- [x] `<title>` changed in `index.html` (set to "krillion-leaderboard")
- [ ] GitHub repo `krillion-leaderboard` created (public, empty)
- [ ] First commit pushed to `main` (directory is not a git repo yet)

### 1. Data model
- [ ] `src/lib/types.ts` with `Score` and the parse result type
- [ ] Seed data in place (CSV or Supabase table)

### 2. Share-text parser
- [ ] `parseShare(text, name)` in `src/lib/parseShare.ts`
- [ ] Tests: clean paste, extra whitespace, missing score, wrong game, emoji row not 7 long, empty name

### 3. Ranking logic
- [ ] `dailyRanking`, `allTime`, `latestPuzzle` in `src/lib/rank.ts`
- [ ] Dedupe and name normalisation
- [ ] Tests: ties, missed day, single player, empty list

### 4. Leaderboard UI
- [ ] `useScores()` hook with loading / error / empty states
- [ ] `DailyBoard` with previous/next puzzle
- [ ] `AllTimeTable` with sortable columns
- [ ] Works at phone width

### 5. Submit from the page
- [ ] Supabase project, `scores` table, RLS policies
- [ ] Paste box with live parse preview and specific errors
- [ ] Submit button writes to the table; duplicate warning

### 6. Deploy
- [ ] `base: "/krillion-leaderboard/"` in `vite.config.ts`
- [ ] `.github/workflows/deploy.yml` (test, build, deploy to Pages)
- [ ] Live URL loads with data

### 7. Chart
- [ ] Score by puzzle, one line per player, gaps for missed days

### 8. Polish
- [ ] README with screenshot and live link
- [ ] Minimum-games threshold on average ranking
- [ ] Streaks

## When Mark asks for a progress report

He pastes this into a separate Claude chat that holds the project plan, so make it self-contained.

1. Inspect the repo first: `git log --oneline -15`, `git status`, the `src/` tree, and run `npm test -- --run` and `npm run build`.
2. Update the checklist above to match what you found.
3. Reply with exactly this, in a single code block so it copies cleanly:

```
KRILLION PROGRESS — <date>
Current milestone: <n. name>
Done since last report:
- ...
In progress:
- ...
Next step:
- ...
Tests: <n passing / n failing>   Build: <ok / failing: reason>
Blockers or open questions:
- ...
Decisions made or changed:
- ...
```

Keep it factual and short. Leave a section as "none" rather than padding it.
