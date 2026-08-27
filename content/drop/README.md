# Media drop

Dump source stills and cuts here. These originals stay local and are excluded from Git and Vercel.

Run the optimizer from the repository root:

```powershell
.\.media-tools\Scripts\python.exe scripts\optimize-media.py
```

The script detects files even when their extensions are missing, then writes:

- H.264/AAC MP4 videos to `public/media/`
- WebP still images to `public/media/`
- WebP poster frames for every video
- analysis manifests to `content/media-manifest.json` and `.csv`
- one editable row per asset in `content/portfolio-intake.csv`

Complete the blank intake columns to assign each file to a project.

Images: `.jpg` `.jpeg` `.png` `.webp` `.gif` `.avif`  
Video: `.mp4` `.webm` `.mov` `.m4v`

## Current slugs

- `bida-matchmaking`
- `lekh-ai`
- `dhaka-billboards`
- `cluster-mapping`
- `love-doughs`
- `ovc-ad-film`
- `lie-to-eye`
- `moncho-gtm`
- `biman-analysis`
- `bank-social-listening`
- `investment-newsfeed`
- `looker-storytelling`
- `lead-generator-mvp`
- `avatar-box-office`

Until the intake table is applied, the board paints glossy CSS covers so the site remains deployable.
