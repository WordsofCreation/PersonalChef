export function withBase(path = '/') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const normalizedPath = path === '/' ? '/' : path.startsWith('/') ? path : `/${path}`;

  if (normalizedPath === '/') {
    return `${base}/`;
  }

  const pathWithoutQuery = normalizedPath.match(/^[^?#]*/)?.[0] ?? normalizedPath;
  const suffix = normalizedPath.slice(pathWithoutQuery.length);
  const directoryPath = pathWithoutQuery.endsWith('/') ? pathWithoutQuery : `${pathWithoutQuery}/`;

  return `${base}${directoryPath}${suffix}`;
}
