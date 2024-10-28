import Navbar from '@/app/ui/components/Navbar';
import Hero from './Hero';
import Content from './Content';
import Footer from '@/app/ui/components/Footer';

import { incomingRequestParams } from '@/app/lib/utils';

export default async function Page({ params, searchParams }: incomingRequestParams) {
  let { slug } = await params;
  slug = decodeURI(slug);
  const sParams = await searchParams;
  if (!Object.keys(sParams).includes('page')) sParams['page'] = '1';

  const tabs: string[] = ['experiment', 'action plan']; 

  return (
    <>
    <Navbar />
    <Hero 
      searchParams={sParams}
      platform={slug} 
    />
    <Content 
      searchParams={sParams} 
      platform={slug}
      tabs={tabs}
    />
    <Footer />
    </>
  );
}