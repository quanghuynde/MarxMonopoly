# MarxMonopoly Visual Refresh — Design Spec

Date: 2026-07-20
Status: Approved by user, pending implementation plan

## Goal

Refresh the visual identity of MarxMonopoly (Cờ Tỷ Phú Kinh Tế Học) across the whole app so it reads as a deliberately-designed product tied to its subject (political economy / currency / value), instead of the current generic "dark navy + flat gold + emoji" mobile-game template. Keep the existing playful, approachable tone — this is an educational game for students, not a somber redesign. No architectural or gameplay changes; this is visual/token-level only.

## Token System

### Color

Replace the flat `gold` scale with a richer, more "metal/antique" brass, and add a seal-red accent and a paper cream, used sparingly. `ink` scale stays close to current but panel tone shifts slightly warmer/deeper for contrast against the new accents.

| Token | Hex | Usage |
|---|---|---|
| `ink-950` | `#0a0e1a` | App background (unchanged) |
| `ink-900` | `#0f1424` | Sticky bars, deep panels (unchanged) |
| `ink-850` | `#151b30` | Card/panel background (was `#141a2e`, nudged warmer) |
| `ink-800` | `#1a2138` | Secondary panel (unchanged) |
| `ink-700` | `#232c4a` | Active/hover panel (unchanged) |
| `brass-300` | `#e9c785` | Brass highlight text, light accents |
| `brass-500` | `#c8933f` | Primary accent — replaces `gold-500` 1:1 in most usages |
| `brass-600` | `#a4711f` | Brass pressed/border-dark state |
| `seal-500` | `#c23b2f` | Emphasis accent: boss rounds, streak/record badges, "stamped" callouts. Used the way `purple`/`rose` accents are used today for mode-specific color, not as a wholesale replace of existing semantic colors (emerald=positive, rose=danger stay as-is). |
| `paper-100` | `#f3e9d2` | Guilloche pattern strokes, medallion background fill — used only inside the signature motif, not as general UI surface |

Existing semantic colors (`emerald` for positive stats, `rose` for danger/hearts, `sky`/`purple`/`lime`/`orange`/`teal` for character/mode identity) are unchanged — they carry meaning (character colors in `characters.ts`, mode colors in `ModeSelectScreen`) and aren't part of what made the UI feel generic.

`gold-*` Tailwind tokens are renamed to `brass-*` and every usage site (`gold-400/500/600`, `text-gold-400`, `bg-gold-500`, `shadow-glow`, `border-gold-400/*`, etc.) is updated. `shadow.glow` recolors to brass: `0 0 24px -4px rgba(200,147,63,0.55)`.

### Typography

| Role | Family | Notes |
|---|---|---|
| Display (`font-display`) | **Fraunces** (variable, opsz+wght axes) | Headlines, mode titles, score numbers, player names. Replaces Baloo 2. Use a mid-high `opsz` (~40-72) with `wght` 600-800 so it reads confident and slightly characterful rather than stiff-serif-academic. |
| Body (`font-sans`, default) | **Inter** | Replaces Nunito. Better Vietnamese diacritic rendering at small sizes, neutral workhorse. |
| Utility/data (new `font-mono`) | **Space Mono** | New role: score digits in compact contexts (ScoreBar totals, seeds/codes like Daily Challenge seed, dice value label if desired). Reinforces the "ledger/banknote" association. Used narrowly — not for body paragraphs. |

Google Fonts import line in `src/index.css` updates accordingly; `tailwind.config.js` `fontFamily` gains `mono`.

### Layout

No structural changes. Existing screen flow (Home → Mode Select → Character Select → Board/Play → Mini-game → Round/Final Summary) and existing grid/card layouts are kept. Refinements are to card chrome:

- Cards/panels move from soft blurred `shadow-glow`-heavy borders toward a crisper hairline brass rule (`border-brass-500/30`) plus small corner tick marks (a lightweight CSS/SVG detail, not a redesign of spacing).
- The board's center emblem becomes a circular medallion (see Signature) instead of a rounded-rect label chip.

### Signature Element: Guilloche Border

A single reusable SVG guilloche pattern (the engine-turned wavy-line pattern seen on banknote borders and seals) is the one recurring, memorable visual device. Implementation:

- New component `src/components/Guilloche.tsx` — renders a thin repeating `<svg>` strip (via `<pattern>`) at a given width/height/color, used as:
  - A ~3-4px decorative border strip along the top edge of mode-select cards and the score panel header (static, plain currentColor stroke — no per-frame animation cost).
  - A ring around the Board's center medallion (replacing the current `rounded-2xl border` label box) — styled like a coin/seal.
  - Optional thin accent on the winning/summary screens' headline card.
