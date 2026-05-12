const base = import.meta.env.BASE_URL.replace(/\/?$/, '/'); // always ends with /

export function siteUrl(path: string): string {
  if (!path) return path;
  if (/^(https?:|\/\/|mailto:|tel:|#)/.test(path)) return path;
  return base + path.replace(/^\//, '');
}
