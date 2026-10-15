# Documentation project instructions

## About this project

- This is a static [Astro](https://astro.build) site, hosted on Cloudflare Pages behind Cloudflare Access
- Articles are Markdown files in `src/content/articles/` with optional `title`, `date`, `tags`, and `slug` frontmatter
- External docs are read-only git submodules under `src/content/external/`. Never edit files inside them
- The collection is defined in `src/content.config.ts`. Slug derivation lives in `src/lib/slug.ts`
- The site must stay fully static. Do not add a CMS, a database, or any build-time or runtime API call
- Run `npm run build` to verify a change

## Style preferences

- Use active voice and second person ("you")
- Keep sentences concise — one idea per sentence
- Use sentence case for headings
- Bold for UI elements: Click **Settings**
- Code formatting for file names, commands, paths, and code references
