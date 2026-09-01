# Design system — CAPITOLINI (Classical × Art Deco Golden Age)

**Status:** Spec locked — ready for **localhost-only** implementation. Default production theme remains **Frutiger Aero** (`DESIGN.md`). Do **not** push to GitHub until explicit user approval.

Follow the same rollout path as RETROWAVE: tokens → scene → theme plumbing → board → scrolling mode → perfect on localhost.

---

## Locked decisions (sign-off)

| Decision | Choice |
| --- | --- |
| Theme picker label | **Art Deco** |
| Theme id / `data-theme` | **`art-deco`** |
| Internal codename | **CAPITOLINI** (this doc, file names in comments) |
| Script typography | **Pinyon Script** on hero name and related editorial accents (board hero, scrolling mode titles, style guide specimens) |
| Column vignettes | **All breakpoints** — present on mobile, tuned for performance (see Scene §1) |
| Palette | **Gold / charcoal / ivory only** — no burgundy, emerald, or jewel accents |
| Deploy | **Localhost only** until perfected and approved |

---

## Naming note

You described this as “medieval art style,” but the references, keywords, and mood boards point to **Classical antiquity + 1920s Art Deco “old money”** — museum marble, Roman inscriptions, Gatsby brass, symmetric geometry — **not** Gothic medieval (illuminated manuscripts, blackletter, castle stonework).

**CAPITOLINI** is the internal codename (after the Greco-Roman museum mock). Users see **Art Deco** in the theme picker.

Voice stays the same across all themes: creative marketer with receipts. Only the **skin** changes.

---

## Positioning

| Frutiger Aero (default) | RETROWAVE | Art Deco (CAPITOLINI) |
| --- | --- | --- |
| Daylight meadow, dew, gel | Midnight neon highway | Gallery at night — marble, brass, torchlight |
| Frosted Vista glass | Dark glass + cyan glow | Charcoal vault + **gold hairlines** |
| Soft pills, rounded cards | Synth radii, mono labels | **Sharp geometry**, symmetric frames |
| Quicksand / Nunito | Orbitron / Rajdhani | **Cinzel / Cormorant** — inscription + editorial |
| Playful lift on hover | Neon pulse | Subtle gold brighten; no bounce |

If a screen reads like a generic dark SaaS dashboard, a crypto landing page, or a Halloween “gothic” site, it is wrong. Push toward **symmetry**, **thin brass rules**, **serif display type**, and **museum restraint**.

---

## Reference mood (from inspiration set)

1. **Capitolini museum landing** — fluted columns frame a charcoal UI; ivory statue hero; gold-outlined video/tour cards; small-caps nav; social links as text (`IG | FB | TW`).
2. **Anna Gariboldi luxury editorial** — charcoal photography; **gold Pinyon Script** name over serif caps; symmetric benefit grid; ghost CTA `{ ALL MY PRODUCTS }`. *(Layout reference only — burgundy palette excluded per locked palette.)*
3. **Moscow Art Deco Museum rebrand** — Greta Deco display + Alegreya body; **sunburst fan** behind hero title; thin double frames; horizontal exhibition “rooms.” *(Geometry reference — umber/brown bands map to charcoal variants, not separate accent colors.)*

Synthesis for this portfolio: **dark gallery mode** (Capitolini + Moscow geometry) with **Pinyon Script editorial accents** on hero and key titles.

---

## Scene composition (background stack)

Layers bottom → top. All decorative; `pointer-events: none`.

```
┌────────────────────────────────────────────────────────────┐
│  ▌▌▌  column shafts (left/right vignette)  ▌▌▌             │  z: 0
│       repeating-conic sunburst (center-top, 8–12% opacity) │  z: 1
│  ─ ─ ─  brass grid / vertical rules (symmetric)  ─ ─ ─     │  z: 2
│  ▔▔▔▔▔  chevron divider band at ~72% (optional)  ▔▔▔▔▔     │  z: 3
│  radial vignette: transparent → #050507 at edges         │  z: 4
└────────────────────────────────────────────────────────────┘
│  [ nav / cards / content on charcoal panels ]              │  z: 10+
```

### 1. Vault base
- Solid `#050507` (not pure `#000`)
- Optional radial: `ellipse 120% 80% at 50% 0%, #0d1520 0%, #050507 55%`
- No photography textures; keep CSS/SVG vector

