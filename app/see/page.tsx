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
  // support promise or plain object searchParams
  const sParams = await searchParams;

  const title = 'SDG Commons - What We See';
  const filters: string[] = [];
  if (sParams) {
    if (sParams?.q) filters.push(`q: ${sParams.q}`);
    if (sParams?.tag) filters.push(`tag: ${Array.isArray(sParams.tag) ? sParams.tag.join(',') : sParams.tag}`);
    if (sParams?.sort) filters.push(`sort: ${sParams.sort}`);
  }

  const subtitle =
    filters.length > 0
      ? `Explore our notes — ${filters.join(' | ')}`
      : "Explore our notes on solutions to SDG priorities and problems mapped around the world.";

  const metadataBase = new URL('https://sdg-innovation-commons.org');
  const previousImages = (await parent)?.openGraph?.images || [];

  const ogImageUrl = new URL(
    `/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}`,
    metadataBase
  ).toString();

  const meta: Metadata = {
    title,
    description: subtitle,
    metadataBase,
    openGraph: {
      title: title || 'SDG Commons - What We See',
      description: subtitle,
      url: '/see',
      siteName: 'SDG Commons',
      type: 'website',
      images: [ogImageUrl, ...(previousImages as string[])],
    },
    twitter: {
      card: 'summary_large_image',
      title: title || 'SDG Commons - What We See',
      description: subtitle,
      images: [ogImageUrl],
    },
  };

  if (PROD_ENV === 'staging') (meta as any).robots = 'noindex, nofollow';

  return meta;
}

export default async function Page({ params, searchParams }: incomingRequestParams) {
  const sParams = await searchParams;
  if (!Object.keys(sParams).includes('page')) sParams['page'] = '1';

  return (
    <>
      <Navbar />
      <Hero searchParams={sParams} />
      <Content searchParams={sParams} />
      <Footer />
    </>
  );
}