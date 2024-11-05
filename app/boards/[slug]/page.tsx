import Hero from './Hero';
import Info from './Info';
import Content from './Content';
import Navbar from '@/app/ui/components/Navbar';

import platformApi from '@/app/lib/data/platform-api';

import { incomingRequestParams } from '@/app/lib/utils';

export default async function Page({ params, searchParams }: incomingRequestParams) {  

  const { slug } = await params;

  const sParams = await searchParams;
  if (!Object.keys(sParams).includes('page')) sParams['page'] = '1';

  const platform = 'solution';
  const data = await platformApi(
      // { ...searchParams, ...{ limit: page_limit, include_locations: true } },
      { ...sParams, ...{ pinboard: slug } },
      platform,
      'pinboards'
  );

  console.log(data)
  const { title, description, counts, total, contributors, creator }: { title: string, description: string, counts: any[], total: number, contributors: number, creator: any } = data[0];
  const { name: creatorName }: { name: string } = creator || {};

  return (
    <>
      <Navbar />
      <Hero title={title} counts={counts} total={total} contributors={contributors} creatorName={creatorName} />
      <Info description={description} />
      <Content searchParams={sParams} pinboards={data} />
    </>
  );
}
