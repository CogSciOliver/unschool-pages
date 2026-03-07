
# Migration Checklist

## Existing repo goals preserved

- clean static HTML
- markdown-first publishing
- minimal dependencies
- easy SEO metadata
- strong crawlability
- simple syndication paths

## Recommended field map for old posts

```yaml
---
layout: layouts/article.njk
title: Your Title
description: One sentence summary.
section: unschooling-basics
nav_label: Optional shorter sidebar label
nav_order: 20
format: Guide
intent: reassure
audience: parents
access: Free
cta_text: Continue Reading
cta_url: /community/
tags:
  - post
  - topic-name
  - another-topic
permalink: /unschooling-basics/your-slug/
---
```

## Section slugs

- `start-here`
- `unschooling-basics`
- `deschooling-lab`
- `stories`
- `rabbit-holes`
- `books`
- `unschooling-pta`
- `community`

## Notes

- `post` is required for article pages to show in collections.
- `featured` surfaces an article on the homepage.
- Any non-structural tag becomes eligible for a topic hub.
