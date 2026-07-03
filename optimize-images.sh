#!/bin/bash

# Image Optimization Script for Hugo Blog
# Usage: ./optimize-images.sh [directory]
#
# Resizes images wider than MAX_WIDTH and palette-compresses PNGs in place.
# Originals are backed up to image-originals/ at the repo root, which is
# git-ignored and OUTSIDE static/, so backups are never published.

set -euo pipefail

IMAGES_DIR="${1:-static/images}"
BACKUP_DIR="image-originals"
MAX_WIDTH=800
PNG_COLORS=256

echo "🖼️  Hugo Blog Image Optimizer"
echo "=================================="

mkdir -p "$BACKUP_DIR"

# Find a Python with Pillow for PNG palette compression (optional but
# recommended — resize alone leaves PNGs ~3x larger than needed).
# Override with PYTHON_BIN=/path/to/python if desired.
PY="${PYTHON_BIN:-}"
if [[ -z "$PY" ]]; then
    for cand in python3 .venv/bin/python; do
        if command -v "$cand" >/dev/null 2>&1 && "$cand" -c 'import PIL' >/dev/null 2>&1; then
            PY="$cand"
            break
        fi
    done
fi
if [[ -z "$PY" ]]; then
    echo "⚠️  No Python with Pillow found — will resize only, no palette compression."
    echo "   (pip install pillow, or set PYTHON_BIN=/path/to/python)"
fi

if [[ ! -d "$IMAGES_DIR" ]]; then
    echo "❌ Directory $IMAGES_DIR not found!"
    exit 1
fi

echo "🔍 Processing images in $IMAGES_DIR..."
echo ""

find "$IMAGES_DIR" -maxdepth 1 -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' \) | while IFS= read -r image_file; do
    filename=$(basename "$image_file")

    # Backup original once; never overwrite an existing backup
    if [[ ! -f "$BACKUP_DIR/$filename" ]]; then
        cp "$image_file" "$BACKUP_DIR/$filename"
    fi
    before_size=$(du -h "$image_file" | cut -f1)

    # Resize if wider than MAX_WIDTH (sips ships with macOS)
    width=$(sips -g pixelWidth "$image_file" | awk '/pixelWidth/ {print $2}')
    if [[ "$width" -gt "$MAX_WIDTH" ]]; then
        sips --resampleWidth "$MAX_WIDTH" "$image_file" >/dev/null
    fi

    # Palette-compress PNGs (like pngquant): 24-bit -> 8-bit indexed
    if [[ -n "$PY" ]] && [[ "$filename" == *.png || "$filename" == *.PNG ]]; then
        "$PY" - "$image_file" "$PNG_COLORS" <<'PYEOF'
import sys
from PIL import Image

path, colors = sys.argv[1], int(sys.argv[2])
im = Image.open(path)
if im.mode == "P":
    sys.exit(0)  # already palette-compressed
if im.mode in ("RGBA", "LA"):
    q = im.quantize(colors=colors, method=Image.Quantize.FASTOCTREE,
                    dither=Image.Dither.FLOYDSTEINBERG)
else:
    q = im.convert("RGB").quantize(colors=colors, method=Image.Quantize.MEDIANCUT,
                                   dither=Image.Dither.FLOYDSTEINBERG)
q.save(path, optimize=True)
PYEOF
    fi

    after_size=$(du -h "$image_file" | cut -f1)
    echo "  $filename: $before_size -> $after_size (width ${width}px -> $(sips -g pixelWidth "$image_file" | awk '/pixelWidth/ {print $2}')px)"
done

echo ""
echo "✨ Image optimization complete!"
echo "🗂️  Originals backed up in: $BACKUP_DIR/ (git-ignored, not published)"
