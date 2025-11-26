'use client';

import { useState, useEffect } from 'react';
import { MenuItem } from '@headlessui/react';
import Card from '@/app/ui/components/Card/with-img';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import { pagestats, Pagination } from '@/app/ui/components/Pagination';
import platformApi, { getRegion } from '@/app/lib/data/platform-api';
import nlpApi from '@/app/lib/data/nlp-api';
import { page_limit } from '@/app/lib/utils';
import clsx from 'clsx';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/app/ui/components/Button';
import Filters from '../Filters';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import DropDown from '@/app/ui/components/DropDown';
import ResultsInfo from '@/app/ui/components/ResultInfo';
import RestrictionNotice from '@/app/ui/components/RestrictionNotice';
import { trackSearch } from '@/app/lib/analytics/search-tracking';

export interface PageStatsResponse {
  total: number;
  pages: number;
}

export interface SectionProps {
  searchParams: any;
  platform: string;
  tabs: string[];
}

type Item = {
  base: string;
  pad_id: number;
};

export default function Section({
  searchParams,
  platform,
  tabs,
}: SectionProps) {
  const { page, search } = searchParams;
  const windowParams = new URLSearchParams(useSearchParams());
  windowParams.set('page', '1');

  const { sharedState, setSharedState } = useSharedState();
  const { isLogedIn, session } = sharedState || {};

  const [searchQuery, setSearchQuery] = useState(search || '');
  const [filterVisibility, setFilterVisibility] = useState<boolean>(false);

  const [pages, setPages] = useState<number>(0);
  const [hits, setHits] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterParams, setfilterParams] = useState<any>(searchParams);

  const [allowDownLoad, setallowDownLoad] = useState<boolean>(false);
  const [hrefs, setHref] = useState<string>('');
  const [objectIdz, setObjectIdz] = useState<number[]>([]);
  const [allObjectIdz, setAllObjectIdz] = useState<any>();

  const [useNlp, setUseNlp] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);

  const handleAddAllToBoard = (e: any) => {
    e.preventDefault();
    setSharedState((prevState: any) => ({
      ...prevState,
      addToBoard: {
        showAddToBoardModal: true,
        platform,
        id: objectIdz,
        allObjectIdz,
      },
    }));
  };

  async function fetchData(): Promise<void> {
    setLoading(true);

    let data: any[];

    if (hasFilterParams() && platform !== 'all') { // Search with filters ==> Use platformApi
      const { total, pages: totalPages }: PageStatsResponse = await pagestats(
        page,
        platform,
        searchParams
      );
      setPages(totalPages);
      data = await platformApi(
        { ...searchParams, ...{ limit: page_limit, include_locations: true } },
        platform,
        'pads'
      );
      setAllObjectIdz(null);
      setallowDownLoad(true);
      setUseNlp(false);
      setTotal(total);

      console.log('using platform api ', hits);
    } else { // Search using NLP
      console.log('using nlp api', search);
      let doc_type: string[];
      if (platform === 'all') doc_type = tabs.slice(1);
      else doc_type = [platform];
      if (searchParams.countries) searchParams.iso3 = searchParams.countries;

      // Ensure searchParams.countries is an array
      const countriesArray = Array.isArray(searchParams.countries)
        ? searchParams.countries
        : searchParams.countries
          ? [searchParams.countries]
          : [];

      if (searchParams.regions) {
        const countries = await getRegion(searchParams.regions);
        searchParams.iso3 = [
          ...countries.map((c: any) => c.iso3),
          ...countriesArray,
        ];
      } else {
        searchParams.iso3 = countriesArray;
      }

      const { total, pages: totalPages }: any = await pagestats(
        page,
        doc_type,
        {
          ...searchParams,
        }
      );
      setPages(totalPages);

      data = await nlpApi({
        ...searchParams,
        ...{ limit: page_limit, doc_type },
      });

      setUseNlp(true);
      setTotal(total);

      const sorted_keys: Record<string, number[]> = {};

      data.forEach((item: Item) => {
        const key = item.base;
        if (!sorted_keys[key]) {
          sorted_keys[key] = [];
        }
        sorted_keys[key].push(item.pad_id);
      });
      setAllObjectIdz(sorted_keys);

      setallowDownLoad(true);
    } // End of search using NLP

    const idz: number[] = data?.map((p) => p?.pad_id || p?.doc_id);
    setObjectIdz(idz);

    //GET download link
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

  function hasFilterParams(): boolean {
    const keysToCheck = ['countries', 'regions', 'thematic_areas', 'sdgs', 'methods', 'datasources'];
    return keysToCheck.some((key) => key in searchParams && searchParams[key]);
  }

  // Handle search form submission
  const handleSearchSubmit = async (e: React.FormEvent) => {
    // Don't prevent default - let the form submit naturally to update URL params
    if (searchQuery && searchQuery.trim().length > 0) {
      // Track the search (don't await to avoid blocking form submission)
      trackSearch({
        query: searchQuery.trim(),
        platform: 'test',
        searchType: 'general',
        resultsCount: hits.length,
        pageNumber: parseInt(page) || 1,
        filters: filterParams
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Track searches when URL parameters change (for direct URL access)
  useEffect(() => {
    if (search && search.trim().length > 0) {
      trackSearch({
        query: search.trim(),
        platform: 'test',
        searchType: 'general',
        resultsCount: hits.length,
        pageNumber: parseInt(page) || 1,
        filters: filterParams
      });
    }
  }, [search, hits.length, page, filterParams]);

  return (
    <>
      <section className="home-section py-[80px]">
        <div className="inner xxl:px-[80px] xxl:w-[1440px] mx-auto w-[375px] px-[20px] md:w-[744px] lg:w-[992px] lg:px-[80px] xl:w-[1200px] xl:px-[40px]">
          {/* Search bar */}
          <form
            id="search-form"
            method="GET"
            onSubmit={handleSearchSubmit}
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
              {(allowDownLoad && hrefs?.length > 0) ||
              (isLogedIn && (search?.length || hasFilterParams()) && platform !== 'all') ? (
                <DropDown>
                  {allowDownLoad && hrefs?.length > 0 && (
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
                  {isLogedIn && (search?.length || hasFilterParams()) && hits.length ? (
                    <MenuItem
                      as="button"
                      className="w-full bg-white text-start hover:bg-lime-yellow"
                    >
                      <div
                        className="block cursor-pointer p-4 text-base text-inherit data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                        onClick={handleAddAllToBoard}
                      >
                        Add All to Board
                      </div>
                    </MenuItem>
                  ) : null}
                </DropDown>
              ) : null}

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
                platform={platform}
                tabs={tabs}
                useNlp={useNlp}
              />
            </div>
          </form>

          <p className="lead mb-[40px]">
            Pin interesting experiments and action plans on a board by clicking
            “Add to board”. You can create new boards or add to existing ones.
            {isLogedIn && session?.pinboards?.length ? (
              <>
                Customize your boards by clicking on “My boards” at the bottom
                right.
              </>
            ) : null}
          </p>

          <ResultsInfo total={ hits.length ? total : 0} searchQuery={search} useNlp={useNlp} />
          {!isLogedIn && (
            <RestrictionNotice />
          )}
          
          {/* Display tabs */}
          <nav className="tabs items-end">
            {tabs.map((d, i) => {
              let txt: string = '';
              if (d === 'all') txt = 'all items';
              else txt = d;
              return (
                <div
                  key={i}
                  className={clsx(
                    'tab tab-line',
                    platform === d ? 'font-bold' : 'yellow'
                  )}
                >
                  <Link
                    href={`/test/${d}?${windowParams.toString()}`}
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
                <ImgCardsSkeleton /> // Show Skeleton while loading
              ) : (
                hits?.map((post: any) => (
                  <Card
                    key={post.doc_id || post?.pad_id}
                    id={post.doc_id || post?.pad_id}
                    country={
                      post?.country === 'NUL' || !post?.country
                        ? 'Global'
                        : post?.country
                    }
                    title={post?.title || ''}
                    description={
                      post?.snippets?.length
                        ? `${post?.snippets} ${post?.snippets?.length ? '...' : ''}`
                        : post?.snippet
                    }
                    source={post?.base || ''}
                    tagStyle={
                      post?.base === 'action plan'
                        ? 'bg-light-yellow'
                        : 'bg-light-orange'
                    }
                    tagStyleShade={
                      post?.base === 'action plan'
                        ? 'bg-light-yellow-shade'
                        : 'bg-light-orange-shade'
                    }
                    href={post?.url}
                    viewCount={0}
                    tags={post?.tags}
                    sdg={`SDG ${post?.sdg?.join('/')}`}
                    backgroundImage={post?.vignette}
                    className=""
                    date={post?.date}
                    engagement={post?.engagement}
                    data={post}
                    isLogedIn={isLogedIn}
                  />
                ))
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
