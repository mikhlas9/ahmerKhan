// Simple SEO utility for generating basic metadata

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ahmermkhan.com'

/**
 * Generate basic page metadata
 */
export function generateMetadata({ title, description, url = "/" }) {
  const fullTitle = title ? `${title} | Ahmer Khan` : "Ahmer Khan | Multimedia Journalist"
  const fullUrl = `${SITE_URL}${url}`
  const defaultDescription = "Award-winning filmmaker, investigative journalist and multimedia storyteller covering conflict, humanitarian crisis and human rights in South Asia."

  return {
    title: fullTitle,
    description: description || defaultDescription,
    openGraph: {
      title: fullTitle,
      description: description || defaultDescription,
      url: fullUrl,
      siteName: "Ahmer Khan",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: description || defaultDescription,
    },
  }
}

