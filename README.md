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

## Deploy to Vercel

No environment variables are required. Vercel should auto-detect Next.js and use `npm run build`.

```powershell
npx vercel@latest --archive=tgz
npx vercel@latest --prod --archive=tgz
```

The first command creates a preview deployment; the second promotes a production deployment. The archive flag keeps the media-heavy upload reliable. Original files in `content/drop/` are excluded by both `.gitignore` and `.vercelignore`; only the compressed files in `public/media/` deploy.

## Drop media

Put source stills and cuts in [`content/drop/`](./content/drop/), then run the optimizer and classify the generated rows in the portfolio intake table. Until that table is applied, cards use glossy CSS covers.

Project copy and contribution chips live in [`content/projects.ts`](./content/projects.ts). Bio and links live in [`content/profile.ts`](./content/profile.ts).

### Optimize a new drop

The original media is preserved locally and excluded from Git/Vercel. Browser-ready H.264 MP4s, WebP images, and video poster frames are written to `public/media/`; size/codec manifests stay in `content/`.

```powershell
python -m venv .media-tools
.\.media-tools\Scripts\python.exe -m pip install pillow imageio-ffmpeg
.\.media-tools\Scripts\python.exe scripts\optimize-media.py
```

Pass `--force` after changing compression settings to regenerate existing outputs.

## Portfolio intake table

Fill in [`content/portfolio-intake.csv`](./content/portfolio-intake.csv) after adding media to `content/drop/`. The optimizer seeds one row per optimized asset and keeps the original filename beside it. Repeat a project slug when several files belong to the same project.

- `source_file`, `file_path`, `poster_path`, and `media_type` are generated; leave them unchanged
- `content_types`: separate with `|`; allowed values are `design`, `reels`, `product`, `data`
- `contribution_chips`: separate with `|`; allowed values are `ux`, `visual`, `copy`, `strategy`, `video`, `edit`, `ads`, `print`, `product`, `code`, `ml`, `dashboard`, `research`, `seo`, `gtm`
- `publish`: use `yes` or `no`

Once the table is complete, it can be used to replace the starter project copy and map each dropped file into the portfolio.

## Layout

- `/` — Pinterest-style masonry board with Design / Reels / Product / Data filters
- `/work/[slug]` — full view: writeup, chips, dropped media, adjacent work
- `/media/...` — CDN-cacheable optimized files from `public/media/`
