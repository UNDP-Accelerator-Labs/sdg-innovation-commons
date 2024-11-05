import Hero from './Hero';
import Content from './Content';
import Navbar from '@/app/ui/components/Navbar';
// import { get_all_collections } from '@/app/lib/data/collections';

import { incomingRequestParams } from '@/app/lib/utils';

export default async function Page({ params, searchParams }: incomingRequestParams) {
  // const data = await get_all_collections({})

  const sParams = await searchParams;
  if (!Object.keys(sParams).includes('page')) sParams['page'] = '1';

  return (
    <>
      <Navbar />
      <Hero />
      <Content searchParams={sParams} />
    </>
  );
}