### 2. Column vignette (Greco-Roman) — all breakpoints
- Two fixed pseudo-columns at `left: 0` / `right: 0`
- **Desktop:** ~18vw wide, max ~220px; flute lines at 4% ivory opacity; optional Ionic volute SVG at column top (6% opacity)
- **Mobile:** ~12vw wide, max ~72px; flute lines at **2.5%** opacity; **omit volute SVG** (fewer layers); no animation
- Flute lines: `repeating-linear-gradient(90deg, transparent 0 8px, rgb(242 230 207 / 0.04) 8px 9px)` — reduce opacity on coarse pointers
- Fade to transparent toward center — **frame the content**, don’t compete with cards
- Must not trigger horizontal overflow or extra compositor cost on iOS (pure CSS gradients only)

### 3. Sunburst / fan motif
- Behind hero / top third only
- `repeating-conic-gradient(from 0deg, rgb(241 201 112 / 0.07) 0deg 9deg, transparent 9deg 18deg)`
- Mask: `radial-gradient(circle at 50% 100%, black 15%, transparent 65%)`
- Static on mobile; slow 120s rotation optional on desktop if `prefers-reduced-motion: no-preference`

### 4. Brass grid
- Full-viewport thin rules: `1px solid rgb(212 175 55 / 0.12)`
- Vertical lines at `25%`, `50%`, `75%`; horizontal at `33%`, `66%` — **symmetric**
- Center content column sits inside middle third; grid extends into margins like architectural blueprint

### 5. Chevron band (footer atmosphere)
- Bottom 20vh: repeating chevrons via SVG pattern or `repeating-linear-gradient(135deg, …)`
- Gold at 5–8% opacity — subtle, not zebra-stripe

**Implementation target:** `src/components/aero/scene-art-deco.tsx` (new), swapped when `data-theme="art-deco"`.

---

## Color tokens

Proposed override when `[data-theme="art-deco"]`:

| Token | Value | Use |
| --- | --- | --- |
| `--cap-bg-deep` | `#050507` | Page base, vault |
| `--cap-bg-panel` | `#0a0e14` | Cards, nav shell |
| `--cap-bg-charcoal` | `#0d1118` | Alternate section band (charcoal step, not umber) |
| `--cap-gold` | `#d4af37` | Primary accent — rules, icons, eyebrows |
| `--cap-gold-bright` | `#f1c970` | Hover, sunburst, display highlights |
| `--cap-gold-dark` | `#8c7348` | Bronze shadow edge, pressed states |
| `--cap-brass` | `#c5a572` | Metallic mid-tone, borders |
| `--cap-ivory` | `#f2e6cf` | Primary text on dark |
| `--cap-ivory-muted` | `#c9baa0` | Secondary body |
| `--cap-stone` | `#e8dcc8` | Column / statue highlights |
| `--foreground` | `#f2e6cf` | Body |
| `--muted-foreground` | `#9a8b76` | Meta, captions |
| `--primary` | `#d4af37` | CTAs, focus |
| `--primary-foreground` | `#050507` | Text on gold fill |
| `--card` | `rgb(10 14 20 / 0.92)` | Panel fill |
| `--border` | `rgb(212 175 55 / 0.28)` | Hairlines |
| `--ring` | `#f1c970` | Focus |

Map into existing shadcn slots (`--background`, `--card`, `--primary`, …) so primitives re-theme without forks.

**Gold usage rule:** Gold is **structure**, not fill. Prefer 1px borders, underline rules, icon strokes, and small caps labels. Filled gold buttons are rare — one primary CTA per viewport max.

**Palette lock:** Only gold, charcoal, and ivory family tokens above. No burgundy, emerald, ruby, or jewel tones in UI.

**Forbidden:** Frutiger sky/lime, Retrowave magenta/cyan, purple SaaS gradients, pure `#000` backgrounds, heavy drop shadows, bubbly `rounded-full` everything, emoji UI, neon glow.

---

## Typography

| Role | Face (Google Fonts) | Notes |
| --- | --- | --- |
| Display / H1 | **Cinzel Decorative** | Roman inscription energy; use at 2.5rem+ only |
| Headings H2–H4 | **Cinzel** | Small caps optional; tracking `0.08em–0.14em` |
| Body | **Cormorant Garamond** | 18px / 1.65; max ~68ch; elegant but readable |
| Art Deco accent (labels) | **Poiret One** | Section eyebrows, “GALLERY · TOURS” style nav caps |
| Hero script | **Pinyon Script** | Board hero name, hero tagline accent, scrolling mode slide titles, dev style guide display specimens — gold gradient clip |
| Mono / metadata | **JetBrains Mono** | Years, durations, `{ ORDER NOW }` brackets |

