'use client';
import { useState, useEffect } from 'react';
import Card from '@/app/ui/components/Card/featured-card';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import { Pagination } from '@/app/ui/components/Pagination';
import platformApi from '@/app/lib/data/platform-api';
import { page_limit, commonsPlatform } from '@/app/lib/utils';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/app/ui/components/Button';
import CreateBoard from '@/app/ui/board/Create';

export interface PageStatsResponse {
  total: number;
  pages: number;
}

interface Props {
  searchParams: any;
}

export default function Section({ searchParams }: Props) {
  const { page, search, space } = searchParams;
  const windowParams = new URLSearchParams(useSearchParams());

  const { sharedState } = useSharedState();
  const { isLogedIn, session } = sharedState || {};

  const [pages, setPages] = useState<number>(0);
  const [hits, setHits] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [_space, setSpace] = useState<string>(space || 'published');
  windowParams.set('space', _space);

  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  // LIMIT THE DATABASES TO PULL BOARDS FROM
  const databases = commonsPlatform
    .filter((d: any) => d.shortkey)
    .map((d: any) => d.shortkey);

  async function fetchData(): Promise<void> {
    setLoading(true);
    const { data, count } = await platformApi(
      { ...searchParams, ...{ limit: page_limit, space: _space, databases } },
      'experiment', // IN THIS CASE, PLATFORM IS IRRELEVANT, SINCE IT IS PULLING FROM THE GENERAL DB
      'pinboards'
    );
    const pages = Math.ceil(count / page_limit);

    setHits(data);
    setPages(pages);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [_space]);

  return (
    <>
      {/* TEMP: WHILE WE DO NOT HAVE A SOLUTION FOR SEARCHING THROUGH BOARDS, REMOVE THE PADDING FROM THE section ELEMENT */}
      {/*<section className='home-section py-[80px] border-t-0'>*/}
      <section className="home-section border-t-0 pb-[80px]">
        <div className="inner xxl:px-[80px] xxl:w-[1440px] mx-auto w-[375px] px-[20px] md:w-[744px] lg:w-[992px] lg:px-[80px] xl:w-[1200px] xl:px-[40px]">
          {/* SEARCH */}
          <form
            id="search-form"
            method="GET"
            className="section-header relative pb-[40px] lg:pb-[40px]"
          >
            <div className="group col-span-4 flex flex-row items-stretch">
              <input
                type="text"
                name="search"
                className="grow !border-r-0 border-black bg-white"
                id="main-search-bar"
                placeholder="What are you looking for?"
              />
              <input
                type="text"
                name="space"
                defaultValue={_space}
                className="hidden"
              />
              <Button type="submit" className="grow-0 border-l-0">
                Search
              </Button>
            </div>
            {isLogedIn && <div className="lg:col-end-10">
                <Button onClick={e=>{
                    e.preventDefault()
                    setModalOpen(true)
                }} className="grow-0 whitespace-nowrap">
                    Create board
                </Button>
            </div>}

          </form>

          {isLogedIn && session?.pinboards?.length ? (
            <p className="lead mb-[40px]">
              Click on “My boards” at the bottom right to access and customize
              your own boards.
            </p>
          ) : null}

          <div className="section-content">
            {/* Display Cards */}
            <div className="grid gap-[20px] md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <ImgCardsSkeleton /> // Show Skeleton while loading
              ) : (
                hits?.map((post: any) => (
                  <Card
                    key={post?.pinboard_id}
                    id={post?.pinboard_id}
                    country={
                      post?.country === 'NUL' || !post?.country
                        ? 'Global'
                        : post?.country
                    }
                    title={post?.title || ''}
                    description={
                      post?.description?.length > 200
                        ? `${post?.description.slice(0, 200)}…`
                        : post?.description
                    }
                    source={post?.base || 'solution'}
                    tagStyle="bg-light-green"
                    tagStyleShade="bg-light-green-shade"
                    href={`/boards/all/${post?.pinboard_id}`}
                    backgroundImage={post?.vignette}
                    date={post?.date}
                    viewCount={post.total}
                  />
                ))
              )}
            </div>
          </div>
          <div className="pagination">
            <div className="col-start-2 flex w-full justify-center">
              {!loading ? (
                <Pagination page={+page} totalPages={pages} />
              ) : (
                <small className="block w-full text-center">
                  Loading pagination
                </small>
              )}
            </div>
          </div>
        </div>
      </section>

      <CreateBoard isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
