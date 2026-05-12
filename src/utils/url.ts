const base = import.meta.env.BASE_URL; // '/' or '/repo-name/'

export function siteUrl(path: string): string {
  if (!path) return path;
  if (/^(https?:|\/\/|mailto:|tel:|#)/.test(path)) return path;
  return base + path.replace(/^\//, '');
}
