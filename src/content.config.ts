import { defineCollection } from 'astro:content';
import { glob, type Loader } from 'astro/loaders';
import { z } from 'astro/zod';
import { docsSchema } from '@astrojs/starlight/schema';
import { lastCommitDate } from './lib/git';
import { slugFromPath, titleFromSlug } from './lib/slug';

function withDefaults(loader: Loader): Loader {
  return {
    ...loader,
    load: (context) =>
      loader.load({
        ...context,
        parseData: (entry) =>
          context.parseData({
            ...entry,
            data: {
              title: titleFromSlug(entry.id),
              lastUpdated: entry.filePath ? lastCommitDate(entry.filePath) : undefined,
              ...(entry.id.startsWith('external/') && { editUrl: false }),
              ...entry.data,
            },
          }),
      }),
  };
}

const docs = defineCollection({
  loader: withDefaults(
    glob({
      base: './src/content',
      pattern: ['articles/**/*.md', 'external/**/*.md'],
      generateId: ({ entry, data }) => (data.slug ? String(data.slug) : slugFromPath(entry)),
    }),
  ),
  schema: docsSchema({
    extend: z.object({
      date: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      slug: z.string().optional(),
    }),
  }),
});

export const collections = { docs };
