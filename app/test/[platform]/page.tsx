import Navbar from '@/app/ui/components/Navbar';
import Hero from './Hero';
import Content from './Content';
import Footer from '@/app/ui/components/Footer';
import { Metadata } from 'next';
import { incomingRequestParams } from '@/app/lib/utils';

const { PROD_ENV } = process.env;

export const metadata: Metadata = {
  title: 'SDG Commons - What We Test',
  description: "Discover wicked development challenges we are curious about and the experiments conducted to learn what works and what doesn't in sustainable development.",
  ...(PROD_ENV === 'staging' && {
    robots: 'noindex, nofollow',
  }),
}

export default async function Page({ params, searchParams }: incomingRequestParams) {
  let { platform } = await params;
  platform = decodeURI(platform);
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