const pages = [
  '',
  'services',
  'sample-menus',
  'about-the-chef',
  'personal-chef-port-angeles',
  'personal-chef-sequim',
  'vacation-rental-chef-olympic-peninsula',
  'faq',
  'contact'
];

export async function GET(context) {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `  <url><loc>${new URL(page ? `/${page}` : '/', context.site).toString()}</loc></url>`).join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}
