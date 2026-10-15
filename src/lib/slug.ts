export function slugFromPath(entry: string): string {
  return entry
    .replace(/^articles\//, '')
    .replace(/\.md$/i, '')
    .replace(/\/(index|readme)$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9/]+/g, '-')
    .replace(/(^|\/)-+|-+(?=\/|$)/g, '$1');
}

export function titleFromSlug(slug: string): string {
  const name = slug.split('/').at(-1) ?? slug;
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');
}
