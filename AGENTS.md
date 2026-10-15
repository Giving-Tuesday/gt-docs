# Documentation project instructions

## About this project

- This is a static [Astro Starlight](https://starlight.astro.build) site, hosted on Cloudflare Pages behind Cloudflare Access
- Articles are Markdown files in `src/content/articles/` with optional `title`, `date`, `tags`, and `slug` frontmatter
- External docs are copied into `src/content/external/` by `npm run sync` from the sources in `external-sources.json`. Never edit files there; the next sync overwrites them
- The `docs` collection is defined in `src/content.config.ts`. It fills in a default `title` for files without one. Slug derivation lives in `src/lib/slug.ts`
- The site must stay fully static. Do not add a CMS, a database, or any build-time or runtime API call
- Run `npm run build` to verify a change

## Style preferences

- Use active voice and second person ("you")
- Keep sentences concise — one idea per sentence
- Use sentence case for headings
- Bold for UI elements: Click **Settings**
- Code formatting for file names, commands, paths, and code references
