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

External repositories are read-only sources. `npm run sync` copies their `.md` files into `src/content/external/<name>/`, which publishes them under `/external/<name>/` in the **External docs** sidebar group. External pages have no **Edit page** link.

To add a source, add an entry to `external-sources.json`:

```json
[
  {
    "name": "data-commons",
    "repo": "https://github.com/<owner>/<repo>.git",
    "ref": "main",
    "path": "docs"
  }
]
```

| Field  | Required | Description                                                        |
| ------ | -------- | ------------------------------------------------------------------ |
| `name` | Yes      | Directory and URL segment. Lowercase letters, digits, and hyphens  |
| `repo` | Yes      | Git URL of the source repository                                   |
| `ref`  | No       | Branch or tag to copy. Defaults to the repository's default branch |
| `path` | No       | Subdirectory to copy. Defaults to the whole repository             |

Then run `npm run sync` and commit the result. The sync replaces everything in `src/content/external/`, so do not edit files there. It skips symlinks and files inside directories that start with `.`, such as `.github/`. It fails if a source has no `.md` files at its `path`.

The **Sync external docs** GitHub Action runs the sync every day at 06:17 UTC. When the copied files change, it opens or updates one pull request named **Update external docs**. Cloudflare Pages builds a preview of that pull request. Review the preview, then merge to publish. To run it now, open **Actions** > **Sync external docs** and click **Run workflow**.

The Action needs **Settings** > **Actions** > **General** > **Allow GitHub Actions to create and approve pull requests** turned on. It can read only public repositories.

Relative links between Markdown files in an external repo, such as `[setup](docs/setup.md)`, are not rewritten and can 404. Last-updated dates on external pages show when the copy last changed in this repository.

## Develop locally

Use Node.js 24 or later. The `.node-version` file sets the exact version.

```sh
git clone <this repo>
npm install
npm run dev
```

`npm run build` writes the static site to `dist/`.

## Deploy

A push to `main` triggers a Cloudflare Pages build. The build makes no network calls. All content, including copied external docs, is committed to this repository.

For the one-time Cloudflare setup (DNS, Pages project, custom domain, and Access), see [`docs/cloudflare-setup.md`](docs/cloudflare-setup.md).
