# Design system — RETROWAVE (Outrun / Synthwave)

**Status:** Spec only — localhost experimentation. Default production theme remains **Frutiger Aero** (`DESIGN.md`).

RETROWAVE is late-1980s outrun: a night drive through a digital horizon. Deep space above, neon grid below, a pixel sun on the line. UI floats above it in dark glass — readable, sleek, never muddy SaaS purple.

If a screen reads like a generic “dark mode dashboard” or a 2024 AI landing page, it is wrong. Push it toward **magenta + cyan**, **scanlines**, **chrome**, and **horizon geometry**.

---

## Positioning

| Frutiger Aero (default) | RETROWAVE |
| --- | --- |
| Daylight, dew, meadow | Midnight, neon, highway |
| Vista glass + gel buttons | Dark glass + neon edges |
| Quicksand / Nunito | Display synth + mono accents |
| Sky → lime gradient | Starfield + grid + sunset |
| Soft lift on hover | Glow pulse, subtle glitch on accent |

Voice stays the same: creative marketer with receipts. Cards still lead with craft; contribution chips stay visible. Only the **skin** changes.

---

## Scene composition (background stack)

Layers bottom → top. All decorative; pointer-events none.

```
┌──────────────────────────────────────────────┐
│  ★ ★ ★  starfield (parallax optional)   ★ ★  │  z: 0
│                                              │
│         ╱╲  pixel sunset + scanlines         │  z: 1  (horizon ~62%)
│        ╱  ╲  horizontal color bands        │
│  ─────────────────────────────────────────   │  z: 2  horizon line
│  ╱╲╱╲╱╲╱╲  perspective wireframe grid      │  z: 3
│ ╱╲╱╲╱╲╱╲╱╲  cyan + magenta glow on lines    │
└──────────────────────────────────────────────┘
│  [ glass cards / nav / content ]             │  z: 10+
```

### 1. Starfield
- Base: `#060812` → `#0a0e1a` radial vignette at edges
- Stars: 1–2px dots, white at 40–90% opacity, sparse + clustered
- Optional: two parallax layers (slow drift, 60s / 120s loop)
- No milky-way photo textures; keep it **vector/CSS** or tiny SVG tile

### 2. Pixel sunset
- Giant disc/strata sitting **on** the horizon (not centered in viewport)
- Bands top → bottom: `#ff6ec7` → `#ff2d95` → `#ff6b35` → `#ffb347` → `#ffe066`
- **Pixelation:** `image-rendering: pixelated` on a low-res gradient or stepped `linear-gradient` with hard stops every 4–8%
- **Scanlines:** repeating `linear-gradient` overlay, 2px pitch, `rgba(0,0,0,0.35)` / transparent
- Subtle horizontal **VHS wobble** on the sun only (1–2px `@keyframes`, 4–6s, optional)

### 3. Neon grid floor
- Single-point perspective from horizon center (~50% 62%)
- Line color: cyan `#00f0ff` at 70% opacity + magenta `#ff00aa` at 30% on alternate lines
- Glow: `box-shadow` / `filter: drop-shadow(0 0 6px currentColor)` on grid SVG or CSS gradients
- Floor fades to black below fold; grid density increases toward horizon (classic outrun)

### 4. Atmosphere
- Horizon haze: `linear-gradient` transparent → `rgba(255, 46, 149, 0.15)` at sunset base
- Optional chrome sun **reflection** streak on grid (thin white→transparent vertical band)

**Implementation target:** `src/components/aero/scene-retrowave.tsx` (new), swapped when `data-theme="retrowave"` on `<html>`.

---

## Color tokens

Proposed `:root` override when `[data-theme="retrowave"]`:

| Token | Value | Use |
| --- | --- | --- |
| `--rw-bg-deep` | `#060812` | Page base, letterbox |
| `--rw-bg-mid` | `#0f1428` | Panels, scrims |
| `--rw-cyan` | `#00f0ff` | Primary neon, links, grid |
| `--rw-cyan-dim` | `#00a8b8` | Muted UI, borders |
| `--rw-magenta` | `#ff2d95` | Secondary neon, accents |
| `--rw-magenta-hot` | `#ff6ec7` | Sun top, hover glow |
| `--rw-orange` | `#ff6b35` | Sunset mid |
| `--rw-gold` | `#ffe066` | Sunset base, highlights |
| `--rw-chrome` | `#c0d0e8` | Metallic text accents |
| `--rw-chrome-dark` | `#6a7a9a` | Chrome shadow edge |
| `--foreground` | `#e8f4ff` | Body text (cool white) |
| `--muted-foreground` | `#8ba3c7` | Secondary text |
| `--primary` | `#00f0ff` | CTAs, focus rings |
| `--primary-foreground` | `#060812` | Text on cyan fill |
| `--secondary` | `#ff2d95` | Alt CTAs |
| `--card` | `rgb(8 12 28 / 0.55)` | Glass card fill |
| `--border` | `rgb(0 240 255 / 0.22)` | Neon hairlines |
| `--ring` | `#00f0ff` | Focus |