**Unavailable in Google Fonts:** Greta Deco (Moscow mock) → substitute **Poiret One** or **Italiana** for geometric deco display.

### Rules
- H1: uppercase or title case; never all three font families on one line
- Eyebrows: Poiret One or Cinzel, 11px, `letter-spacing: 0.28em`, uppercase, `--cap-gold`
- Body: `--cap-ivory`, not pure white
- Links: ivory + gold underline on hover; no blue defaults
- Numeric/tabular: JetBrains Mono for chip counts, reel timestamps

Load via `next/font/google` when theme active (same pattern as Retrowave fonts in `layout.tsx`).

---

## Spacing & layout

Symmetric **8px grid**; content centered on axis.

| Area | Value |
| --- | --- |
| Page column | `max-w-[90rem]`, `px-4` / `sm:px-6` (match board + header) |
| Board section | `pt-10 sm:pt-14` |
| Card inner | `1.25rem` / `sm:1.5rem` |
| Masonry gap | `1rem` |
| Header | sticky; full-width bar with inner symmetric nav |
| Vertical rules | Optional `1px` gold lines flanking main column at `lg+` |

**Layout discipline:** Prefer **centered symmetry** over Masonry asymmetry for CAPITOLINI-specific hero bands; keep existing Masonry for portfolio grid (content structure unchanged) but skin cards as framed “plinths.”

---

## Radii

Art Deco digital = **sharp or slightly softened**, not pills.

| Surface | Radius |
| --- | --- |
| Nav bar | `0.5rem` mobile → `0` or `0.25rem` desktop (rectangular bar) |
| Primary buttons | `0` or `0.25rem` — **ghost gold outline** default |
| Cards / panels | `0.375rem`–`0.5rem` max |
| Chips | `0.25rem` or square |
| Media frames | `0` with 1px gold inset border |
| Icon buttons | Square `0.25rem`, not circles |

---

## Borders, shadows & metallic effects

| Name | Definition |
| --- | --- |
| `--cap-border-hairline` | `1px solid rgb(212 175 55 / 0.35)` |
| `--cap-border-brass` | `1px solid rgb(197 165 114 / 0.55)` |
| `--cap-gradient-gold` | `linear-gradient(135deg, #f1c970 0%, #d4af37 38%, #8c7348 72%, #d4af37 100%)` |
| `--cap-shadow-gold` | `0 0 24px rgb(212 175 55 / 0.12)` — decorative only |
| `--cap-frame-double` | outer hairline + 4px gap + inner hairline (CSS `box-shadow` inset) |

**Shadows:** Avoid Aero frost stacks. Elevation = **brighter gold border**, not blur.

**Corner ornaments (optional):** L-shaped SVG brackets at card corners (Capitolini video cards) — 12×12px, gold, opacity 0.6.

---

## Surface language

### Vault panel (`.cap-panel`)
- Fill: `rgb(10 14 20 / 0.92)`
- Border: `var(--cap-border-hairline)`
- **No** backdrop-filter on mobile (performance); solid fill
- Desktop: optional `blur(8px)` at low saturation — test on device first
- Top edge: `inset 0 1px 0 rgb(242 230 207 / 0.06)`

### Brass ghost button (`.cap-ghost-btn`)
- Transparent fill, 1px gold border, ivory text
- Hover: `background: rgb(212 175 55 / 0.08)`, border brightens
- Label style: `{ SAY HELLO }` brackets optional on primary CTA

### Gold filled CTA (`.cap-gold-btn`) — sparingly
- Background: `var(--cap-gradient-gold)`
- Text: `#050507`
- Hover: brightness 1.05, no translate lift

### Editorial script accent (`.cap-script-name`)
- Pinyon Script on: board hero `{profile.name}`, optional hero subline, scrolling mode project titles, one dev style guide specimen
- `background: var(--cap-gradient-gold); -webkit-background-clip: text; color: transparent`
- Do not use on nav links, chip labels, or body paragraphs

### Chevron divider (`.cap-chevron-rule`)
- 48px band, repeating chevron SVG, gold at 0.15 opacity
- Between major sections (board header → filters)

---

