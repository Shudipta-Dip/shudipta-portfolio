# Design system — Frutiger Aero v1

This site is **not** generic glassmorphism. No purple meshes, no dark-navy SaaS, no Inter-on-zinc. The reference is late-2000s Aero: Windows Vista glass, Aqua buttons, dew, sky, and a meadow.

If a component starts looking like a 2024 AI landing page, it is wrong. Push it back toward cyan, lime, water, and gloss.

## Positioning

Voice: a creative marketer who still wants receipts. Cards lead with craft (film, UX, brand) and wear contribution chips so the data/product work is visible without turning the board into a case-study archive.

## Typography

| Role | Face | Why |
| --- | --- | --- |
| Display / headings | **Quicksand** (`--font-heading`) | Rounded geometric. Closer to Aero UI than Geist or Inter. |
| Body / UI | **Nunito** (`--font-sans`) | Humanist, slightly round, readable on frost panels. |
| Fallback | Segoe UI, Trebuchet MS | The actual Aero system faces. |

Rules:

- Headings: tracking `-0.03em`, semibold, tight leading
- Body: 16px / 1.6, teal-deep (`#0d3b4a`), not pure black
- Eyebrow labels: 11–12px, uppercase, wide tracking (`0.22em`), sky-deep
- Do not introduce Geist, Inter, or a serif “editorial” display

Loaded in `src/app/layout.tsx` via `next/font/google`. Mapped in `src/app/globals.css` `@theme inline`.

## Color

Named tokens in `:root` and `@theme`:

| Token | Hex / value | Use |
| --- | --- | --- |
| `--sky` | `#5ec8f0` | Sky, chips, highlights |
| `--sky-deep` | `#1e8fc2` | Links, eyebrows, gel edge |
| `--aqua` / `--water` | `#2ad4c9` / `#48cae4` | Water orbs, secondary gloss |
| `--lime` | `#a8e063` | Grass, lime gel |
| `--meadow` | `#7ed957` | Horizon, lime-gel edge |
| `--deep` / foreground | `#0d3b4a` | Text |
| `--primary` | `#1aa4d1` | Default gel |
| `--secondary` | `#c8f07a` | Lime gel |
| Frost fill | `rgb(255 255 255 / 0.58)` | Cards, nav, panels |

Background is a **sky-to-meadow** wash (`.sky-meadow`), not a flat page color: cyan sky, white horizon haze, lime grass. A pale sun, drifting cloud ellipses, and CSS hills sit in `AeroScene`.

Forbidden: violet, magenta, near-black glass, neon purple gradients.

## Spacing

- Page column: `max-w-6xl`, gutter `px-4` / `sm:px-6`
- Section padding: `py-10` board, `pt-10 lg:pt-16` hero
- Card inner: `--card-spacing` = `1rem` (16px)
- Chip gap: `1.5` (6px)
- Masonry column gap: `1rem`
- Header is sticky with `pt-3` so the pill nav floats in the sky

Prefer 8px rhythm. Do not collapse frost panels onto the viewport edge.

## Radii

Aero is pill-first.

| Surface | Radius |
| --- | --- |
| Buttons, chips, filters, icon buttons | `9999px` (`rounded-full`) |
| Cards / dialogs / frost panels | `1.75rem`–`2rem` |
| Nav bar | `rounded-full` |
| Orbs | `999px` |
| Tooltips | `rounded-full` |

`--radius` is `1.5rem`. shadcn radius scale is bumped so even `rounded-lg` tokens feel Aero.

## Shadows

Two named shadows:

- `--shadow-gel` — inner white lip, inner lower aqua occlude, outer cyan drop. This is the Aqua button.
- `--shadow-frost` — soft sky drop + 1px white inner edge. This is Vista glass.

Cards lift on hover (`-translate-y-1` + deeper frost shadow). No harsh black material shadows.

## Gloss language

- **Gel buttons** (`.gel-surface`, `.gel-lime`): vertical aqua/lime gradient, specular `::before` band, inner highlight, outer glow.
- **Frost glass** (`.glass-panel`): white translucent fill, `blur(22px)` + `saturate(1.65)`, white border.
- **Orbs** (`.orb`): radial specular at ~32% 28%, underside occlude, colored core. Never flat circles.
- **Caustics**: faint screen-blended spots over covers and the sky.

## Lucide

Library: `lucide-react`. Default stroke **2**. Sizes:

| Context | Size |
| --- | --- |
| Contribution chips | `14px` (`size-3.5`) |
| Filter pills / buttons | `16px` (`size-4`) |
| Nav icon buttons | `16px` |
| Hero CTAs | `20px` from `lg` button |

Rules:

- Pair icons with labels except close, play, and expand affordances
- Color inherits from the gel/frost surface. Do not paint icons gray-400
- Do not use filled icons except the tiny Play mark on reel cards
- Lucide v1 dropped brand marks (GitHub, LinkedIn). Use `Globe` and `Code2` plus a text tooltip — do not add a second icon library for brands
- Map contribution chips in `content/projects.ts` → `src/lib/icons.ts`. Add new work there, not as one-off SVGs in JSX

## shadcn/ui customizations

Initialized with the **base-nova** preset, then restyled so primitives match Aero instead of zinc/neutral SaaS.

| Primitive | What changed |
| --- | --- |
| `Button` | `rounded-full` base. Default variant is gel (`.gel-surface`). Added `gel`, `frost`, and lime `secondary`. Sizes are taller pills (`h-9` / `h-11`). |
| `Badge` | Full pills. Added `chip` for contribution tags (uppercase, frost, icon+label). Default is gel. |
| `Card` | `.glass-panel`, `rounded-[1.75rem]`, no gray ring. Footer is white wash, not `bg-muted`. |
| `Dialog` | Sky-tinted overlay, frost popup, 1.75rem corners. |
| `Tooltip` | Frost pill instead of inverted black tooltip. |
| Theme | `:root` tokens rewritten to sky/aqua/lime. Dark class is unused; Aero stays light. |

Do not run `shadcn add` and ship the stock zinc styles. New primitives should pick up gel/frost via these tokens, then get a pass if they still look generic.

New project UI should compose these primitives (`Button`, `Badge`, `Card`) rather than inventing a parallel kit.

## Motion

Orbs float (`7s` / `11s` ease-in-out). Clouds drift. Keep it slow. No springy SaaS micro-interactions on every card.

## Content types

Board filters:

1. **Design** — UX, brand, print, visual systems
2. **Reels** — promo film, OVC, cuts
3. **Product** — MVPs, sites, tools
4. **Data** — dashboards, models, listening, maps

A project can wear several. Contribution chips are the finer grain (UX, Edit, Ad spend, Dashboard, …).
