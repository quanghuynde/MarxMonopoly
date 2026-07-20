# MarxMonopoly Visual Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace MarxMonopoly's flat "dark navy + gold" template look with a brass/seal-red palette, a Fraunces/Inter/Space Mono type system, and a reusable guilloche (banknote-line) signature motif — across every screen and component, with no gameplay or layout changes.

**Architecture:** This is a design-token and one-new-component pass. `tailwind.config.js` and `src/index.css` are the single source of truth for colors/fonts; every consuming file does a mechanical `gold-` → `brass-` Tailwind class rename plus a small number of literal hex swaps (`#f5b83d` → `#c8933f`). One new component, `src/components/Guilloche.tsx`, is added and wired into three specific spots (board medallion, mode-select cards, final summary headline). No state, routing, or game-logic files change.

**Tech Stack:** React + TypeScript, Vite, Tailwind CSS, framer-motion, lucide-react icons. No new runtime dependencies — fonts are loaded via the existing Google Fonts `@import` in `src/index.css`.

## Global Constraints

- Spec source of truth: `docs/superpowers/specs/2026-07-20-visual-refresh-design.md`.
- Color mapping is mechanical and fixed for the whole plan: Tailwind class `gold-300/400/500/600` → `brass-300/400/500/600` (same shade number, same modifiers/opacity suffixes unchanged). Literal hex `#f5b83d` → `#c8933f`. Literal hex `#ffd35c` and `#e09a1f` only ever appear in `tailwind.config.js` (verified by repo-wide grep) and are replaced there, not elsewhere.
- Existing semantic colors (`emerald`, `rose`, `sky`, `purple`, `lime`, `orange`, `teal` used for character identity in `src/game/data/characters.ts`, mode identity in `ModeSelectScreen.tsx`, and stat semantics) are **not** touched by this plan.
- No layout, breakpoint, spacing, or gameplay-logic changes. Every task is visual/token only.
- `font-display` (Tailwind) → Fraunces. Default body / `font-sans` → Inter. New `font-mono` → Space Mono.
- Verification for every task is manual visual check via `npm run dev` (this is a CSS/token refactor — there is no existing automated test suite for visual output) plus, on the final task, `npm run build` to catch TypeScript/Tailwind config errors.

---

### Task 1: Design tokens — Tailwind config and global CSS

