# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Next.js version

This project uses **Next.js 16**, which has breaking changes from the versions in your training data. Before writing any Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices.

## Commands

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build
npm run start    # serve production build
npm run lint     # run ESLint
npx tsc --noEmit # TypeScript type checking
```

## Architecture

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 (PostCSS plugin — no `tailwind.config.js`; configure via CSS `@theme` in `globals.css`)
- **Path alias**: `@/*` maps to `src/*`
- **UI language**: Ukrainian

### Application overview

English vocabulary learning app with spaced repetition (SM-2 algorithm). Four routes: `/flashcards` (default, redirected from `/`), `/dictionary`, `/statistics`, `/grammar` (placeholder, not yet implemented).

### Data flow

Word data lives statically in `src/data/words.ts` as an array of `Word` objects with default SM-2 fields. On mount, `useWords` calls `mergeWithStorage(WORDS)` which overlays persisted SM-2 progress from localStorage (`english-sm2` key) onto the static list. After each flashcard rating, `saveSm2Data` writes the updated SM-2 fields back. Review counts are tracked separately under `english-review-log`.

### SM-2 implementation (`src/lib/sm2.ts`)

Uses a 4-point `Quality` scale (0–3, not the standard 1–5). Rating < 2 resets repetitions and interval to 1; rating ≥ 2 advances normally. Status transitions: `new` → `learning` → `learned` (threshold: repetitions ≥ 4 **or** interval ≥ 21 days).

### State management

`useWords` (`src/hooks/useWords.ts`) is the single hook for reading word state and calling `rate(id, quality)`. All pages share the same `WORDS` source but each page instance initializes its own `useState` from `mergeWithStorage`. The flashcard queue is built once per session (due + new words, shuffled) and is not reactive to external state changes.

### Layout

`src/app/layout.tsx` renders a fixed sidebar (`src/components/Sidebar.tsx`) beside a scrollable main area. The sidebar uses `usePathname` for active-link highlighting.

### Card flip animation

CSS-only 3D flip in `globals.css`: toggle the `flipped` class on `.card-inner` inside a `.card-perspective` wrapper. `.card-face` elements use `backface-visibility: hidden`; the back face applies `rotateY(180deg)` at rest.

### Adding words

Add entries to `src/data/words.ts` following the `Word` type from `src/lib/types.ts`. Each word needs `id`, `word`, `phonetic`, `partOfSpeech`, `category`, and a `meanings` array. Default SM-2 fields (`status: "new"`, `interval: 1`, `ef: 2.5`, `due: now`, `repetitions: 0`, `lastReview: null`) are set via a shared `defaults` object at the top of that file.

### Adding routes

Create `src/app/<segment>/page.tsx`. Add the route to the `NAV` array in `src/components/Sidebar.tsx`.
