# Shudipta Bhowmick Dip — portfolio v1

Personal portfolio for a creative marketer with a data-driven mindset. Next.js, TypeScript, Tailwind CSS, shadcn/ui, and Lucide. Visual language is Frutiger Aero (sky cyan, grass lime, water, gel, frost) — see [DESIGN.md](./DESIGN.md).

## Run locally

Needs Node 20+ (this repo was built on Node 24).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Command | What it does |
| --- | --- |
| `npm run dev` | Hot-reload preview |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

The homepage and project pages are `force-dynamic` so files you dump into `content/drop/` show up on refresh.

## Drop media

Put stills and cuts in [`content/drop/`](./content/drop/). Naming rules live in that folder's README.

- `profile.jpg` (or `avatar`, `me`, `portrait`) becomes the hero photo
- `bida-matchmaking.jpg` becomes that project's cover
- Extra files (`bida-matchmaking-2.png`, `bida-matchmaking.mp4`, or a `bida-matchmaking/` subfolder) land on the full-view page

Until you drop files, each card uses a glossy CSS cover so the board is not a grid of broken images.

Project copy and contribution chips live in [`content/projects.ts`](./content/projects.ts). Bio and links live in [`content/profile.ts`](./content/profile.ts).

## Layout

- `/` — Pinterest-style masonry board with Design / Reels / Product / Data filters
- `/work/[slug]` — full view: writeup, chips, dropped media, adjacent work
- `/media/...` — serves files from `content/drop/`
