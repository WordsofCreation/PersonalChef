export function withBase(path = '/') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const normalizedPath = path === '/' ? '/' : path.startsWith('/') ? path : `/${path}`;

  return normalizedPath === '/' ? `${base}/` : `${base}${normalizedPath}`;
}