- Single component, single SVG pattern reused everywhere (not different patterns per screen) so it reads as *the* mark of this game rather than decoration-of-the-week.
- Rendered in `brass-500` by default; accepts a `color` prop for contexts that want `seal-500` (e.g. boss round banner) — mirrors how `tile.color`/`character.color` are already threaded through as props today.

This directly answers "how does the UI carry the theme of economic value" without resorting to literal dollar-sign iconography or heavy skeuomorphism.

## Motion

No new animation system. Keep the existing `framer-motion` patterns (`floaty`, `pop`, `shimmer` keyframes; spring `whileHover`/`whileTap`; `AnimatePresence` for modals) — they already give the app life and match the playful tone. Only change: color values referenced inside animations (glow shadows, active-state backgrounds) move from gold to brass hex values. `shimmer` keyframe (currently defined but check usage) stays available for skeleton/progress-bar loading states if used.

## Scope: Screens & Components Touched

All of the following get the token swap (gold→brass, Baloo 2→Fraunces, Nunito→Inter) plus the specific refinements noted:

- `tailwind.config.js`, `src/index.css` — token/font source of truth.
- `src/components/Board.tsx` — center emblem becomes guilloche-ringed medallion.
- `src/components/ScoreBar.tsx` — totals rendered in `font-mono`; active-row highlight uses brass.
- `src/components/Dice.tsx` — default `accent` prop updates to brass hex; pip/shadow colors follow.
- `src/components/EventModal.tsx` — accent borders/buttons to brass; "resolved" success panel border to brass.
- `src/components/Icon.tsx` — no visual change expected (check for hardcoded gold hex).
- `src/components/MiniGameHost.tsx` and `src/components/minigames/*.tsx` — token swap only, no layout change.
- `src/screens/HomeScreen.tsx` — hero title in Fraunces; CTA buttons to brass; guilloche accent optionally under high-score summary bar.
- `src/screens/ModeSelectScreen.tsx` — card top edge gets guilloche strip; icon/text accent tokens updated per mode (existing per-mode color identity — rose/purple/sky — is preserved, only the shared gold references move to brass).
- `src/screens/CharacterScreen.tsx` — token swap (not yet read in detail; verify during implementation for any hardcoded `#f5b83d`/gold references).
- `src/screens/GuideScreen.tsx` — token swap.
- `src/screens/PlayScreen.tsx` — top bar, round/objective panels, sidebar panels (`Bảng điểm`, `Nhật ký sự kiện`, mini-game hint) to brass; boss-round labeling can use `seal-500` for emphasis instead of a generic color.
- `src/screens/RoundSummaryScreen.tsx`, `src/screens/FinalSummaryScreen.tsx` — token swap; final-summary headline card is a good candidate for the guilloche accent strip.

## Accessibility & Quality Floor

- Contrast: brass-500 (`#c8933f`) on `ink-950`/`ink-850` backgrounds must be checked to meet at least the current gold's contrast ratio for body-sized text; use `brass-300` where small text currently uses `gold-400` if contrast is insufficient.
- Keyboard focus rings: any currently-visible focus states are preserved (no removal of focus outlines during the token swap).
- Reduced motion: existing behavior (none of the current animations are gated by `prefers-reduced-motion`) is not a regression introduced by this change; out of scope to add motion-reduction support unless it already exists.
- Responsive: no breakpoint or layout changes, so existing mobile responsiveness is preserved as-is; verify the new Fraunces display face doesn't overflow at existing small-screen font sizes (e.g. `text-5xl`/`sm:text-7xl` hero on `HomeScreen`).

## Out of Scope

- No new screens, no gameplay/logic changes, no new mini-games.
- No wholesale layout restructuring — this is a token + one signature-component pass.
- No literal historical/propaganda-poster imagery (rejected direction) and no glassmorphism/3D-token direction (rejected direction).
- Character emoji avatars, tile icons (`Icon.tsx`/lucide icons), and existing per-character/per-mode color identities are kept as-is.

## Verification Plan

- `npm run dev` and visually check each touched screen (Home, Mode Select, Character Select, Board/Play including an EventModal and one mini-game, Round Summary, Final Summary, Guide) at mobile and desktop widths.
- Grep the codebase for leftover hardcoded gold hex values (`#f5b83d`, `#e09a1f`, `#ffd35c`) and `gold-` Tailwind class usages to confirm the token rename is complete.
- `npm run build` (or existing lint/typecheck script) to confirm no TypeScript/Tailwind config errors from the rename.