**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/index.css`

**Interfaces:**
- Produces: Tailwind color tokens `brass-300 (#e9c785)`, `brass-400 (#d4a24e)`, `brass-500 (#c8933f)`, `brass-600 (#a4711f)`, `seal-500 (#c23b2f)`, `paper-100 (#f3e9d2)`; `ink-850` recolored to `#151b30`; `fontFamily.display = ['"Fraunces"', 'serif']`, `fontFamily.sans = ['Inter', 'system-ui', 'sans-serif']`, new `fontFamily.mono = ['"Space Mono"', 'ui-monospace', 'monospace']`; `boxShadow.glow` recolored to brass. All later tasks consume these token names.

- [ ] **Step 1: Update the Google Fonts import in `src/index.css`**

Replace line 2 (the `@import url(...)` line) so it pulls Fraunces, Inter, and Space Mono instead of Baloo 2 and Nunito:

```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,800&family=Inter:ital,wght@0,400;0,600;0,700;0,800;1,600&family=Space+Mono:wght@400;700&display=swap');
```

- [ ] **Step 2: Update `body` font-family in `src/index.css`**

Change:
```css
body {
  margin: 0;
  font-family: Nunito, system-ui, sans-serif;
```
to:
```css
body {
  margin: 0;
  font-family: Inter, system-ui, sans-serif;
```

- [ ] **Step 3: Update `tailwind.config.js` color, font, and shadow tokens**

Replace the `fontFamily` block:
```js
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
```
with:
```js
      fontFamily: {
        display: ['Fraunces', 'system-ui', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
```

Replace the `colors` block:
```js
      colors: {
        ink: {
          950: '#0a0e1a',
          900: '#0f1424',
          850: '#141a2e',
          800: '#1a2138',
          700: '#232c4a',
          600: '#2f3a5e',
        },
        gold: {
          400: '#ffd35c',
          500: '#f5b83d',
          600: '#e09a1f',
        },
      },
```
with:
```js
      colors: {
        ink: {
          950: '#0a0e1a',
          900: '#0f1424',
          850: '#151b30',
          800: '#1a2138',
          700: '#232c4a',
          600: '#2f3a5e',
        },
        brass: {
          300: '#e9c785',
          400: '#d4a24e',
          500: '#c8933f',
          600: '#a4711f',
        },
        seal: {
          500: '#c23b2f',
        },
        paper: {
          100: '#f3e9d2',
        },
      },
```

Replace the `boxShadow` block's `glow` line:
```js
        glow: '0 0 24px -4px rgba(245,184,61,0.55)',
```
with:
```js
        glow: '0 0 24px -4px rgba(200,147,63,0.55)',
```

- [ ] **Step 4: Visual check**

Run: `npm run dev`, open the app in a browser. Expect: app still loads without console/Tailwind errors (existing `gold-*` class usages will render unstyled/black until later tasks — that's expected at this point, not a bug). Confirm no build error in the terminal running `npm run dev`.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.js src/index.css
git commit -m "feat: add brass/seal/paper design tokens and Fraunces/Inter/Space Mono fonts"
```

---

### Task 2: Guilloche signature component

**Files:**
- Create: `src/components/Guilloche.tsx`

**Interfaces:**
- Consumes: nothing (pure presentational component, no game state).
- Produces: `export function Guilloche(props: { className?: string; color?: string; height?: number }): JSX.Element` — an `<svg>` rendering a horizontal repeating wavy-line (guilloche) strip. Default `color` is `currentColor` (so a parent's `text-brass-500` etc. controls it via CSS), default `height` is `10`. Tasks 3, 5, and 8 import and render this component.

- [ ] **Step 1: Create the component**

```tsx
interface Props {
  className?: string;
  color?: string;
  height?: number;
}

/**
 * A thin repeating engine-turned wave-line strip, in the style of a banknote
 * border. Renders as a full-width <svg> — the parent controls length via
 * layout (e.g. w-full) and color via the `color` prop or currentColor.
 */
export function Guilloche({ className, color = 'currentColor', height = 10 }: Props) {
  const patternId = 'guilloche-pattern';
  return (
    <svg
      className={className}
      width="100%"
      height={height}
      viewBox={`0 0 80 ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id={patternId} width="20" height={height} patternUnits="userSpaceOnUse">
          <path
            d={`M0,${height / 2} C5,0 15,${height} 20,${height / 2}`}
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity="0.8"
          />
          <path
            d={`M0,${height / 2} C5,${height} 15,0 20,${height / 2}`}
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity="0.4"
          />
        </pattern>
      </defs>
      <rect width="80" height={height} fill={`url(#${patternId})`} />
    </svg>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no new errors referencing `Guilloche.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/Guilloche.tsx
git commit -m "feat: add Guilloche signature component"
```

---

### Task 3: Core play components — token swap + Board medallion

**Files:**
- Modify: `src/components/ScoreBar.tsx`
- Modify: `src/components/Dice.tsx`
- Modify: `src/components/EventModal.tsx`
- Modify: `src/components/Board.tsx`

**Interfaces:**
- Consumes: `Guilloche` from `src/components/Guilloche.tsx` (Task 2); `brass-*` Tailwind tokens (Task 1).
- Produces: no new exports; visual-only changes to existing components already consumed by `PlayScreen.tsx`.

- [ ] **Step 1: `ScoreBar.tsx` — token swap + mono totals**

Apply a literal find-and-replace of every `gold-` occurrence to `brass-` (4 occurrences, all `gold-400`, at lines 28, 34, 47, 53 per current file). Example for line 47 — change:
```tsx
<span className="rounded-md bg-gold-400/15 px-1.5 py-0.5 text-xs font-extrabold text-gold-400">
    {totalScore(p)}
</span>
```
to:
```tsx
<span className="rounded-md bg-brass-400/15 px-1.5 py-0.5 text-xs font-mono font-extrabold text-brass-400">
    {totalScore(p)}
</span>
```
(Note the added `font-mono` — this is the only line that also gains a font-family class; the other 3 `gold-` occurrences are a straight `gold-` → `brass-` rename with no other changes.)

- [ ] **Step 2: `Dice.tsx` — default accent hex**

Change:
```tsx
export function Dice({ onResult, disabled, accent = '#f5b83d' }: Props) {
```
to:
```tsx
export function Dice({ onResult, disabled, accent = '#c8933f' }: Props) {
```

- [ ] **Step 3: `EventModal.tsx` — token swap**

Apply a literal find-and-replace of every `gold-` occurrence to `brass-` (3 occurrences at lines 149, 164, 187 per current file — `border-gold-400/30 bg-gold-400/10`, `hover:border-gold-400/50`, `bg-gold-500 ... hover:bg-gold-400`). No other changes in this file.

- [ ] **Step 4: `Board.tsx` — guilloche-ringed medallion**

Change the center emblem block from:
```tsx
      {/* Center emblem */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="rounded-2xl border border-gold-400/30 bg-ink-900/70 px-4 py-3 backdrop-blur-sm">
            <div className="font-display text-lg font-extrabold text-gold-400 sm:text-2xl">MarxMonopoly</div>
            <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/50 sm:text-xs">
              Cờ Tỷ Phú Kinh Tế Học
            </div>
          </div>
        </div>
      </div>
```
to:
```tsx
      {/* Center emblem — seal medallion */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-1 rounded-full border border-brass-400/40 bg-ink-900/70 px-6 py-5 text-center backdrop-blur-sm">
          <div className="font-display text-lg font-extrabold text-brass-400 sm:text-2xl">MarxMonopoly</div>
          <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/50 sm:text-xs">
            Cờ Tỷ Phú Kinh Tế Học
          </div>
          <Guilloche className="mt-1 w-20 text-brass-400/60" height={6} />
        </div>
      </div>
```
Add the import at the top of the file, alongside the existing `Icon` import:
```tsx
import { Guilloche } from './Guilloche';
```

- [ ] **Step 5: Visual check**

Run: `npm run dev`, start a game (Home → Bắt đầu chơi → any mode → pick characters). Confirm: dice face renders with a brass glow (not black/unstyled), score bar totals show in monospace brass badges, event modal "continue"/option buttons are brass, and the board's center medallion is circular with a thin wavy brass line beneath the title.

- [ ] **Step 6: Commit**

```bash
git add src/components/ScoreBar.tsx src/components/Dice.tsx src/components/EventModal.tsx src/components/Board.tsx
git commit -m "feat: apply brass tokens to play components, add guilloche board medallion"
```

---

### Task 4: Mini-game components — token swap

**Files:**
- Modify: `src/components/MiniGameHost.tsx`
- Modify: `src/components/minigames/MatchGame.tsx`
- Modify: `src/components/minigames/MemoryGame.tsx`
- Modify: `src/components/minigames/QuizGame.tsx`
- Modify: `src/components/minigames/ReflexGame.tsx`
- Modify: `src/components/minigames/WheelGame.tsx`

**Interfaces:**
- Consumes: `brass-*` Tailwind tokens (Task 1).
- Produces: no new exports; visual-only.

- [ ] **Step 1: `MiniGameHost.tsx`**

Apply a literal find-and-replace of every `gold-` occurrence to `brass-` (12 occurrences at lines 69, 81, 82, 85, 96, 98, 101, 122, 131, 150, 156, 163 per current file). No other changes — every occurrence is a direct `gold-400`/`gold-500` → `brass-400`/`brass-500` rename (including the `isBoss ? ... : 'bg-gold-400/20'` ternary at line 81, which only renames the non-boss branch).

- [ ] **Step 2: `MatchGame.tsx`**

Apply a literal find-and-replace of every `gold-` occurrence to `brass-` (2 occurrences at lines 95, 116 per current file).

- [ ] **Step 3: `MemoryGame.tsx`**

Apply a literal find-and-replace of every `gold-` occurrence to `brass-` (2 occurrences at lines 102, 122 per current file — including `text-gold-300` → `text-brass-300`, which is why Task 1 defines `brass-300`).

- [ ] **Step 4: `QuizGame.tsx`**

Apply a literal find-and-replace of every `gold-` occurrence to `brass-` (3 occurrences at lines 96, 120, 130 per current file).

- [ ] **Step 5: `ReflexGame.tsx`**

Apply a literal find-and-replace of every `gold-` occurrence to `brass-` (5 occurrences at lines 100, 101, 111, 127, 130 per current file).

- [ ] **Step 6: `WheelGame.tsx`**

Apply a literal find-and-replace of every `gold-` occurrence to `brass-` for the 3 Tailwind-class occurrences (lines 114, 124, 130 per current file). Separately, change the literal hex on line 23:
```tsx
{ label: 'x2', mult: 2, color: '#f5b83d' },
```
to:
```tsx
{ label: 'x2', mult: 2, color: '#c8933f' },
```

- [ ] **Step 7: Visual check**

Run: `npm run dev`, play through a full round to trigger the mini-game intro/play/results screens (or trigger each of the 5 mini-games across a few rounds — `MINI_GAMES` in `src/game/logic.ts` picks randomly, so replay a few rounds if needed to see each). Confirm: all "Bắt đầu"/start buttons, progress rings, and score badges render in brass, not black/unstyled.

- [ ] **Step 8: Commit**

```bash
git add src/components/MiniGameHost.tsx src/components/minigames/
git commit -m "feat: apply brass tokens to mini-game components"
```

---

### Task 5: Home and Mode Select screens — Fraunces hero + guilloche card accent

**Files:**
- Modify: `src/screens/HomeScreen.tsx`
- Modify: `src/screens/ModeSelectScreen.tsx`

**Interfaces:**
- Consumes: `Guilloche` from `src/components/Guilloche.tsx` (Task 2); `brass-*` tokens (Task 1).
- Produces: no new exports; visual-only.

- [ ] **Step 1: `HomeScreen.tsx` — token swap**

Apply a literal find-and-replace of every `gold-` occurrence to `brass-` (4 occurrences at lines 43, 46, 52, 86 per current file — the dice-icon badge background, the eyebrow label, the `h2` subtitle, and the primary CTA button).

- [ ] **Step 2: `HomeScreen.tsx` — guilloche accent under the high-score bar**

Import `Guilloche` at the top of the file alongside the existing imports:
```tsx
import { Guilloche } from '../components/Guilloche';
```
Add a thin guilloche strip directly below the high-score summary bar block (after its closing `)}` and before the `<div className="mt-6 flex w-full max-w-xs flex-col gap-3">` block), so the JSX reads:
```tsx
        )}

        <Guilloche className="mt-4 w-40 text-brass-400/50" height={6} />

        <div className="mt-6 flex w-full max-w-xs flex-col gap-3">
```

- [ ] **Step 3: `ModeSelectScreen.tsx` — token swap**

Apply a literal find-and-replace of every `gold-` occurrence to `brass-` (5 occurrences at lines 69, 70, 71, 112, 172 per current file — the Solo mode icon/gradient/accent, the header label, and the multiplayer button icon).

- [ ] **Step 4: `ModeSelectScreen.tsx` — guilloche top edge on mode cards**

Import `Guilloche` at the top of the file:
```tsx
import { Guilloche } from '../components/Guilloche';
```
Inside the `modes.map(...)` card render, add a guilloche strip as the first child of the card, before the existing `<div>` that wraps the icon/badge row. Change:
```tsx
              onClick={() => selectMode(m.id)}
              className={`cursor-pointer flex flex-col justify-between rounded-3xl border bg-gradient-to-br p-6 transition-all shadow-card ${m.color}`}
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
```
to:
```tsx
              onClick={() => selectMode(m.id)}
              className={`cursor-pointer flex flex-col justify-between rounded-3xl border bg-gradient-to-br p-6 transition-all shadow-card ${m.color}`}
            >
              <Guilloche className={`-mt-2 mb-3 w-full ${m.accent}`} height={8} />
              <div>
                <div className="mb-4 flex items-center justify-between">
```

- [ ] **Step 5: Visual check**

Run: `npm run dev`, view Home screen and Mode Select screen at mobile (375px) and desktop (1280px) widths (use browser devtools device toolbar, or resize the window). Confirm: hero title/CTA render in the new brass tone with the Fraunces display font visibly different from before (more serif character), the thin guilloche line appears under the high-score bar on Home, and each mode card has a thin wavy line strip at its top in that mode's accent color. Confirm no text overflow/clipping from the new font at the `sm:text-7xl` hero size on a narrow viewport.

- [ ] **Step 6: Commit**

```bash
git add src/screens/HomeScreen.tsx src/screens/ModeSelectScreen.tsx
git commit -m "feat: apply brass tokens and guilloche accents to Home and Mode Select screens"
```

---

### Task 6: Character Select and Guide screens — token swap

**Files:**
- Modify: `src/screens/CharacterScreen.tsx`
- Modify: `src/screens/GuideScreen.tsx`

**Interfaces:**
- Consumes: `brass-*` tokens (Task 1).
- Produces: no new exports; visual-only.

- [ ] **Step 1: `CharacterScreen.tsx` — token swap**

Apply a literal find-and-replace of every `gold-` occurrence to `brass-` (9 occurrences at lines 120, 121, 133, 154, 157, 173, 186, 206, 210 per current file — this includes the compound line 173 `border-gold-400 bg-gold-400/15 text-gold-400` → `border-brass-400 bg-brass-400/15 text-brass-400`, all three tokens in that one class string). No other changes.

- [ ] **Step 2: `GuideScreen.tsx` — token swap**

Apply a literal find-and-replace of every `gold-` occurrence to `brass-` (6 occurrences: the `color: 'text-gold-400'` entry in the icon list near line 23, and lines 39, 43 twice, 52, 63, 64 per current file).

- [ ] **Step 3: Visual check**

Run: `npm run dev`, navigate to Character Select (Home → Bắt đầu chơi → any mode) and Guide (Home → Hướng dẫn & Luật chơi). Confirm: selected-character rings, round-count selector, and "Bắt đầu" button on Character Select render in brass; Guide screen section headers and the score-formula callout box render in brass, not black/unstyled.

- [ ] **Step 4: Commit**

```bash
git add src/screens/CharacterScreen.tsx src/screens/GuideScreen.tsx
git commit -m "feat: apply brass tokens to Character Select and Guide screens"
```

---

### Task 7: Play screen — token swap + seal-red boss emphasis

**Files:**
- Modify: `src/screens/PlayScreen.tsx`

**Interfaces:**
- Consumes: `brass-*`, `seal-500` tokens (Task 1).
- Produces: no new exports; visual-only.

- [ ] **Step 1: Token swap**

Apply a literal find-and-replace of every `gold-` occurrence to `brass-` (9 occurrences at lines 228, 238, 244, 253, 345, 352, 368, 370, 372 per current file), with one exception noted in Step 2 below.

- [ ] **Step 2: Boss round uses `seal-500` instead of brass**

The mini-game hint box (around line 368-372) currently reads, after the Step 1 rename:
```tsx
          <div className="rounded-2xl border border-brass-400/20 bg-brass-400/5 p-3 text-xs text-white/60">
            {isSolo ? (
              <span>Sau lượt đi này, bạn sẽ tham gia <span className="font-bold text-brass-400">mini game</span> tích điểm. {isBossRound && 'Đây là vòng đấu Boss!'}</span>
            ) : (
              <span>Sau khi cả 4 người đi xong sẽ có <span className="font-bold text-brass-400">mini game</span> tranh tài. {isBossRound && 'Vòng này là trận Boss!'}</span>
            )}
          </div>
```
Change the two `{isBossRound && 'Đây là vòng đấu Boss!'}` / `{isBossRound && 'Vòng này là trận Boss!'}` expressions to wrap the text in a seal-colored span, so boss rounds stand out distinctly from the default brass mini-game copy:
```tsx
          <div className="rounded-2xl border border-brass-400/20 bg-brass-400/5 p-3 text-xs text-white/60">
            {isSolo ? (
              <span>Sau lượt đi này, bạn sẽ tham gia <span className="font-bold text-brass-400">mini game</span> tích điểm. {isBossRound && <span className="font-bold text-seal-500">Đây là vòng đấu Boss!</span>}</span>
            ) : (
              <span>Sau khi cả 4 người đi xong sẽ có <span className="font-bold text-brass-400">mini game</span> tranh tài. {isBossRound && <span className="font-bold text-seal-500">Vòng này là trận Boss!</span>}</span>
            )}
          </div>
```

- [ ] **Step 3: Visual check**

Run: `npm run dev`, play until round 5 (or start Solo/Story mode and fast-forward turns) to reach a boss round (`state.round % 5 === 0`). Confirm: top bar round label, objective/progress bars, sidebar section labels, and the mini-game hint render in brass; on boss rounds specifically, the "Boss!" callout text renders in seal-red, visibly distinct from the surrounding brass text.

- [ ] **Step 4: Commit**

```bash
git add src/screens/PlayScreen.tsx
git commit -m "feat: apply brass tokens to Play screen, use seal-red for boss round emphasis"
```

---

### Task 8: Round Summary and Final Summary screens — token swap + guilloche headline

**Files:**
- Modify: `src/screens/RoundSummaryScreen.tsx`
- Modify: `src/screens/FinalSummaryScreen.tsx`

**Interfaces:**
- Consumes: `Guilloche` from `src/components/Guilloche.tsx` (Task 2); `brass-*` tokens (Task 1).
- Produces: no new exports; visual-only.

- [ ] **Step 1: `RoundSummaryScreen.tsx` — token swap**

Apply a literal find-and-replace of every `gold-` occurrence to `brass-` (9 of the 10 occurrences: lines 44, 64, 73 (class only), 87, 95, 125, 141, 169, 185 per current file).

- [ ] **Step 2: `RoundSummaryScreen.tsx` — literal hex swap**

The two `motion.div` score-pop animations use a literal hex for the "flash" color. Change both occurrences of:
```tsx
initial={{ scale: 1.4, color: '#f5b83d' }}
```
to:
```tsx
initial={{ scale: 1.4, color: '#c8933f' }}
```
(lines 73 and 151 per current file — line 151's surrounding class is `text-white`, not `text-gold-*`, so only the hex changes there, not a class rename).

- [ ] **Step 3: `FinalSummaryScreen.tsx` — token swap**

Apply a literal find-and-replace of every `gold-` occurrence to `brass-` (12 of the 13 occurrences: lines 103, 115, 124, 135 (both `text-gold-400` and `border-gold-400/40`), 146, 147, 151, 155 (both occurrences), 168, 175, 179, 231 per current file).

- [ ] **Step 4: `FinalSummaryScreen.tsx` — literal hex swap**

Change:
```tsx
<Star key={s} size={24} fill={evalResult.stars >= s ? 'currentColor' : 'none'} className={evalResult.stars >= s ? 'scale-110 drop-shadow-[0_0_8px_#f5b83d]' : 'opacity-20'} />
```
to:
```tsx
<Star key={s} size={24} fill={evalResult.stars >= s ? 'currentColor' : 'none'} className={evalResult.stars >= s ? 'scale-110 drop-shadow-[0_0_8px_#c8933f]' : 'opacity-20'} />
```

- [ ] **Step 5: `FinalSummaryScreen.tsx` — guilloche accent on the champion headline**

Import `Guilloche` at the top of the file:
```tsx
import { Guilloche } from '../components/Guilloche';
```
Find the champion header block (around line 146-151, the `Crown` / "Nhà vô địch" / score block) and add a guilloche strip directly beneath the score line. Change:
```tsx
            <Crown className="mb-1 text-brass-400" size={40} />
            <div className="text-sm font-bold uppercase tracking-[0.3em] text-brass-400">Nhà vô địch</div>
```
Note: this reflects the state *after* Step 3's rename already ran on this file. Then, after the score `<div>` a few lines below it (`<div className="mt-1 font-display text-3xl font-extrabold text-brass-400">{score} điểm</div>`), add:
```tsx
            <div className="mt-1 font-display text-3xl font-extrabold text-brass-400">{score} điểm</div>
            <Guilloche className="mt-2 w-32 text-brass-400/50" height={6} />
```

- [ ] **Step 6: Visual check**

Run: `npm run dev`, complete a round to reach `RoundSummaryScreen`, and complete a full game (or use Endless mode and lose all lives quickly) to reach `FinalSummaryScreen`. Confirm: score-pop flash animates through brass (not the old gold hex — verify visually it's the slightly deeper/more muted brass tone), star ratings' glow is brass, and the champion headline on the final screen has a thin wavy guilloche line beneath the score.

- [ ] **Step 7: Commit**

```bash
git add src/screens/RoundSummaryScreen.tsx src/screens/FinalSummaryScreen.tsx
git commit -m "feat: apply brass tokens and guilloche accent to Round/Final Summary screens"
```

---

### Task 9: Tile data — hex color swap

**Files:**
- Modify: `src/game/data/tiles.ts`

**Interfaces:**
- Consumes: none (data file).
- Produces: no signature change — `Tile.color` values are still plain hex strings, only the values change.

- [ ] **Step 1: Replace all 6 occurrences of the old gold hex**

Replace every occurrence of:
```ts
  color: '#f5b83d',
```
with:
```ts
  color: '#c8933f',
```
(6 occurrences, at lines 15, 100, 148, 261, 405, 457 per current file — these are the `start`/`boss`-style category tiles that used the old flat gold as their category identity color; they now use the new brass hex for the same purpose.)

- [ ] **Step 2: Visual check**

Run: `npm run dev`, view the board (Home → Bắt đầu chơi → any mode → pick characters → Play screen). Confirm: the "Xuất Phát" (start) tile and other tiles previously using flat gold now render with the new brass tone, visually consistent with the rest of the brass-themed UI (not a jarring mismatch against the other recolored elements).

- [ ] **Step 3: Commit**

```bash
git add src/game/data/tiles.ts
git commit -m "feat: recolor gold-category board tiles to new brass hex"
```

---

### Task 10: Full verification pass

**Files:**
- None modified — this task only verifies.

**Interfaces:**
- Consumes: the completed state of all previous tasks.
- Produces: nothing; this is the plan's final gate.

- [ ] **Step 1: Grep for leftover `gold-` Tailwind classes**

Run: `grep -rn "gold-" src/`
Expected: no output (empty). If any lines are found, they were missed by an earlier task — go back and rename them following the same `gold-N` → `brass-N` rule.

- [ ] **Step 2: Grep for leftover old gold hex literals**

Run: `grep -rn "#f5b83d\|#ffd35c\|#e09a1f" src/`
Expected: no output (empty).

- [ ] **Step 3: Grep for leftover old font names**

Run: `grep -rn "Baloo\|Nunito" src/`
Expected: no output (empty).

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 5: Production build**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 6: Manual pass through every screen**

Run: `npm run dev` and click through, at both a mobile width (~375px) and desktop width (~1280px): Home → Mode Select → Character Select → Play (roll dice, resolve at least one event, play at least one mini-game) → Round Summary → (continue to a full finish or use Endless/lose-all-lives) → Final Summary → back to Home → Guide. Confirm every screen shows brass (not gold, not black/unstyled), Fraunces headlines, and the guilloche accents in the 3 wired locations (board medallion, mode-select cards, final summary headline). Confirm nothing regressed: dice still rolls, events still resolve, mini-games still playable, navigation still works.

- [ ] **Step 7: Commit (only if Step 1-3 greps required fixes)**

If any fixes were needed in Steps 1-3, stage and commit them:
```bash
git add -A
git commit -m "fix: clean up remaining gold/legacy-font references"
```
If no fixes were needed, skip this step — there is nothing to commit.
