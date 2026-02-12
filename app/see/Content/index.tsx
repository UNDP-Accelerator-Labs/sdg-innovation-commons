'use client';

import { useState } from 'react';
import { MenuItem } from '@headlessui/react';
import clsx from 'clsx';
import { Pagination } from '@/app/ui/components/Pagination';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import { Button } from '@/app/ui/components/Button';
import DropDown from '@/app/ui/components/DropDown';
import Filters from '../Filters';
import ResultsInfo from '@/app/ui/components/ResultInfo';
import RestrictionNotice from '@/app/ui/components/RestrictionNotice';
import { useSeePageData, useSeeSearchTracking } from '../hooks';
import ContentGrid from '../components/ContentGrid';
import type { SectionProps } from '../types';

export default function Section({ searchParams }: SectionProps) {
  const { page, search, thematic_areas, sdgs, countries } = searchParams;

  const { sharedState, setSharedState } = useSharedState();
  const { isLogedIn, session } = sharedState || {};

  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.search || ''
  );
  const [filterVisibility, setFilterVisibility] = useState<boolean>(false);

  // Use custom hook for data fetching
  const {
    loading,
    hits,
    pages,
    total,
    useNlp,
    objectIds,
    downloadUrl,
    hasFilters,
  } = useSeePageData(searchParams);

  // Use custom hook for search tracking
  useSeeSearchTracking(search, hits.length, page, { thematic_areas, sdgs, countries });

  const handleAddAllToBoard = (e: React.MouseEvent) => {
    e.preventDefault();
    setSharedState((prevState: any) => ({
      ...prevState,
      addToBoard: {
        showAddToBoardModal: true,
        platform: 'solution',
        id: objectIds,
      },
    }));
  };

  // Handle search form submission
  const handleSearchSubmit = async (e: React.FormEvent) => {
    // Form will naturally update URL params
  };

  const hasSearchOrFilters = Boolean(search?.length > 0 || hasFilters);

  return (
    <>
      <section className="home-section lg:py-[80px]">
        <div className="inner xxl:px-[80px] xxl:w-[1440px] mx-auto w-[375px] px-[20px] md:w-[744px] lg:w-[992px] lg:px-[80px] xl:w-[1200px] xl:px-[40px]">
          {/* SEARCH */}
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
              {((isLogedIn && search?.length > 0)) && (
                <DropDown>
                  {/* {downloadUrl?.length > 0 && (
                    <MenuItem
                      as="button"
                      className="w-full bg-white text-start hover:bg-lime-yellow"
                    >
                      <a
                        className="block p-4 text-base text-inherit data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download All
                      </a>
                    </MenuItem>
                  )} */}
                  {isLogedIn && hasSearchOrFilters && hits.length ? (
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
                  ) : null}
                </DropDown>
              )}

              <button
                type="button"
                className="flex h-[60px] w-full cursor-pointer items-center justify-center border-[1px] border-black bg-white text-[18px]"
                onClick={() => setFilterVisibility(!filterVisibility)}
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
            Pin interesting solutions notes on a board by clicking "Add to
            board". You can create new boards or add to existing ones.
            {isLogedIn && session?.pinboards?.length ? (
              <>
                {' '}
                Customize your boards by clicking on "My boards" at the bottom
                right.
              </>
            ) : null}
          </p>

          <ResultsInfo total={hits.length ? total : 0} searchQuery={search} useNlp={useNlp} />
          {!isLogedIn && <RestrictionNotice />}

          <div className="section-content">
            <ContentGrid
              loading={loading}
              items={hits}
              isLoggedIn={isLogedIn || false}
            />
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
