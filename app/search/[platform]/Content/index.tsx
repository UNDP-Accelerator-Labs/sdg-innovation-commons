'use client';

import { useState, useEffect } from 'react';
import BlogCard from '@/app/ui/components/Card/without-img';
import Card from '@/app/ui/components/Card/with-img';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import nlpApi from '@/app/lib/data/nlp-api';
import { formatDate, page_limit, getCountryList } from '@/app/lib/utils';
import clsx from 'clsx';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { pagestats, Pagination } from '@/app/ui/components/Pagination';
import { PageStatsResponse, SectionProps } from '@/app/test/[platform]/Content';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import ResultsInfo from '@/app/ui/components/ResultInfo';

export default function Content({
  searchParams,
  platform,
  tabs,
}: SectionProps) {
  const { page, search } = searchParams;
  const windowParams = new URLSearchParams(useSearchParams());
  windowParams.set('page', '1');

  const [pages, setPages] = useState<number>(0);
  const [hits, setHits] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [allObjectIdz, setAllObjectIdz] = useState<any>();
  const [objectIdz, setObjectIdz] = useState<number[]>([]);

  const { sharedState, setSharedState } = useSharedState();

  const initialTab = platform || tabs[0];

  // Manage the active tab and data
  const [docType, setDocType] = useState<string>(initialTab);
  const [total, setTotal] = useState<number>(0);

  async function fetchData(): Promise<void> {
    setLoading(true);

    let data: any[];
    let doc_type: string[];
    if (platform === 'all') doc_type = tabs.slice(1);
    else doc_type = [platform];
    if (searchParams.countries) searchParams.iso3 = searchParams.countries;

    const { total, pages: totalPages }: PageStatsResponse = await pagestats(
      page,
      doc_type,
      {
        ...searchParams,
      }
    );
    setPages(totalPages);
    setTotal(total);

    data = await nlpApi({
      ...searchParams,
      ...{ limit: page_limit, doc_type },
    });
    setHits(data);

    const idz: number[] = data?.map((p) => p?.pad_id || p?.doc_id);
    setObjectIdz(idz);

    const sorted_keys: Record<string, number[]> = {};

    data.forEach((item: any) => {
      const key = item.base;
      if (!sorted_keys[key]) {
        sorted_keys[key] = [];
      }
      sorted_keys[key].push(item?.pad_id || item?.doc_id);
    });
    setAllObjectIdz(sorted_keys);

    setLoading(false);
  }

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setSharedState((prevState: any) => ({
      ...prevState,
      searchData: {
        allObjectIdz,
        objectIdz,
      },
    }));
  }, [loading, allObjectIdz]);

  return (
    <>
      {/* Display results info */}
      <section className="home-section !border-t-0 py-0">
        <div className="inner xxl:px-[80px] xxl:w-[1440px] mx-auto w-[375px] px-[20px] md:w-[744px] lg:w-[992px] lg:px-[80px] xl:w-[1200px] xl:px-[40px]">
          <ResultsInfo total={ hits.length ? total : 0} searchQuery={search} useNlp={true} />
        </div>
      </section>

      <section className="lg:home-section !border-t-0 lg:pb-[80px]">
        <div className="inner xxl:px-[80px] xxl:w-[1440px] mx-auto w-[375px] px-[20px] md:w-[744px] lg:w-[992px] lg:px-[80px] xl:w-[1200px] xl:px-[40px]">
          {/* Display tabs */}
          <nav className="tabs">
            {tabs.map((d, i) => {
              let txt: string = '';
              if (d === 'all') txt = 'all items';
              else txt = d;
              return (
                <div
                  key={i}
                  className={clsx(
                    'tab tab-line',
                    docType === d ? 'font-bold' : 'yellow'
                  )}
                >
                  <Link
                    href={`/search/${d}?${windowParams.toString()}`}
                    scroll={false}
                  >
                    {`${txt}${txt.slice(-1) === 's' ? '' : 's'}`}
                  </Link>
                </div>
              );
            })}
          </nav>
          <div className="section-content">
            {/* Display Cards */}
            <div className="grid gap-[20px] md:grid-cols-2 xl:grid-cols-3">
              {loading ? (
                <ImgCardsSkeleton />
              ) : (
                hits?.map((post: any, i: number) => {
                  if (post?.base == 'blog') {
                    return (
                      <BlogCard
                        key={i}
                        id={post.doc_id}
                        // country={post?.meta?.iso3[0] === 'NUL' || !post?.meta?.iso3[0] ? 'Global' : post?.meta?.iso3[0]}
                        country={
                          post?.country === 'NUL' || !post?.country
                            ? 'Global'
                            : post?.country
                        }
                        date={formatDate(post?.meta?.date) || ''}
                        title={post?.title || ''}
                        description={`${post?.snippets} ${post?.snippets?.length ? '...' : ''}`}
                        tags={post?.base || ''}
                        tagStyle="bg-light-blue"
                        href={post?.url}
                        openInNewTab={true}
                        source={post?.base || 'blog'}
                        isLogedIn={sharedState?.isLogedIn}
                        data={post}
                      />
                    );
                  } else {
                    let color: string = 'green';
                    let path: string = 'see';
                    if (post?.base === 'action plan') {
                      color = 'yellow';
                      path = 'test';
                    } else if (post?.base === 'experiment') {
                      color = 'orange';
                      path = 'test';
                    }
                    const countries = getCountryList(post, 3);
                    return (
                      <Card
                        key={i}
                        id={post?.doc_id || post?.pad_id}
                        country={countries}
                        title={post?.title || ''}
                        description={
                          post?.snippet?.length
                            ? `${post?.snippet?.length > 200 ? `${post.snippet.slice(0, 200)}…` : post.snippet}`
                            : post?.snippets
                        }
                        source={post?.base || 'solution'}
                        tagStyle={`bg-light-${color}`}
                        tagStyleShade={`bg-light-${color}-shade`}
                        href={post?.url}
                        viewCount={0}
                        tags={post?.tags}
                        sdg={
                          post?.sdg?.length ? `SDG ${post?.sdg?.join('/')}` : ''
                        }
                        backgroundImage={post?.vignette}
                        date={post?.date}
                        data={post}
                        isLogedIn={sharedState?.isLogedIn}
                      />
                    );
                  }
                })
              )}
            </div>
          </div>

          <div className="pagination">
            <div className="col-start-2 flex w-full justify-center">
              {!loading ? (
                <>
                  {hits.length ? <Pagination page={+page} totalPages={pages} /> : null}
                </>
              ) : (
                <small className="block w-full text-center">
                  Loading pagination
                </small>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
