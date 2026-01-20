import Hero from './Hero';
import Content from './Content';
import Navbar from '@/app/ui/components/Navbar';
import Footer from '@/app/ui/components/Footer';
import type { Metadata, ResolvingMetadata } from 'next';
import { incomingRequestParams } from '@/app/lib/helpers/utils';

export async function generateMetadata(
  { params, searchParams }: { params?: any; searchParams?: any },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { PROD_ENV } = process.env;

  // support both promise and plain object searchParams
  const sParams = await searchParams;

  const title = 'SDG Commons - Community Curated Boards';
  // build a subtitle that can include selected filters/queries from searchParams
  const filters = [];
  if (sParams) {
    if (sParams?.q) filters.push(`q: ${sParams.q}`);
    if (sParams?.tag) filters.push(`tag: ${Array.isArray(sParams.tag) ? sParams.tag.join(',') : sParams.tag}`);
    if (sParams?.sort) filters.push(`sort: ${sParams.sort}`);
  }
  const subtitle =
    filters.length > 0
      ? `Browse community curated boards — ${filters.join(' | ')}`
      : "Browse through community curated boards of what we see, what we test, and what we learn.";

  const metadataBase = new URL('https://sdg-innovation-commons.org');
  const previousImages = (await parent)?.openGraph?.images || [];

  // point to dynamic OG generator endpoint with encoded text
  const ogImageUrl = new URL(
    `/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}`,
    metadataBase
  ).toString();

  const meta: Metadata = {
    title,
    description: subtitle,
    metadataBase,
    openGraph: {
      title: title || 'SDG Commons - Community Curated Boards',
      description: subtitle,
      url: '/boards',
      siteName: 'SDG Commons',
      type: 'website',
      images: [ogImageUrl, ...(previousImages as string[])],
    },
    twitter: {
      card: 'summary_large_image',
      title: title || 'SDG Commons - Community Curated Boards',
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
    <div className='grid-bg'>
      <Hero searchParams={sParams} />
      <Content searchParams={sParams} />
    </div>
    <Footer />
    </>
  );
}
