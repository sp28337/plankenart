import type { APIRoute } from 'astro';

const SITE = 'https://plankenart.ru';
const robotsPolicy = import.meta.env.PUBLIC_ROBOTS_POLICY ?? 'disallow';

export const GET: APIRoute = () => {
  const isAllow = robotsPolicy === 'allow';

  const body = isAllow
    ? [
        'User-agent: *',
        'Disallow:',
        '',
        `Sitemap: ${SITE}/sitemap-index.xml`,
      ].join('\n')
    : [
        'User-agent: *',
        'Disallow: /',
      ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
