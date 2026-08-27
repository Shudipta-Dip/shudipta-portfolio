"""Convert content/drop assets into web-ready media.

Run from the repository root:
    .media-tools/Scripts/python.exe scripts/optimize-media.py

Original files are never modified. Optimized files and manifests are written to
content/drop/optimized.
"""

from __future__ import annotations

import csv
import json
import re
import shutil
import subprocess
import sys
import unicodedata
from pathlib import Path
from typing import Any

import imageio_ffmpeg
from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "content" / "drop"
OUTPUT = ROOT / "public" / "media"
LEGACY_OUTPUT = SOURCE / "optimized"
INTAKE = ROOT / "content" / "portfolio-intake.csv"
MANIFEST_JSON = ROOT / "content" / "media-manifest.json"
MANIFEST_CSV = ROOT / "content" / "media-manifest.csv"
MAX_IMAGE_EDGE = 1920
MAX_VIDEO_EDGE = 1280
IMAGE_QUALITY = 84
VIDEO_CRF = 28
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()

KNOWN_SUFFIXES = {
    ".avif",
    ".gif",
    ".jpeg",
    ".jpg",
    ".m4v",
    ".mov",
    ".mp4",
    ".png",
    ".webm",
    ".webp",
}


def detect_kind(path: Path) -> str | None:
    signature = path.read_bytes()[:16]
    if signature.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if signature.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if signature.startswith((b"GIF87a", b"GIF89a")):
        return "image/gif"
    if signature.startswith(b"RIFF") and signature[8:12] == b"WEBP":
        return "image/webp"
    if signature.startswith(b"\x1aE\xdf\xa3"):
        return "video/webm"
    if len(signature) >= 8 and signature[4:8] == b"ftyp":
        return "video/mp4"
    return None


def clean_stem(path: Path, index: int) -> str:
    suffix = path.suffix.lower()
    raw = path.stem if suffix in KNOWN_SUFFIXES else path.name
    raw = unicodedata.normalize("NFKD", raw).encode("ascii", "ignore").decode()
    raw = raw.replace("&", " and ")
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", raw).strip("-").lower()
    if not slug or len(slug) > 72:
        slug = f"asset-{index:02d}"
    return slug


def unique_stem(stem: str, used: set[str]) -> str:
    candidate = stem
    number = 2
    while candidate in used:
        candidate = f"{stem}-{number}"
        number += 1
    used.add(candidate)
    return candidate


def run_ffmpeg(arguments: list[str]) -> None:
    command = [FFMPEG, "-hide_banner", "-loglevel", "error", "-y", *arguments]
    subprocess.run(command, check=True)


def video_metadata(path: Path) -> dict[str, Any]:
    process = subprocess.run(
        [FFMPEG, "-hide_banner", "-i", str(path)],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    output = process.stderr
    duration_match = re.search(r"Duration:\s*(\d+):(\d+):([\d.]+)", output)
    video_match = re.search(
        r"Video:\s*([^,\s]+).*?(\d{2,5})x(\d{2,5})(?:[,\s]|$)",
        output,
        re.DOTALL,
    )
    audio_match = re.search(r"Audio:\s*([^,\s]+)", output)

    duration = None
    if duration_match:
        hours, minutes, seconds = duration_match.groups()
        duration = round(int(hours) * 3600 + int(minutes) * 60 + float(seconds), 2)

    return {
        "width": int(video_match.group(2)) if video_match else None,
        "height": int(video_match.group(3)) if video_match else None,
        "duration_seconds": duration,
        "source_video_codec": video_match.group(1) if video_match else None,
        "source_audio_codec": audio_match.group(1) if audio_match else None,
    }


def optimize_image(source: Path, destination: Path) -> dict[str, Any]:
    with Image.open(source) as image:
        original_size = image.size
        has_alpha = image.mode in {"RGBA", "LA"} or "transparency" in image.info
        image = ImageOps.exif_transpose(image)
        image.thumbnail((MAX_IMAGE_EDGE, MAX_IMAGE_EDGE), Image.Resampling.LANCZOS)
        if not has_alpha:
            image = image.convert("RGB")
        image.save(
            destination,
            "WEBP",
            quality=IMAGE_QUALITY,
            method=6,
            optimize=True,
        )
        return {
            "width": original_size[0],
            "height": original_size[1],
            "optimized_width": image.width,
            "optimized_height": image.height,
        }


def image_metadata(source: Path, optimized: Path) -> dict[str, Any]:
    with Image.open(source) as original, Image.open(optimized) as web:
        return {
            "width": original.width,
            "height": original.height,
            "optimized_width": web.width,
            "optimized_height": web.height,
        }


def ensure_smaller_image(source: Path, optimized: Path) -> None:
    if optimized.stat().st_size < source.stat().st_size:
        return
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image)
        image.thumbnail((MAX_IMAGE_EDGE, MAX_IMAGE_EDGE), Image.Resampling.LANCZOS)
        if image.mode not in {"RGBA", "LA"}:
            image = image.convert("RGB")
        for quality in (80, 76, 72):
            image.save(optimized, "WEBP", quality=quality, method=6, optimize=True)
            if optimized.stat().st_size < source.stat().st_size:
                break