## Motifs library (CSS / SVG)

| Motif | Implementation | Use |
| --- | --- | --- |
| Sunburst | `repeating-conic-gradient` + radial mask | Hero background |
| Chevron | SVG `<pattern>` or CSS gradient | Section dividers |
| Fan | SVG path, half-circle rays | Theme switcher icon backdrop |
| Column flute | `repeating-linear-gradient` | Scene side vignettes |
| Laurel / meander | Inline SVG 1px stroke | Chip corner, card ornament |
| Double frame | Nested `border` + `outline-offset` | Featured project card |
| Star/spark | 8-point SVG, 6px | Accent near eyebrows (Moscow mock) |

All motifs: **vector only** — no large PNG textures. Target **≤ 4KB SVG** per ornament.

---

## Component mapping (Frutiger → CAPITOLINI)

| Component | Frutiger | CAPITOLINI |
| --- | --- | --- |
| Scene | `AeroScene` | `ArtDecoScene` (columns + sunburst + grid) |
| Nav | `.glass-shell` pill | `.cap-panel` rectangular bar, hairline bottom gold rule |
| Project card | `.glass-panel` | Vault panel + gold frame; hover = border brighten |
| Filter shortcuts | `.aero-shortcut` colored tiles | Square brass-outline tiles; symmetric 2×2 mobile grid |
| Chips | Gel tones | Dark chip + gold left stripe + Cinzel caps |
| Buttons | `.gel-surface` | `.cap-ghost-btn` / rare `.cap-gold-btn` |
| Hero music | CD spin | **Hidden** or replaced with laurel medallion (no anachronism) |
| Reels stage | Sky gradient | `--cap-bg-charcoal` vault + subtle grid |
| Cursor | Bubble / tubes | **Default system cursor** — luxury editorial, no gimmick |
| Skeleton | White shimmer | Charcoal base + gold shimmer at 8% opacity |

Scrolling mode and board **must** both re-skin.

---

## Lucide & icons

- Keep `lucide-react`; stroke **1.5–1.75** ( finer than Aero )
- Color: `currentColor` → gold on hover
- Brand icons: unchanged outline marks
- Nav icons: optional `{ }` bracket wrappers instead of heavy icon buttons on mobile

---

## Motion

| Effect | Duration | Easing | Reduced motion |
| --- | --- | --- | --- |
| Sunburst drift | 120s | linear | **off** / static |
| Gold border hover | 180ms | ease-out | border only |
| Card hover | 200ms | ease-out | no scale transform |
| Script name shimmer | 6s | ease-in-out | **off** |
| Skeleton shimmer | 1.4s | ease-in-out | static fill |
| Scene parallax | n/a | — | **disabled** — performance |

**Mobile policy (from RETROWAVE learnings):**
- No continuous canvas RAF loops
- No backdrop-filter on sticky nav
- Scene motifs static on `(pointer: coarse)`
- Prefetch/decode rules unchanged from global performance pass

---

## Showcase / dev style guide

Route suggestion: `/dev/themes/art-deco` (localhost guard).

Cards demonstrating:
- Typography stack (Cinzel Decorative H1, Cormorant body, Poiret eyebrow)
- Gold hairline grid
- Sunburst + chevron samples
- Button states (ghost / filled)
- Chip + panel specimens
- Color swatches with hex

Each specimen: `.cap-panel` + mono label `{ SPECIMEN }`.

---

## Theme activation (localhost)

```html
<html data-theme="art-deco" lang="en">
```

```css
[data-theme="art-deco"] { /* token overrides */ }
[data-theme="art-deco"] .sky-meadow,
[data-theme="art-deco"] .rw-scene { display: none; }
[data-theme="art-deco"] .cap-scene { display: block; }
```

Theme picker: add **Art Deco** option alongside Frutiger Aero / Retrowave in `ThemeSwitcher`; persist to `localStorage` key `portfolio-theme`.

Update `src/lib/theme.ts`:

```ts
export const themes = ["frutiger", "retrowave", "art-deco"] as const;

export const themeLabels = {
  frutiger: "Frutiger Aero",
  retrowave: "Retrowave",
  "art-deco": "Art Deco",
} as const;
```

---

## Accessibility

