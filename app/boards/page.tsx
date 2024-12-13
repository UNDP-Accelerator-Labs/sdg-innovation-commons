import Hero from './Hero';
import Content from './Content';
import Navbar from '@/app/ui/components/Navbar';
import Footer from '@/app/ui/components/Footer';
import BoardsButton from '@/app/ui/components/BoardsButton';

import { incomingRequestParams } from '@/app/lib/utils';

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
    <BoardsButton />
    </>
  );
}
