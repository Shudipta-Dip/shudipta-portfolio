# Style variant scratchpad — agent checklist

Use this when adding **alternate website skins** (RETROWAVE first, more later). Default production theme is **Frutiger Aero** (`DESIGN.md`). All style-picker work stays **localhost-only** until explicitly approved for deploy.

---

## Before you touch code

- [ ] Read `DESIGN.md` (Frutiger Aero baseline) and the target spec in `docs/design-systems/<STYLE>.md`
- [ ] Read `node_modules/next/dist/docs/` for this repo’s Next.js version — APIs differ from training data (`AGENTS.md`)
- [ ] Confirm scope: **one style at a time**, perfect it before starting the next
- [ ] Do **not** commit or push unless the user asks
- [ ] Do **not** change intake CSV, portfolio ordering, or unrelated features in a theme PR

---

## Architecture decisions (from this project)

### Theme switching model
- [ ] Use `data-theme="<id>"` on `<html>` (e.g. `frutiger`, `retrowave`)
- [ ] Override CSS variables under `[data-theme="..."]` in `globals.css` — avoid duplicating every component
- [ ] Swap background scene component (`AeroScene` vs `RetrowaveScene`) based on theme
- [ ] Keep shared layout: `SiteHeader`, board masonry, scrolling mode structure unchanged
- [ ] Style picker: top-right dropdown in `SiteHeader`, **dev-only**:
  ```ts
  const showPicker =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_STYLE_PICKER === "1";
  ```
- [ ] Persist choice in `localStorage` key e.g. `portfolio-theme`
- [ ] Hydration: apply theme in client `useEffect` or inline script in layout to avoid flash

### What must re-skin together
- [ ] Global background / scene
- [ ] Header nav (`.glass-shell` → theme panel)
- [ ] Board project cards + filter shortcuts
- [ ] Contribution / meta chips
- [ ] Scrolling mode stage (`.reels-stage-bg`), controls, catch-up slide
- [ ] Dialogs, tooltips, buttons (shadcn tokens)
- [ ] Skeleton loaders (board + reels) — shimmer colors must match theme
- [ ] Optional: disable or replace **bubble cursor** on themes where it clashes (coarse pointer already disabled)

### What stays shared
- [ ] Content pipeline: `content/portfolio-intake.csv` → `src/lib/drop.ts` → `src/lib/portfolio.ts`
- [ ] Pinned top 5 board order + product/data scatter logic
- [ ] Masonry pair-adjacency rules (`masonry-grid.tsx`)
- [ ] Scrolling mode feed filter (excludes product/data)
- [ ] Embed detail pages (iframe on `/work/[slug]`)
- [ ] OG metadata / production URLs

---

## Media & loading patterns (do not regress)

These bugs were fixed in this project — preserve patterns when theming:

### Board video posters (`HoverVideoPreview`)
- [ ] Use `useLayoutEffect` + `Image.complete` / `naturalWidth` probe after reset
- [ ] Poster `<img>`: `loading="eager"` (lazy breaks + cache race)
- [ ] Always handle `onLoad` **and** `onError` to clear skeleton
- [ ] Never reset `ready` in `useEffect` after paint without re-probing cache

### Board images (`MediaFrame` in `cover-art.tsx`)
- [ ] Same cache-probe for images in `useLayoutEffect`
- [ ] Next `<Image>` for board stills; native `<img>` inside scrolling mode reels container

### Scrolling mode
- [ ] Full-slide background on section (`reels-stage-bg` on slide, not only inner frame)
- [ ] Media: full-viewport `object-contain`; metadata/toggles anchored to **viewport bottom**, not media box bottom
- [ ] Poster shows until video ready; skeleton until poster/image decodes
- [ ] Preload adjacent slide posters (±2 indices) on active index change
- [ ] iOS: `100dvh` / `100svh`, safe-area on controls, `-webkit-overflow-scrolling: touch`
- [ ] iOS: coarse-pointer fallback for `.reels-glass-control` (no backdrop-filter)
- [ ] Body scroll lock when overlay open; restore `scrollY` on close
- [ ] Launcher: `onPointerUp` + reopen guard (`hasOpenedRef` reset when hidden)

### Board embeds (`BoardEmbedPreview`)
- [ ] Deferred iframe mount after scroll idle (~320ms) + intersection
- [ ] Scroll guard on iframe mount; skeleton until embed `onLoad`
- [ ] `pointer-events-none` on board iframe; full interact on detail page
- [ ] Never mount lazy iframes for all embeds at once (scroll hijack)

---

## Component conventions

- [ ] shadcn primitives live in `src/components/ui/` — extend via variants, don’t fork
- [ ] Brand icons: `src/lib/brand-icons.tsx` (outline LinkedIn/GitHub)
- [ ] Category/contribution icons: `src/lib/icons.ts`
- [ ] Buttons: `buttonVariants()` from `src/components/ui/button.tsx`
- [ ] Cards: `Card` + theme panel class
- [ ] New CSS utilities go in `@layer components` in `globals.css`
- [ ] Prefer CSS variables over hard-coded hex in TSX

---

## RETROWAVE v1 task order

Work in this sequence; check off each before moving on:

