import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    //   disallow: '/private/',
    },
    sitemap: 'https://sdg-innovation-commons.org/sitemap.xml',
  }
}