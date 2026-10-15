import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'articles'>;

export function articleTitle(article: Article): string {
  return article.data.title ?? article.id.split('/').at(-1) ?? article.id;
}

export async function getArticles(): Promise<Article[]> {
  const articles = await getCollection('articles');
  return articles.sort(
    (a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0) || a.id.localeCompare(b.id),
  );
}

export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
