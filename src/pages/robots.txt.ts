export async function GET({ site }) {
  if (!site) {
    throw new Error('Astro.site must be configured to generate a valid robots.txt file.');
  }

  const sitemapPath = `${import.meta.env.BASE_URL}sitemap.xml`;
  const robots = `User-agent: *
Allow: /

Sitemap: ${new URL(sitemapPath, site).toString()}
`;

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}
