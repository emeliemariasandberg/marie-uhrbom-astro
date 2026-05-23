export function makeUrlFn(base: string) {
  const b = base.endsWith('/') ? base : base + '/';
  return function siteUrl(path: string): string {
    if (!path || /^(https?:|\/\/|mailto:|tel:|#)/.test(path)) return path;
    return b + path.replace(/^\//, '');
  };
}

export function isExternal(href: string | undefined): boolean {
  return !!href && /^https?:\/\//.test(href);
}
