const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahmermkhan.com/'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/login/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