def optimize_video(source: Path, destination: Path, is_gif: bool) -> dict[str, Any]:
    metadata = video_metadata(source)
    video_filter = (
        f"fps=24," if is_gif else ""
    ) + (
        f"scale='min({MAX_VIDEO_EDGE},iw)':'min({MAX_VIDEO_EDGE},ih)':"
        "force_original_aspect_ratio=decrease:force_divisible_by=2,format=yuv420p"
    )
    run_ffmpeg(
        [
            "-i",
            str(source),
            "-map",
            "0:v:0",
            "-map",
            "0:a?",
            "-map_metadata",
            "-1",
            "-vf",
            video_filter,
            "-c:v",
            "libx264",
            "-preset",
            "medium",
            "-crf",
            str(VIDEO_CRF),
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-b:a",
            "96k",
            "-ac",
            "2",
            "-movflags",
            "+faststart",
            str(destination),
        ]
    )
    return metadata


def ensure_smaller_video(
    source: Path,
    optimized: Path,
    metadata: dict[str, Any],
) -> None:
    if optimized.stat().st_size < source.stat().st_size:
        return
    if metadata.get("source_video_codec") != "h264":
        return
    if metadata.get("source_audio_codec") not in {None, "aac"}:
        return

    remuxed = optimized.with_name(f"{optimized.stem}-remux.mp4")
    run_ffmpeg(
        [
            "-i",
            str(source),
            "-map",
            "0:v:0",
            "-map",
            "0:a?",
            "-map_metadata",
            "-1",
            "-c",
            "copy",
            "-movflags",
            "+faststart",
            str(remuxed),
        ]
    )
    remuxed.replace(optimized)


def make_poster(source: Path, destination: Path, duration: float | None) -> None:
    seek = min(1.0, max(0.0, (duration or 2.0) * 0.1))
    run_ffmpeg(
        [
            "-ss",
            f"{seek:.2f}",
            "-i",
            str(source),
            "-frames:v",
            "1",
            "-vf",
            (
                f"scale='min({MAX_IMAGE_EDGE},iw)':'min({MAX_IMAGE_EDGE},ih)':"
                "force_original_aspect_ratio=decrease"
            ),
            "-c:v",
            "libwebp",
            "-quality",
            str(IMAGE_QUALITY),
            str(destination),
        ]
    )


def seed_intake_table(manifest: list[dict[str, Any]]) -> bool:
    """Populate the blank intake sheet without overwriting user-entered rows."""
    if INTAKE.exists():
        current = INTAKE.read_text(encoding="utf-8-sig")
        if "REPLACE-WITH-FILENAME" not in current:
            return False

    columns = [
        "source_file",
        "file_path",
        "poster_path",
        "media_type",
        "project_slug",
        "title",
        "content_types",
        "contribution_chips",
        "description",
        "year",
        "organization",
        "external_url",
        "publish",
    ]
    rows = []
    for item in manifest:
        if item["status"] != "ok":
            continue
        rows.append(
            {
                "source_file": item["source"],
                "file_path": f"public/media/{Path(item['optimized']).name}",
                "poster_path": f"public/media/{Path(item['poster']).name}" if item.get("poster") else "",
                "media_type": (
                    "video"
                    if item["optimized"].lower().endswith(".mp4")
                    else "image"
                ),
                "project_slug": "",
                "title": "",
                "content_types": "",
                "contribution_chips": "",
                "description": "",
                "year": "",
                "organization": "",
                "external_url": "",
                "publish": "",
            }
        )

    with INTAKE.open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=columns)
        writer.writeheader()
        writer.writerows(rows)
    return True


def migrate_legacy_outputs() -> None:
    if not LEGACY_OUTPUT.exists():
        return
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for source in LEGACY_OUTPUT.iterdir():
        if not source.is_file():
            continue
        if source.name in {"manifest.json", "manifest.csv"}:
            source.unlink()
            continue
        destination = OUTPUT / source.name
        if destination.exists():
            source.unlink()
        else:
            shutil.move(str(source), str(destination))
    try:
        LEGACY_OUTPUT.rmdir()
    except OSError:
        pass


