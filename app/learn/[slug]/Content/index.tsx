'use client';

import { useState, useEffect } from 'react';
import { MenuItem } from '@headlessui/react';
import Card from '@/app/ui/components/Card/without-img';
import { NoImgCardSkeleton } from '@/app/ui/components/Card/skeleton';
import { pagestats, Pagination } from '@/app/ui/components/Pagination';
import nlpApi from '@/app/lib/data/nlp-api';
import { formatDate, page_limit } from '@/app/lib/utils';
import { PostProps } from '@/app/lib/definitions';
import clsx from 'clsx';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/app/ui/components/Button';
import Filters from '../Filters';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import DropDown from '@/app/ui/components/DropDown';
import ResultsInfo from '@/app/ui/components/ResultInfo';

export interface PageStatsResponse {
  total: number;
  pages: number;
}

interface SectionProps {
  searchParams: any;
  tabs: any;
  docType: string;
}

export default function Section({ searchParams, tabs, docType }: SectionProps) {
  const { page, search } = searchParams;
  const windowParams = new URLSearchParams(useSearchParams());
  windowParams.set('page', '1');

  const platform = 'blog';
  const { sharedState, setSharedState } = useSharedState();
  const { isLogedIn, session } = sharedState || {};

  const [pages, setPages] = useState<number>(0);
  const [hits, setHits] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [filterVisibility, setFilterVisibility] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState(search || '');

  const [objectIdz, setObjectIdz] = useState<number[]>([]);
  const [useNlp, setUseNlp] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  
  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      if (searchParams.countries) searchParams.iso3 = searchParams.countries;

      let doc_type: string[];
      if (docType === 'all') doc_type = tabs.slice(1);
      else doc_type = [docType];

      const { total, pages: totalPages }: PageStatsResponse = await pagestats(
        page,
        doc_type,
        {
          ...searchParams,
        }
      );
      setPages(totalPages);
      setTotal(total);

     
      const data = await nlpApi({
        ...searchParams,
        ...{ limit: page_limit, doc_type },
      });
      setUseNlp(true);

      setHits(data);

      const idz: number[] = data?.map((p: any) => p?.doc_id);
      setObjectIdz(idz);

      setLoading(false);
    }
    fetchData();
  }, []);

  const handleAddAllToBoard = (e: any) => {
    e.preventDefault();
    setSharedState((prevState: any) => ({
      ...prevState,
      addToBoard: {
        showAddToBoardModal: true,
        platform,
        id: objectIdz,
      },
    }));
  };

  function hasFilterParams(): boolean {
    const keysToCheck = ['countries'];
    return keysToCheck.some((key) => key in searchParams && searchParams[key]);
  }

  return (
    <>
      <section className="home-section !border-none py-[80px]">
        <div className="inner xxl:px-[80px] xxl:w-[1440px] mx-auto w-[375px] px-[20px] md:w-[744px] lg:w-[992px] lg:px-[80px] xl:w-[1200px] xl:px-[40px]">
          {/* Search bar */}
          <form
            id="search-form"
            method="GET"
            className="section-header relative pb-[40px] lg:pb-[40px]"
          >
            <div className="group col-span-9 flex flex-row items-stretch lg:col-span-4">
              <input
                type="text"
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="grow !border-r-0 border-black bg-white"
                id="main-search-bar"
                placeholder="What are you looking for?"
              />
              <Button type="submit" className="grow-0 border-l-0">
                Search
              </Button>
            </div>
            <div className="col-span-5 col-start-5 flex flex-row gap-x-5 md:col-span-2 md:col-start-8 lg:col-span-1 lg:col-end-10">
              {isLogedIn && (search?.length || hasFilterParams() ) && hits.length ? (
                <DropDown>
                  <MenuItem
                    as="button"
                    className="w-full bg-white text-start hover:bg-lime-yellow"
                  >
                    <div
                      className="block border-none bg-inherit p-4 text-base text-inherit focus:bg-gray-100 focus:text-gray-900 focus:outline-none"
                      onClick={handleAddAllToBoard}
                    >
                      Add All to Board
                    </div>
                  </MenuItem>
                </DropDown>
              ) : (
                ''
              )}
              <button
                type="button"
                className="flex h-[60px] w-full cursor-pointer items-center justify-center border-[1px] border-black bg-white text-[18px]"
                onClick={(e) => setFilterVisibility(!filterVisibility)}
              >
                <img
                  src="/images/icon-filter.svg"
                  alt="Filter icon"
                  className="mr-[10px]"
                />
                {!filterVisibility ? 'Filters' : 'Close'}
              </button>
            </div>
            <div className="col-span-9">
              <Filters
                className={clsx(filterVisibility ? '' : 'hidden')}
                searchParams={searchParams}
                platform={docType}
                tabs={tabs}
                useNlp={useNlp}
              />
            </div>
          </form>
 
          <p className="lead mb-[20px]">
            Pin interesting blogs and publications on a
            board by clicking “Add to board”. You can create new boards or add
            to existing ones.
            {isLogedIn && session?.pinboards?.length ? (
              <>
                Customize your boards by clicking on “My boards” at the bottom
                right.
              </>
            ) : null}
          </p>
          {/* Display results info */}
          <ResultsInfo total={ hits.length ? total : 0} searchQuery={searchQuery} useNlp={useNlp} />

          {/* Display tabs */}
          <nav className="tabs flex-wrap items-end">
            {tabs.map((d: any, i: number) => {
              let txt: string = '';
              if (d === 'all') txt = 'all items';
              else txt = d;
              return (
                <div
                  key={i}
                  className={clsx(
                    'tab tab-line mb-[10px] md:mb-0 lg:mb-0',
                    docType === d ? 'font-bold' : 'yellow'
                  )}
                >
                  <Link href={`/learn/${d}?${windowParams.toString()}`}>
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
                <>
                  {new Array(page_limit).fill(0).map((d, i) => (
                    <NoImgCardSkeleton key={i} />
                  ))}
                </>
              ) : (
                hits?.map((post: any, i: number) => {
                  return (
                    <Card
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
                      tags={post?.meta?.doc_type || ''}
                      tagStyle="bg-light-blue"
                      href={post?.url}
                      openInNewTab={true}
                      source={post?.meta?.doc_type || 'blog'}
                      isLogedIn={isLogedIn}
                      data={post}
                    />
                  );
                })
              )}
            </div>
            <div className="pagination">
              <div className="col-start-2 flex w-full justify-center">
                {!loading ? (
                  <>
                    {hits.length ? (
                      <Pagination page={+page} totalPages={pages} />
                    ) : null}
                  </>
                ) : (
                  <small className="block w-full text-center">
                    Loading pagination
                  </small>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