1. [ ] **Spec** — `docs/design-systems/RETROWAVE.md` (done)
2. [ ] **Tokens** — `[data-theme="retrowave"]` variable block in `globals.css`
3. [ ] **Scene** — `scene-retrowave.tsx`: starfield, pixel sun + scanlines, perspective grid
4. [ ] **Theme plumbing** — `src/lib/theme.ts`, layout attribute, dev picker in header
5. [ ] **Dev style guide page** — `/dev/themes/retrowave` with glass breakdown cards (typography, glitch, chrome)
6. [ ] **Nav + shell** — retrowave glass nav, neon accents
7. [ ] **Board** — cards, shortcuts, chips, skeleton shimmer
8. [ ] **Scrolling mode** — stage palette, controls, skeletons
9. [ ] **Motion pass** — reduced-motion fallbacks
10. [ ] **Cross-check** — mobile board, mobile + desktop scrolling mode, embed cards
11. [ ] **User review on localhost** — do not push until approved

---

## Future styles (template)

For each new style, create `docs/design-systems/<NAME>.md` with:

- [ ] Positioning vs Frutiger
- [ ] Scene / background stack diagram
- [ ] Color tokens mapped to shadcn slots
- [ ] Typography (fonts + rules)
- [ ] Surface language (cards, buttons, chips)
- [ ] Component mapping table
- [ ] Motion + a11y
- [ ] Acceptance criteria
- [ ] Add id to theme union + picker dropdown option

---

## Testing checklist (every theme)

### Board (mobile + desktop)
- [ ] First paint shows theme background (no prolonged black)
- [ ] Video cards: poster visible, skeleton clears
- [ ] Image cards load
- [ ] Embed cards: placeholder → skeleton → iframe without scroll jump
- [ ] Filter tabs work; pinned order intact
- [ ] Tap card → detail page

### Scrolling mode (mobile + desktop)
- [ ] Open launcher; snap between reels
- [ ] Landscape media: controls at screen bottom
- [ ] Video plays; poster → video transition
- [ ] Close overlay restores scroll position
- [ ] Reopen launcher works

### Theme switcher (localhost)
- [ ] Switch Frutiger ↔ RETROWAVE without hard refresh
- [ ] Choice persists across reload
- [ ] Production build without picker env var hides dropdown

### Accessibility
- [ ] Text contrast on glass panels
- [ ] Focus visible on interactive elements
- [ ] `prefers-reduced-motion` reduces animations

---

## Git & deploy

- [ ] Localhost-only features gated by env / `NODE_ENV`
- [ ] Run `npm run build` before handoff
- [ ] Commit only when user requests; never force-push `main`
- [ ] Warn if `.env` secrets would be committed

---

## Anti-patterns (learned this session)

| Don’t | Do instead |
| --- | --- |
| Mount live iframes on board immediately | Deferred `BoardEmbedPreview` |
| Rely on `onLoad` alone for cached posters | `useLayoutEffect` + complete probe |
| `loading="lazy"` on above-fold reel posters | `eager` + preload adjacent |
| Put scrolling metadata inside media frame | Sibling on full `100dvh` slide |
| Container-query letterbox without fallback | Full-stage `object-contain` |
| Kill/restart GSAP morph tween every frame | Single `quickTo` on ticker |
| iOS `touch-none` on reels overlay wrapper | `overflow-hidden`; scroll on inner container |
| Stack two smoothers for bubble cursor | One morph pipeline |
| Theme only the homepage | Board + scrolling mode + dialogs together |

---

## Quick file map

| Area | Files |
| --- | --- |
| Frutiger spec | `DESIGN.md` |
| RETROWAVE spec | `docs/design-systems/RETROWAVE.md` |
| Art Deco spec | `docs/design-systems/CAPITOLINI.md` |
| Global CSS | `src/app/globals.css` |
| Layout / fonts | `src/app/layout.tsx` |
| Header | `src/components/layout/site-chrome.tsx` |
| Scene | `src/components/aero/scene.tsx`, `scene-retrowave.tsx`, `scene-art-deco.tsx` |
| Board | `src/components/portfolio/board.tsx`, `project-card.tsx`, `masonry-grid.tsx` |
| Media | `cover-art.tsx`, `hover-video-preview.tsx`, `media-skeleton.tsx` |
| Embeds | `board-embed-preview.tsx`, `project-embed.tsx` |
| Scrolling mode | `src/components/portfolio/scrolling-mode/*` |
| Portfolio data | `src/lib/portfolio.ts`, `src/lib/drop.ts` |

---

## Definition of done (per style)

- [ ] Spec doc written
- [ ] Theme selectable on localhost
- [ ] All surfaces in checklist re-skinned
- [ ] No media loading regressions
- [ ] Build passes
- [ ] User sign-off before production deploy

---

## CAPITOLINI (Art Deco) — task order

**Status:** Implemented on localhost — do not push until user approves.

1. Tokens — `src/app/themes/art-deco.css`
2. Scene — `src/components/aero/scene-art-deco.tsx`
3. Plumbing — `src/lib/theme.ts`, `layout.tsx`, `theme-scene.tsx`, `themed-cursor.tsx`
4. Dev style guide — `/dev/themes/art-deco`
5. Board hooks — `board-hero-name`, `board-hero-eyebrow`, `cap-chevron-divider`
6. Scrolling mode — `reels-slide-title`; hide hero music via `.hero-theme-music`
7. Mobile pass — no backdrop-filter, static sunburst on coarse pointer
8. Build + localhost QA (Frutiger / Retrowave / Art Deco switcher)
