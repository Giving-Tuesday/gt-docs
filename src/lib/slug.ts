export function slugFromPath(entry: string): string {
  return entry
    .replace(/^articles\//, '')
    .replace(/\.md$/i, '')
    .replace(/(^|\/)(index|readme)$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9/]+/g, '-')
    .replace(/(^|\/)-+|-+(?=\/|$)/g, '$1');
}