Map into existing shadcn slots (`--background`, `--card`, `--primary`, …) so primitives re-theme without forked components.

**Forbidden:** Frutiger sky/lime, white frost at 58% opacity, purple `#6366f1` SaaS gradients, flat `#111` cards with no glow.

---

## Typography

| Role | Face (proposed) | Notes |
| --- | --- | --- |
| Display / headings | **Orbitron** or **Audiowide** | Wide, synthetic, 80s sport |
| Body | **Rajdhani** or **Exo 2** | Readable at 16px on dark glass |
| Mono / labels | **Share Tech Mono** | Eyebrows, timestamps, “SYS” labels |
| Pixel accent (optional) | **Press Start 2P** | Sparingly — chip size only |

Rules:
- Headings: uppercase optional on H1 only; letter-spacing `0.06em`–`0.12em` on display
- Body: 16px / 1.65, `#e8f4ff`, not pure `#fff` (reduces bloom fatigue)
- Eyebrows: mono, 11px, `#00f0ff`, tracking `0.28em`, uppercase
- **Neon type:** `text-shadow: 0 0 8px var(--rw-cyan), 0 0 24px var(--rw-cyan)` on headings only — not on paragraphs

Load via `next/font/google` only when theme active, or preload both and swap CSS variables.

---

## Spacing & layout

Reuse Frutiger rhythm (8px grid) so masonry and reels layout do not fork:

| Area | Value |
| --- | --- |
| Page column | `max-w-6xl`, `px-4` / `sm:px-6` |
| Board section | `pt-10 sm:pt-14` |
| Card inner | `1rem` |
| Masonry gap | `1rem` |
| Header | sticky, floating pill nav |

RETROWAVE may use **slightly sharper** card radius (`1.25rem`) vs Aero pills — document per component below.

---

## Radii

| Surface | Radius |
| --- | --- |
| Nav bar | `rounded-full` (keep) |
| Primary buttons | `rounded-full` or `rounded-lg` (8px) for sharper synth look |
| Cards / panels | `1.25rem`–`1.5rem` |
| Chips | `rounded-md` (6px) or pixel `rounded-none` for “badge” variant |
| Icon lenses | `rounded-lg` with 1px neon border |

---

## Shadows & glow

| Name | Definition |
| --- | --- |
| `--shadow-neon-cyan` | `0 0 12px rgb(0 240 255 / 0.45), 0 0 32px rgb(0 240 255 / 0.2)` |
| `--shadow-neon-magenta` | `0 0 12px rgb(255 45 149 / 0.45), 0 0 32px rgb(255 45 149 / 0.2)` |
| `--shadow-glass-dark` | `0 8px 32px rgb(0 0 0 / 0.5), inset 0 1px 0 rgb(255 255 255 / 0.08)` |

Hover: increase glow spread +1 step; **no** Aero `-translate-y-1` gel lift unless combined with subtle glow pulse.

---

## Surface language

### Dark glass card (`.rw-glass-panel`)
- Fill: `rgb(8 12 28 / 0.55)`
- Backdrop: `blur(20px) saturate(1.4)`
- Border: `1px solid rgb(0 240 255 / 0.25)`
- Inner highlight: top edge `inset 0 1px 0 rgb(255 255 255 / 0.06)`
- Use for: project cards, nav shell, dialogs, style-doc showcase blocks

### Neon outline button (`.rw-neon-btn`)
- Transparent fill, 1px cyan border, cyan text
- Hover: fill `rgb(0 240 255 / 0.12)`, glow shadow
- Primary filled variant: cyan bg, dark text

### Chrome strip (`.rw-chrome`)
- `linear-gradient(180deg, #e8f0ff 0%, #8898b8 45%, #c0d0e8 55%, #506080 100%)`
- `-webkit-background-clip: text` for headings or divider bars
- Use on rules, section dividers, or “RETROWAVE” wordmark — not body copy

### VHS glitch (`.rw-glitch` — accent only)
- Pseudo-element duplicate text, offset 1–2px magenta/cyan
- Trigger: hover on title or theme toggle, **&lt; 300ms**, respect `prefers-reduced-motion`
- Optional scanline overlay on card hover at 5% opacity

---

## Component mapping (Frutiger → RETROWAVE)

