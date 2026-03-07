
# Unschool Pages Rebuild Starter

A clean Eleventy publication shell for `unschoolpages.unschooldiscoveries.com`.

## What is included

- Nunjucks layout system
- persistent desktop sidebar + mobile drawer
- markdown-first article templates
- section landing pages
- homepage front-page shell
- auto-generated topic hubs from tags
- split CSS files instead of one giant bundle
- low dependency footprint

## Structure

- `content/` → markdown and Nunjucks pages
- `_includes/layouts/` → page shells
- `_includes/partials/` → reusable UI fragments
- `_data/navigation.js` → sidebar groups
- `_data/site.js` → site metadata
- `assets/css/` → split stylesheets
- `assets/js/sidebar.js` → sidebar behavior

## Commands

```bash
npm install
npm run dev
npm run build
```

## Migration notes

1. Move your current markdown files into `content/<section>/`.
2. Add frontmatter fields like `section`, `nav_order`, `format`, and `cta_*`.
3. Keep tags topical. Topic hubs are generated from tags that are not structural tags.
4. Replace placeholder copy in section landing pages and example posts.
5. Add RSS later if desired; the URL and content model are already ready for it.
