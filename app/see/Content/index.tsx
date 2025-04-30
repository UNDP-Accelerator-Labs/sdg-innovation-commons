'use client';
import { useState, useEffect, useCallback } from 'react';
import { MenuItem } from '@headlessui/react';
import Card from '@/app/ui/components/Card/with-img';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import { pagestats, Pagination } from '@/app/ui/components/Pagination';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import platformApi from '@/app/lib/data/platform-api';
import nlpApi from '@/app/lib/data/nlp-api';
import { page_limit, getCountryList } from '@/app/lib/utils';
import { Button } from '@/app/ui/components/Button';
import DropDown from '@/app/ui/components/DropDown';
import Filters from '../Filters';
import clsx from 'clsx';
import ResultsInfo from '@/app/ui/components/ResultInfo';


export interface PageStatsResponse {
  total: number;
  pages: number;
}

interface SectionProps {
  searchParams: any;
}

export default function Section({ searchParams }: SectionProps) {
  const { page, search, thematic_areas, sdgs, countries } = searchParams;

  const { sharedState, setSharedState } = useSharedState();
  const { isLogedIn, session } = sharedState || {};

  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.search || ''
  );
  const [filterVisibility, setFilterVisibility] = useState<boolean>(false);

  const [pages, setPages] = useState<number>(0);
  const [hits, setHits] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [objectIdz, setObjectIdz] = useState<number[]>([]);
  const [hrefs, setHref] = useState<string>('');

  const [useNlp, setUseNlp] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);

  const platform = 'solution';

  async function fetchData(): Promise<void> {
    setLoading(true);

    const { total, pages: totalPages }: PageStatsResponse = await pagestats(
      page,
      platform,
      searchParams
    );
    setPages(totalPages);
    setTotal(total);

    let data: any[];

    if (!search || hasFilterParams()) {
      data = await platformApi(
        { ...searchParams, ...{ limit: page_limit } },
        platform,
        'pads'
      );
      setUseNlp(false);
    } else {
      data = await nlpApi({
        ...searchParams,
        ...{ limit: page_limit, doc_type: platform },
      });
      setUseNlp(true);
    }

    const idz: number[] = data?.map((p) => p?.pad_id || p?.doc_id);
    setObjectIdz(idz);
    const baseUrl = await platformApi(
      { render: true, action: 'download' },
      platform,
      'pads',
      true
    );
    const params = new URLSearchParams();
    idz.forEach((id) => params.append('pads', id.toString()));
    const url = `${baseUrl}&${params.toString()}`;
    setHref(url);
    setHits(data);
    setLoading(false);
  }

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
    const keysToCheck = ['thematic_areas', 'sdgs', 'countries', 'regions'];
    return keysToCheck.some((key) => key in searchParams && searchParams[key]);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <section className="home-section lg:py-[80px]">
        <div className="inner xxl:px-[80px] xxl:w-[1440px] mx-auto w-[375px] px-[20px] md:w-[744px] lg:w-[992px] lg:px-[80px] xl:w-[1200px] xl:px-[40px]">
          {/* SEARCH */}
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
              {(hrefs?.length > 0 || (isLogedIn && search?.length > 0 )) && (
                <DropDown>
                  {hrefs?.length > 0 && (
                    <MenuItem
                      as="button"
                      className="w-full bg-white text-start hover:bg-lime-yellow"
                    >
                      <a
                        className="block p-4 text-base text-inherit data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                        href={hrefs}
                        target="_blank"
                      >
                        Download All
                      </a>
                    </MenuItem>
                  )}
                  {isLogedIn && (search?.length > 0 || hasFilterParams()) && hits.length ? (
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
                  ) : null }
                </DropDown>
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
                useNlp={useNlp}
              />
            </div>
          </form>

          <p className="lead mb-[20px]">
            Pin interesting solutions notes on a board by clicking “Add to
            board”. You can create new boards or add to existing ones.
            {isLogedIn && session?.pinboards?.length ? (
              <>
                Customize your boards by clicking on “My boards” at the bottom
                right.
              </>
            ) : null}
          </p>

           <ResultsInfo total={ hits.length ? total : 0} searchQuery={search} useNlp={useNlp} />

          <div className="section-content">
            {/* Display Cards */}
            <div className="grid gap-[20px] md:grid-cols-2 xl:grid-cols-3">
              {loading ? (
                <ImgCardsSkeleton /> // Show Skeleton while loading
              ) : (
                hits?.map((post: any) => {
                  const countries = getCountryList(post, 3);
                  return (
                    <Card
                      key={post?.doc_id || post?.pad_id}
                      id={post?.doc_id || post?.pad_id}
                      country={countries}
                      title={post?.title || ''}
                      description={
                        post?.snippets?.length
                          ? `${post?.snippets} ${post?.snippets?.length ? '...' : ''}`
                          : post?.snippet
                      }
                      source={post?.base || 'solution'}
                      tagStyle="bg-light-green"
                      tagStyleShade="bg-light-green-shade"
                      href={post?.url}
                      viewCount={0}
                      tags={post?.tags}
                      sdg={`SDG ${post?.sdg?.join('/')}`}
                      backgroundImage={post?.vignette}
                      date={post?.date}
                      engagement={post?.engagement}
                      data={post}
                      isLogedIn={isLogedIn}
                    />
                  );
                })
              )}
            </div>
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
      </section>
    </>
  );
}
