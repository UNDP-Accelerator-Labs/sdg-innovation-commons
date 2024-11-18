import Navbar from '@/app/ui/components/Navbar';
import Hero from './Hero';
import Content from './Content';
import Footer from '@/app/ui/components/Footer';

import { incomingRequestParams } from '@/app/lib/utils';

export default async function Page({ params, searchParams }: incomingRequestParams) {
  let { platform } = await params;
  platform = decodeURI(platform);
  const sParams = await searchParams;
  if (!Object.keys(sParams).includes('page')) sParams['page'] = '1';

  // const tabs: string[] = ['experiment', 'action plan']; 
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