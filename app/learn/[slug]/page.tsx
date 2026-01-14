import Navbar from '@/app/ui/components/Navbar';
import Hero from './Hero';
import Content from './Content';
import Footer from '@/app/ui/components/Footer';
import type { Metadata, ResolvingMetadata } from 'next';
import { incomingRequestParams } from '@/app/lib/helpers/utils';

const { PROD_ENV } = process.env;

// removed static `metadata` export to allow dynamic metadata generation
export async function generateMetadata(
  { params }: incomingRequestParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURI(slug);
  const title = `SDG Commons - ${decoded}`;
  const description =
    "Explore our curated collection of blogs and publications that foster collaboration, innovation, and continuous learning within the Accelerator Lab networks.";

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
      images: [ogImageUrl, ...(previousImages as string[])],
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogImageUrl],
    },
  };

  if (PROD_ENV === 'staging') (meta as any).robots = 'noindex, nofollow';

  return meta;
}

export default async function Page({ params, searchParams }: incomingRequestParams) {
  let { slug } = await params;
  slug = decodeURI(slug);
  const sParams = await searchParams;
  if (!Object.keys(sParams).includes('page')) sParams['page'] = '1';

  const tabs: string[] = ['all', 'blog', 'publications', ] //'news', 'press release', 'DRA', 'AILA'];

  return (
    <>
    <div className='grid-bg'>
      <Navbar />
      <Hero />
      <Content searchParams={sParams} docType={slug} tabs={tabs} />
    </div>
    <Footer />
    </>
  );
}
