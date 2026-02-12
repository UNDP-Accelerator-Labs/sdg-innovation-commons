import Navbar from '@/app/ui/components/Navbar';
import Hero from './Hero';
import Content from './Content';
import Footer from '@/app/ui/components/Footer';
import type { Metadata, ResolvingMetadata } from 'next';
import { incomingRequestParams } from '@/app/lib/helpers/utils';

const { PROD_ENV } = process.env;

export async function generateMetadata(
  { params, searchParams }: { params?: any; searchParams?: any },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // await both searchParams and params (params may be a Promise)
  const sParams = await searchParams;
  const paramsObj = await params; 
  const platformRaw = paramsObj?.platform;
  const platform = platformRaw ? decodeURI(platformRaw) : undefined;

  const title = platform ? `SDG Commons - What We Test (${platform})` : 'SDG Commons - What We Test';

  const filters: string[] = [];
  if (sParams) {
    if (sParams?.q) filters.push(`q: ${sParams.q}`);
    if (sParams?.tag) filters.push(`tag: ${Array.isArray(sParams.tag) ? sParams.tag.join(',') : sParams.tag}`);
    if (sParams?.sort) filters.push(`sort: ${sParams.sort}`);
  }

  const description =
    filters.length > 0
      ? `Discover experiments & action plans — ${filters.join(' | ')}`
      : "Discover wicked development challenges we are curious about and the experiments conducted to learn what works and what doesn't in sustainable development.";

  const metadataBase = new URL('https://sdg-innovation-commons.org');
  const previousImages = (await parent)?.openGraph?.images || [];

  const ogImageUrl = new URL(
    `/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(description)}`,
    metadataBase
  ).toString();

  const meta: Metadata = {
    title,
    description,
    metadataBase,
    openGraph: {
      title: title || 'SDG Commons - What We Test',
      description: description,
      url: `/test/${platform || ''}`,
      siteName: 'SDG Commons',
      type: 'website',
      images: [ogImageUrl, ...(previousImages as string[])],
    },
    twitter: {
      card: 'summary_large_image',
      title: title || 'SDG Commons - What We Test',
      description: description,
      images: [ogImageUrl],
    },
  };

  if (PROD_ENV === 'staging') (meta as any).robots = 'noindex, nofollow';

  return meta;
}

export default async function Page({ params, searchParams }: incomingRequestParams) {
  let { platform } = await params;
  platform = decodeURI(Array.isArray(platform) ? platform[0] : platform);
  const sParams = await searchParams;
  if (!Object.keys(sParams).includes('page')) sParams['page'] = '1';

  const tabs: string[] = ['all', 'experiment', 'action plan']; 

  return (
    <>
      <Navbar />
      <Hero />
      <Content 
        searchParams={sParams} 
        platform={platform}
        tabs={tabs}
      />
      <Footer />
    </>
  );
}