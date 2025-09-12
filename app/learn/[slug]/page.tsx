import Navbar from '@/app/ui/components/Navbar';
import Hero from './Hero';
import Content from './Content';
import Footer from '@/app/ui/components/Footer';
import type { Metadata } from 'next';
import { incomingRequestParams } from '@/app/lib/utils';

const { PROD_ENV } = process.env;

export const metadata: Metadata = {
  title: 'SDG Commons - What We Learn',
  description: "Explore our curated collection of blogs and publications that foster collaboration, innovation, and continuous learning within the Accelerator Lab networks.",
  ...(PROD_ENV === 'staging' && {
    robots: 'noindex, nofollow',
  }),
}

export default async function Page({ params, searchParams }: incomingRequestParams) {
  let { slug } = await params;
  slug = decodeURI(slug);
  const sParams = await searchParams;
  if (!Object.keys(sParams).includes('page')) sParams['page'] = '1';

  const tabs: string[] = ['all', 'blog', 'publications', 'DRA', 'AILA'] //'news', 'press release'];

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
