import Navbar from '@/app/ui/components/Navbar';
import Hero from './Hero';
import Content from './Content';
import Footer from '@/app/ui/components/Footer';
import { incomingRequestParams } from '@/app/lib/helpers/utils';

export default async function Page({ params, searchParams }: incomingRequestParams) {
  let { platform } = await params;
  platform = decodeURI(Array.isArray(platform) ? platform[0] : platform);
  const sParams = await searchParams;
  if (!Object.keys(sParams).includes('page')) sParams['page'] = '1';
  const tabs = ['all', 'solution', 'experiment', 'action plan', 'blog', 'publications', ] //'news', "press release"];

  return (
    <>
    <Navbar />
    <div className='grid-bg'>
      <Hero 
        searchParams={sParams} 
        platform={platform}
        tabs={tabs}
      />
      <Content 
        searchParams={sParams} 
        platform={platform}
        tabs={tabs}  
      />
    </div>
    <Footer />
    </>
  );
}