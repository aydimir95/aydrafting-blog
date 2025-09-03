#!/bin/bash

# Image Optimization Script for Hugo Blog
# Usage: ./optimize-images.sh [directory]

set -e

IMAGES_DIR="${1:-static/images}"
BACKUP_DIR="static/images/originals"
MAX_WIDTH=800
WEBP_QUALITY=80
PNG_QUALITY=85

echo "🖼️  Hugo Blog Image Optimizer"
echo "=================================="

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Function to optimize a single image
optimize_image() {
    local input_file="$1"
    local filename=$(basename "$input_file")
    local name_no_ext="${filename%.*}"
    local backup_file="$BACKUP_DIR/$filename"
    
    echo "Processing: $filename"
    
    # Backup original if not already backed up
    if [[ ! -f "$backup_file" ]]; then
        cp "$input_file" "$backup_file"
        echo "  ✅ Backed up to originals/"
    fi
    
    # Get current dimensions
    if command -v magick >/dev/null 2>&1; then
        current_width=$(magick identify -format "%w" "$input_file")
        echo "  📏 Current width: ${current_width}px"
        
        # Resize if too large
        if [[ $current_width -gt $MAX_WIDTH ]]; then
            echo "  🔄 Resizing to ${MAX_WIDTH}px width..."
            magick "$input_file" -resize "${MAX_WIDTH}x>" -quality $PNG_QUALITY "$input_file"
        fi
        
        # Create WebP version
        local webp_file="${input_file%.*}.webp"
        echo "  🌐 Creating WebP version..."
        magick "$input_file" -quality $WEBP_QUALITY "$webp_file"
        
        # Show file sizes
        original_size=$(du -h "$backup_file" | cut -f1)
        optimized_size=$(du -h "$input_file" | cut -f1)
        webp_size=$(du -h "$webp_file" | cut -f1)
        
        echo "  💾 Original: $original_size → Optimized PNG: $optimized_size → WebP: $webp_size"
        
    elif command -v cwebp >/dev/null 2>&1; then
        # WebP only conversion
        local webp_file="${input_file%.*}.webp"
        echo "  🌐 Creating WebP version..."
        cwebp -q $WEBP_QUALITY "$input_file" -o "$webp_file"
        
        original_size=$(du -h "$input_file" | cut -f1)
        webp_size=$(du -h "$webp_file" | cut -f1)
        echo "  💾 Original PNG: $original_size → WebP: $webp_size"
    else
        echo "  ⚠️  No optimization tools available"
    fi
    
    echo ""
}

# Find and process all PNG/JPG files
echo "🔍 Finding images in $IMAGES_DIR..."
echo ""

if [[ -d "$IMAGES_DIR" ]]; then
    find "$IMAGES_DIR" -maxdepth 1 -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) ! -path "*/originals/*" | while read -r image_file; do
        optimize_image "$image_file"
    done
else
    echo "❌ Directory $IMAGES_DIR not found!"
    exit 1
fi

echo "✨ Image optimization complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Check the optimized images look good"
echo "   2. Update your markdown files to use .webp versions"
echo "   3. Add Hugo WebP processing configuration"
echo ""
echo "🗂️  Originals backed up in: $BACKUP_DIR"