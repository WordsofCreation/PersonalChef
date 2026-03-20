import { withBase } from '../utils/paths';

const sitemapPages = [
  '',
  'services',
  'sample-menus',
  'about-the-chef',
  'personal-chef-port-angeles',
  'personal-chef-sequim',
  'vacation-rental-chef-olympic-peninsula',
  'faq',
  'contact',
  'menu-builder'
];

function buildSitemap(site: URL) {
  const lastModified = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPages
    .map((page) => {
      const pathname = page ? `/${page}` : '/';
      const url = new URL(withBase(pathname), site).toString();

      return `  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastModified}</lastmod>\n  </url>`;
    })
    .join('\n')}\n</urlset>`;
}

export async function GET({ site }) {
  if (!site) {
    throw new Error('Astro.site must be configured to generate a valid sitemap.xml file.');
  }

  return new Response(buildSitemap(site), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}
