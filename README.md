# GivingTuesday handbook

A static handbook built with [Astro Starlight](https://starlight.astro.build). It has a section sidebar, a table of contents on each page, and full-text search. Cloudflare Pages hosts it and Cloudflare Access limits it to `@givingtuesday.org` email addresses.

## Write an article

Add a Markdown file to `src/content/articles/`. Each subdirectory becomes a collapsible section in the sidebar, labeled with the directory name. `src/content/articles/index.md` is the home page.

```markdown
---
title: Grant reporting checklist
date: 2026-10-15
tags: [grants, process]
slug: grant-checklist
---

Article body in Markdown.
```

All frontmatter fields are optional. Starlight fields such as `description` and `sidebar` also work. See the [frontmatter reference](https://starlight.astro.build/reference/frontmatter/).

| Field   | Default when omitted                                                  |
| ------- | --------------------------------------------------------------------- |
| `title` | The last segment of the slug, capitalized                             |
| `date`  | None                                                                  |
| `tags`  | `[]`                                                                  |
| `slug`  | The file path, lowercased and hyphenated, without `articles/` or `.md` |

For example, `src/content/articles/guides/Some File.md` publishes at `/guides/some-file/`. A file named `index.md` or `README.md` takes the slug of its directory.

## Add external docs

External repositories are read-only sources mounted as git submodules under `src/content/external/`. Their Markdown files publish under `/external/<name>/` and appear in the **External docs** sidebar group. They have no **Edit page** link.

```sh
git submodule add https://github.com/<owner>/<repo>.git src/content/external/<repo>
git commit -m "Add <repo> docs"
```

To pull the latest content from every source:

```sh
git submodule update --remote
git commit -am "Update external docs"
```

Cloudflare Pages clones only public submodules. Relative links between Markdown files in an external repo, such as `[setup](docs/setup.md)`, are not rewritten and can 404.

## Develop locally

Use Node.js 24 or later. The `.node-version` file sets the exact version.

```sh
git clone --recurse-submodules <this repo>
npm install
npm run dev
```

`npm run build` writes the static site to `dist/`.

## Deploy

A push to `main` triggers a Cloudflare Pages build. The build makes no network calls. All content comes from this repository and its submodules.

For the one-time Cloudflare setup (DNS, Pages project, custom domain, and Access), see [`docs/cloudflare-setup.md`](docs/cloudflare-setup.md).