def update_intake_paths() -> None:
    if not INTAKE.exists():
        return
    rows: list[dict[str, str]]
    with INTAKE.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        columns = reader.fieldnames
        rows = list(reader)
    if not columns:
        return

    changed = False
    for row in rows:
        for column in ("file_path", "poster_path"):
            value = row.get(column, "")
            if value.startswith("content/drop/optimized/"):
                row[column] = f"public/media/{Path(value).name}"
                changed = True
    if changed:
        with INTAKE.open("w", newline="", encoding="utf-8-sig") as handle:
            writer = csv.DictWriter(handle, fieldnames=columns)
            writer.writeheader()
            writer.writerows(rows)


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="backslashreplace")
        sys.stderr.reconfigure(encoding="utf-8", errors="backslashreplace")
    force = "--force" in sys.argv

    migrate_legacy_outputs()
    update_intake_paths()
    OUTPUT.mkdir(parents=True, exist_ok=True)
    files = sorted(
        (
            path
            for path in SOURCE.iterdir()
            if path.is_file() and path.name.lower() != "readme.md"
        ),
        key=lambda path: path.name.lower(),
    )
    used: set[str] = set()
    manifest: list[dict[str, Any]] = []

    print(f"Optimizing {len(files)} files with {FFMPEG}", flush=True)

    for index, source in enumerate(files, start=1):
        detected = detect_kind(source)
        if not detected:
            print(f"[{index}/{len(files)}] SKIP unknown: {source.name}", flush=True)
            manifest.append(
                {
                    "source": source.name,
                    "detected_type": "unknown",
                    "status": "skipped",
                }
            )
            continue

        stem = unique_stem(clean_stem(source, index), used)
        source_bytes = source.stat().st_size
        is_gif = detected == "image/gif"
        is_video = detected.startswith("video/") or is_gif

        print(
            f"[{index}/{len(files)}] {'VIDEO' if is_video else 'IMAGE'} {source.name}",
            flush=True,
        )

        try:
            if is_video:
                optimized = OUTPUT / f"{stem}.mp4"
                poster = OUTPUT / f"{stem}-poster.webp"
                if not force and optimized.exists() and poster.exists():
                    print("  REUSE completed video and poster", flush=True)
                    details = video_metadata(source)
                else:
                    details = optimize_video(source, optimized, is_gif)
                    make_poster(source, poster, details.get("duration_seconds"))
                ensure_smaller_video(source, optimized, details)
            else:
                optimized = OUTPUT / f"{stem}.webp"
                poster = None
                if not force and optimized.exists():
                    print("  REUSE completed image", flush=True)
                    details = image_metadata(source, optimized)
                else:
                    details = optimize_image(source, optimized)
                ensure_smaller_image(source, optimized)

            optimized_bytes = optimized.stat().st_size
            manifest.append(
                {
                    "source": source.name,
                    "detected_type": detected,
                    "optimized": optimized.relative_to(ROOT).as_posix(),
                    "poster": poster.relative_to(ROOT).as_posix() if poster else "",
                    "source_bytes": source_bytes,
                    "optimized_bytes": optimized_bytes,
                    "savings_percent": round(
                        (1 - optimized_bytes / source_bytes) * 100,
                        1,
                    ),
                    "status": "ok",
                    **details,
                }
            )
        except Exception as error:  # Continue so one damaged asset does not lose the batch.
            print(f"  ERROR: {error}", file=sys.stderr, flush=True)
            manifest.append(
                {
                    "source": source.name,
                    "detected_type": detected,
                    "source_bytes": source_bytes,
                    "status": "error",
                    "error": str(error),
                }
            )

    MANIFEST_JSON.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    columns = sorted({key for item in manifest for key in item})
    with MANIFEST_CSV.open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=columns)
        writer.writeheader()
        writer.writerows(manifest)

    intake_seeded = seed_intake_table(manifest)
    successes = [item for item in manifest if item["status"] == "ok"]
    errors = [item for item in manifest if item["status"] == "error"]
    skipped = [item for item in manifest if item["status"] == "skipped"]
    before = sum(item["source_bytes"] for item in successes)
    after = sum(item["optimized_bytes"] for item in successes)
    saved = (1 - after / before) * 100 if before else 0
    print(
        f"Done: {len(successes)} converted, {len(skipped)} skipped, "
        f"{len(errors)} errors; "
        f"{before / 1_048_576:.1f} MB -> {after / 1_048_576:.1f} MB "
        f"({saved:.1f}% smaller)",
        flush=True,
    )
    if intake_seeded:
        print(f"Seeded {INTAKE.relative_to(ROOT)} with {len(successes)} rows", flush=True)
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