- Body text: `#f2e6cf` on `#0a0e14` ≥ **7:1** (target AAA for body)
- Gold `#d4af37` on charcoal for **large text / UI chrome only** — verify ≥ 3:1; do not use gold for small body copy
- Focus: 2px solid `#f1c970`, offset 2px
- `prefers-reduced-motion`: static sunburst, no shimmer
- Touch targets: ≥ 44px — square ghost buttons on mobile
- Scrolling mode: retain safe-area + coarse-pointer solid control fallbacks

---

## Performance constraints (non-negotiable)

Carry forward from mobile optimization work:

- Scene = **CSS/SVG only** — no WebGL, no full-screen canvas animation
- Sticky header = **solid panel** on coarse pointers
- Board videos = poster-only on touch; hover preview desktop-only
- Scrolling mode = **active slide video only**
- Theme fonts loaded only when selected (split Retrowave + Capitolini font bundles)
- Decorative SVGs optimized / rasterized at display size before commit

---

## File checklist (when implementing)

| File | Action |
| --- | --- |
| `docs/design-systems/CAPITOLINI.md` | This spec |
| `docs/STYLE-VARIANT-SCRATCHPAD.md` | Add CAPITOLINI task order section |
| `src/lib/theme.ts` | Add `art-deco` to theme union; label `"Art Deco"` |
| `src/components/aero/scene-art-deco.tsx` | Background scene |
| `src/app/themes/art-deco.css` | Token overrides + utilities (separate file like Retrowave) |
| `src/app/layout.tsx` | Conditional fonts (incl. Pinyon Script) + theme init |
| `src/components/theme/theme-scene.tsx` | Swap scene branch |
| `src/components/theme/theme-switcher.tsx` | Third theme option: **Art Deco** |
| `src/app/dev/themes/art-deco/page.tsx` | Living style guide (dev only) |

---

## Implementation task order (after spec lock)

1. **Tokens** — `[data-theme="art-deco"]` in `art-deco.css`
2. **Scene** — columns (all breakpoints, mobile-tuned), sunburst, brass grid (static on coarse pointer)
3. **Theme plumbing** — union type, picker label **Art Deco**, scene swap
4. **Dev style guide** — `/dev/themes/art-deco`
5. **Nav + shell** — rectangular vault bar, ghost links
6. **Board** — framed cards, chips, chevron divider, **Pinyon Script** hero name
7. **Scrolling mode** — charcoal vault stage, gold controls, script slide titles
8. **Motion + reduced-motion pass**
9. **Mobile performance pass** — no backdrop-filter, no RAF, column vignettes lightweight
10. **Perfect on localhost** — no GitHub push until user approves

---

## Acceptance criteria (CAPITOLINI v1)

- [ ] Charcoal vault + gold grid visible on first paint (no flash of Frutiger/Retrowave)
- [ ] Typography reads luxury/editorial at mobile and desktop
- [ ] Nav uses full content width; no clipped CTAs on 320px viewport
- [ ] Board cards framed with hairline gold; video posters still load correctly
- [ ] Scrolling mode matches palette; controls tappable on iOS
- [ ] Frutiger + Retrowave unchanged when `data-theme` absent
- [ ] No continuous animation on mobile; Lighthouse mobile not regressed vs post-optimization baseline
- [ ] `prefers-reduced-motion` honored

---

## Reference links (research)

- [Art Deco — designmd.app](https://designmd.app/library/art-deco) — jet black, gold `#D4AF37`, ivory, Cinzel pairing
- [Art Deco Golden Age — designmd.app](https://designmd.app/library/art-deco-golden-age) — symmetry, chevrons, sunbursts, no pure black
- [Franco Maria Ricci / Refero](https://styles.refero.design/style/6120469b-a1c8-46d3-b7fd-8aa6dc22c0d9) — Bodoni editorial, gold as punctuation not fill
- [Cinzel / Cinzel Decorative — Google Fonts](https://fonts.google.com/specimen/Cinzel) — Roman inscription source
- [Cormorant Garamond — Google Fonts](https://fonts.google.com/specimen/Cormorant+Garamond) — luxury body
- [Poiret One — Google Fonts](https://fonts.google.com/specimen/Poiret+One) — geometric deco display
- CSS sunburst: `repeating-conic-gradient` (see MDN / Stack Overflow patterns)
- Inspiration images: user mood board (Capitolini museum, Anna Gariboldi, Moscow Art Deco Museum)

---

## Sign-off

All open questions resolved. Spec is **locked** for localhost implementation. Next step: begin task order §Implementation (tokens → scene → plumbing).
