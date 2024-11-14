import Hero from '../Hero';
import Content from './Content';
import Navbar from '@/app/ui/components/Navbar';
import Footer from '@/app/ui/components/Footer';

import platformApi from '@/app/lib/data/platform-api';
import { commonsPlatform, page_limit } from '@/app/lib/utils';

import { incomingRequestParams } from '@/app/lib/utils';

export default async function Page({ params, searchParams }: incomingRequestParams) {  

  let { slug, platform } = await params;
  platform = decodeURI(platform);

  const sParams = await searchParams;
  if (!Object.keys(sParams).includes('page')) sParams['page'] = '1';

  let pages: number = 1;
  const data: any = await platformApi(
      // { ...searchParams, ...{ limit: page_limit, include_locations: true } },
      { ...sParams, ...{ pinboard: slug, limit: page_limit } },
      'solution', // IN THIS CASE, PLATFORM IS IRRELEVANT, SINCE IT IS PULLING FROM THE GENERAL DB
      'pinboards'
  );
  pages = Math.ceil(data.total / page_limit);

  const platforms = data.counts
    .map((c: any) => {
        c.pinboard_id = data.pinboard_id;
        return c;
    });

  const tabs = platforms.map((d: any) => {
      return commonsPlatform.find((c: any) => c.shortkey === d.platform)?.key || d.platform;
  });
  if (tabs.length > 1) tabs.unshift('all');

  const { title, description, counts, total, contributors, creator }: { title: string, description: string, counts: any[], total: number, contributors: number, creator: any } = data;
  const { name: creatorName }: { name: string } = creator || {};

  return (
    <>
      <Navbar />
      <Hero title={title} counts={counts} total={total} contributors={contributors} creatorName={creatorName} platforms={platforms} searchParams={sParams} board={+slug} />
      <Content searchParams={sParams} platforms={platforms} pads={data.pads} tabs={tabs} board={+slug} platform={platform} description={description} />
      <Footer />
    </>
  );
}