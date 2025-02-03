import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const { PROD_ENV } = process.env;

  if (PROD_ENV === 'staging') {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      sitemap: 'https://staging.sdg-innovation-commons.org/sitemap.xml',
    };
  }
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    //   disallow: '/private/',
    },
    sitemap: 'https://sdg-innovation-commons.org/sitemap.xml',
  }
}