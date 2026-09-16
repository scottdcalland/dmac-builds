# DMac Builds website

Static marketing site for **DMac Builds**, a bricklayer, landscaper and groundworks firm based in Platt Bridge, Wigan (run by Danny Mac). Specialising in bricklaying, landscaping and bespoke garden design, plus groundworks, concrete, garage conversions, extensions and renovations across Wigan and within 20 miles.

Content, photos, videos and brand colours were lifted from the business's public Instagram (@dmacbuilds) and Facebook.

## Structure

- `build.mjs` — static site generator (plain Node, no dependencies). Holds all content (services, area towns, images, reels) and templates.
- `docs/` — the generated static site (served by GitHub Pages).
- `docs/assets/img/work/` — real work photos pulled from social media.

## Build

```bash
node build.mjs
```

Regenerates every page into `docs/`.

## Pages

- Home, Services (8 service pages), Areas (29 town pages within ~20 miles of Wigan), Gallery (photos + Instagram reels), About, Contact, 404.

## Notes

- Contact form composes an email to dmacbuilds@gmail.com (no backend needed).
- No phone number is published (none was listed publicly), so contact is email + Instagram + Facebook.
- `SITE.domain` in `build.mjs` is a placeholder for canonical/schema; update it when a real domain is attached.
