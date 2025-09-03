# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Hugo-based blog focusing on civil engineering automation, Revit API, and C# development. The blog is published at https://blog.aydrafting.com/ and features technical tutorials and case studies.

## Key Technologies

- **Hugo** v0.148.2+ (static site generator)
- **PaperMod Theme** (Hugo theme via Git submodule)
- **Multilingual Support** (English and Russian)
- **GitHub Pages** deployment via GitHub Actions

## Common Commands

### Development
```bash
# Serve the site locally with live reload
hugo server -D

# Serve specific language
hugo server -D --config hugo.toml --contentDir content/en

# Build the site for production
hugo --minify --gc --cleanDestinationDir --baseURL="https://blog.aydrafting.com/"

# Check Hugo version and environment
hugo version
hugo env
```

### Content Management
```bash
# Create new post (English)
hugo new content/en/posts/"Title.md"

# Create new post (Russian)
hugo new content/ru/posts/"Title.md"
```

### Theme Management
```bash
# Update PaperMod theme submodule
git submodule update --remote themes/PaperMod

# Initialize submodules (if cloning fresh)
git submodule update --init --recursive
```

## Repository Structure

### Core Directories
- `content/` - Blog posts and pages organized by language (en/ru)
- `layouts/` - Custom HTML templates and overrides
- `static/` - Static assets (images, files)
- `themes/PaperMod/` - Git submodule for the Hugo theme
- `config/` - Additional configuration files
- `public/` - Generated site (created by Hugo build)

### Content Organization
- `content/en/posts/` - English blog posts
- `content/ru/posts/` - Russian blog posts
- Posts use Hugo front matter with title, date, draft status, tags, and cover images
- Content focuses on C#, Revit API, civil engineering automation

### Custom Layouts
- `layouts/index.html` - Custom homepage layout
- `layouts/index.redirect.html` - Language redirection logic
- `layouts/partials/` - Custom partial templates
- `layouts/shortcodes/` - Custom Hugo shortcodes

## Configuration

### Hugo Configuration (`hugo.toml`)
- Multilingual setup with English (default) and Russian
- PaperMod theme configuration
- SEO optimization settings
- Social media integration
- RSS and JSON feed generation

### GitHub Actions Deployment
- Automated deployment to GitHub Pages on push to master/main
- Uses Hugo v0.148.2 with extended features
- Includes debug output for troubleshooting build issues
- Deploys from `public/` directory

## Development Workflow

### Content Creation
1. Create new posts using `hugo new` command with appropriate language path
2. Use proper front matter including title, date, tags, and cover images
3. Images should be placed in `static/images/` and referenced as `/images/filename.png`
4. Set `draft = false` when ready to publish

### Local Development
1. Run `hugo server -D` to preview with drafts
2. Hugo will auto-reload on file changes
3. Access site at `http://localhost:1313`

### Deployment
- Automatic deployment via GitHub Actions on push to master
- Manual deployment can be triggered via GitHub Actions workflow_dispatch
- Site is built with production optimizations (minification, garbage collection)

## Theme Customization

The site uses PaperMod theme with customizations:
- Custom homepage layout with language redirection
- Enhanced multilingual support
- Custom social icons and metadata
- SEO optimization
- Custom CSS and JavaScript can be added to `assets/`

## Important Notes

- This is a content-focused blog, not a software application
- No package.json or npm dependencies - pure Hugo static site
- Git submodules are used for theme management
- Content is king - focus on markdown files in `content/` directory
- Always test locally before pushing changes
- Images and assets should be optimized for web delivery