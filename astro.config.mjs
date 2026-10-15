import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://givingtuesday.org',
  integrations: [
    starlight({
      title: 'GivingTuesday Handbook',
      favicon: '/favicon.svg',
      editLink: { baseUrl: 'https://github.com/Giving-Tuesday/gt-docs/edit/main/' },
      sidebar: [
        { autogenerate: { directory: 'src/content/articles' } },
        { label: 'External docs', items: [{ autogenerate: { directory: 'src/content/external' } }] },
      ],
      head: [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex' } }],
    }),
  ],
});