| Component | Frutiger class / pattern | RETROWAVE equivalent |
| --- | --- | --- |
| Scene | `AeroScene`, `.sky-meadow` | `RetrowaveScene` (starfield + sun + grid) |
| Nav | `.glass-shell` | `.rw-glass-panel` + neon bottom border |
| Project card | `.glass-panel` Card | Dark glass + cyan hairline + neon title glow |
| Filter shortcuts | `.aero-shortcut` colored tiles | Neon-outlined tiles, magenta/cyan pairs |
| Chips | `.aero-intake-chip`, gel tones | Dark chip + mono label + colored left stripe |
| Buttons | `.gel-surface` | `.rw-neon-btn` or filled cyan |
| Reels stage | `.reels-stage-bg` gradient | Same geometry, retrowave palette + grid behind media |
| Bubble cursor | Desktop liquid glass | **Disable** or replace with crosshair neon dot |
| Skeleton | `.media-skeleton-*` | Dark base + magenta shimmer (not white) |

Scrolling mode and board **must** both re-skin; do not ship RETROWAVE on board only.

---

## Lucide & icons

- Keep `lucide-react`; stroke **1.8–2**
- Color: `currentColor` inheriting cyan or chrome
- Brand icons: keep `src/lib/brand-icons.tsx` outline marks
- Optional: add thin neon `filter: drop-shadow` on nav icons only

---

## Motion

| Effect | Duration | Easing | Reduced motion |
| --- | --- | --- | --- |
| Star drift | 60–120s | linear | off |
| Grid pulse (opacity) | 3s | ease-in-out | off |
| Sun scanline scroll | 8s | linear | off |
| Glitch | 200–280ms | steps(2) | **off** |
| Card hover glow | 200ms | ease-out | simplify to border only |
| Skeleton shimmer | 1.1s | ease-in-out | static fill |

---

## Showcase / documentation UI

For localhost style preview pages, use **glass cards breaking down the system**:

```
┌─────────────────────────────────────┐
│  NEON TYPOGRAPHY                    │
│  Orbitron H1 + cyan glow            │
│  ─────────────────────────────────  │
│  Body on dark glass, readable...    │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  VHS GLITCH                         │
│  Demo title with .rw-glitch         │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  CHROME TEXTURES                    │
│  .rw-chrome divider + sample        │
└─────────────────────────────────────┘
```

Each card: `.rw-glass-panel`, eyebrow mono label, short spec copy. Page route suggestion: `/dev/themes/retrowave` (localhost guard).

---

## Theme activation (localhost)

```html
<html data-theme="retrowave" lang="en">
```

CSS:

```css
[data-theme="retrowave"] {
  /* token overrides */
}
[data-theme="retrowave"] .sky-meadow { /* hide */ }
[data-theme="retrowave"] .retrowave-scene { display: block; }
```

Default (no attribute or `data-theme="frutiger"`): existing Aero unchanged.

Style picker (future): top-right dropdown in `SiteHeader`, persists to `localStorage`, **only rendered when `process.env.NODE_ENV === 'development'`** or explicit `NEXT_PUBLIC_STYLE_PICKER=1`.

---

## Accessibility

- Body text contrast: `#e8f4ff` on `#0f1428` ≥ 4.5:1
- Neon glow is decorative; never rely on glow alone for state
- Focus rings: solid cyan 2px, offset 2px
- `prefers-reduced-motion`: disable star drift, glitch, scanline animation
- Scrolling mode: keep safe-area insets and coarse-pointer glass fallbacks from Aero

---

## File checklist (when implementing)

| File | Action |
| --- | --- |
| `docs/design-systems/RETROWAVE.md` | This spec |
| `src/components/aero/scene-retrowave.tsx` | Background scene |
| `src/app/globals.css` | `[data-theme="retrowave"]` tokens + utilities |
| `src/app/layout.tsx` | Theme attribute + conditional fonts |
| `src/components/layout/site-chrome.tsx` | Dev-only style dropdown |
| `src/lib/theme.ts` | Theme id union, localStorage helpers |
| `src/app/dev/themes/retrowave/page.tsx` | Living style guide (dev only) |

---

## Acceptance criteria (RETROWAVE v1)

- [ ] Starfield + grid + pixel sun visible on first paint (no black flash)
- [ ] Nav and cards use dark glass, readable text
- [ ] Board video posters load (skeleton clears — use cache-probe pattern)
- [ ] Scrolling mode stage matches palette; controls remain tappable on iOS
- [ ] Frutiger theme unchanged when `data-theme` absent
- [ ] Style picker visible on localhost only
- [ ] `prefers-reduced-motion` honored

---

## Reference mood

- Outrun / synthwave album covers (FM-84, The Midnight)
- 1986–1989 arcade title screens
- Tron grid floor + Miami Vice neon
- **Not:** vaporwave pastel statues, meme glitch spam, generic Cyberpunk 2077 yellow
