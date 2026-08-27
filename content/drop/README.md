# Media drop

Dump stills, cuts, and a portrait here. Refresh the site. No import step.

Served at `/media/<filename>` (and `/media/<folder>/<filename>`).

## Portrait

Any one of these, first match wins:

- `profile.jpg` / `.png` / `.webp` / …
- `avatar.*`
- `me.*`
- `portrait.*`

## Project files

Use the project **slug** from `content/projects.ts`.

```
bida-matchmaking.jpg          → cover
bida-matchmaking-cover.png    → cover (preferred)
bida-matchmaking-2.jpg        → gallery on the full-view page
bida-matchmaking.mp4          → reel / extra
bida-matchmaking/cover.webp   → cover (folder form)
bida-matchmaking/edit.mov     → extra
```

A file belongs to a project if:

- the filename is `slug` or starts with `slug-`, or
- it sits in a folder named `slug`

Images: `.jpg` `.jpeg` `.png` `.webp` `.gif` `.avif`  
Video: `.mp4` `.webm` `.mov` `.m4v`

Covers prefer `cover` in the name, then `slug`, then `slug-1`.

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

Until a file exists, the board paints a glossy CSS cover so empty drops still look intentional.
