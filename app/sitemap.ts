import type { MetadataRoute } from 'next';

const fetchPads = async (url: string, path: string) => {
  const response = await get(url);
  return response?.map((pad: any) => `${path}/${pad.pad_id}`);
};

const fetchPinboards = async (url: string, path: string) => {
  const response = await get(url);
  return response?.data?.map(
    (pinboard: any) => `${path}/${pinboard.pinboard_id}`
  );
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { PROD_ENV } = process.env;
//   Check if the environment is staging
  if (PROD_ENV === 'staging') {
      return [];
  }

  const staticPages = [
    '/',
    '/about',
    '/see',
    '/test',
    '/learn',
    '/boards',
    '/next-practices',
  ];

  const dynamicPages = [
    ...await fetchPads('https://solutions.sdg-innovation-commons.org/apis/fetch/pads?output=json&object=pads', '/pads/solution'),
    ...await fetchPads('https://experiments.sdg-innovation-commons.org/apis/fetch/pads?output=json&object=pads', '/pads/experiment'),
    ...await fetchPads('https://learningplans.sdg-innovation-commons.org/apis/fetch/pads?output=json&object=pads', '/pads/action%20plan'),
    ...await fetchPinboards('https://learningplans.sdg-innovation-commons.org/apis/fetch/pinboards?output=json&object=pads', '/pinboards')
  ];

  const urls: MetadataRoute.Sitemap = [...staticPages, ...dynamicPages]?.map(
    (url) => ({
      url: `https://sdg-innovation-commons.org${url}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    })
  );

  return urls;
}

const get = async (url: string) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 400) {
        try {
          const responseData = await response.json();
          if (responseData?.message) {
            return [];
          }
          return responseData;
        } catch {
          throw new Error(`Error parsing JSON for status 400`);
        }
      } else {
        throw new Error(`Error: `);
      }
    }
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      const responseData = await response.json();
      return responseData;
    } else {
      const textResponse = await response.text();
      return { status: 200, message: 'Success', data: textResponse };
    }
  } catch (error) {
    console.log('Fetch error:', url, error);
    return null;
  }
};
