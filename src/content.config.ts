import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { slugFromPath } from './lib/slug';

const articles = defineCollection({
  loader: glob({
    base: './src/content',
    pattern: ['articles/**/*.md', 'external/**/*.md', '!**/node_modules/**'],
    generateId: ({ entry, data }) => (data.slug ? String(data.slug) : slugFromPath(entry)),
  }),
  schema: z.object({
    title: z.string().optional(),
    date: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    slug: z.string().optional(),
  }),
});

export const collections = { articles };
