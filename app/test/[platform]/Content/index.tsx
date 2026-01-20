'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { useSearchParams } from 'next/navigation';
import { Pagination } from '@/app/ui/components/Pagination';
import Filters from '../Filters';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import ResultsInfo from '@/app/ui/components/ResultInfo';
import RestrictionNotice from '@/app/ui/components/RestrictionNotice';
import { useTestPageData, useSearchTracking } from '../hooks';
import SearchForm from '../components/SearchForm';
import ActionsMenu from '../components/ActionsMenu';
import PlatformTabs from '../components/PlatformTabs';
import ContentGrid from '../components/ContentGrid';
import type { SectionProps } from '../types';

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

  // Use custom hook for data fetching
  const {
    loading,
    hits,
    pages,
    total,
    useNlp,
    objectIds,
    allObjectIds,
    downloadUrl,
    hasFilters,
  } = useTestPageData(platform, searchParams, tabs);

  // Use custom hook for search tracking
  useSearchTracking('test', search, hits.length, page, searchParams);

  const handleAddAllToBoard = (e: React.MouseEvent) => {
    e.preventDefault();
    setSharedState((prevState: any) => ({
      ...prevState,
      addToBoard: {
        showAddToBoardModal: true,
        platform,
        id: objectIds,
        allObjectIdz: allObjectIds,
      },
    }));
  };

  // Handle search form submission
  const handleSearchSubmit = async (e: React.FormEvent) => {
    // Form will naturally update URL params
  };

  const hasSearchOrFilters = Boolean(search?.length || hasFilters);
  const allowDownload = downloadUrl.length > 0;

  return (
    <>
      <section className="home-section py-[80px]">
        <div className="inner xxl:px-[80px] xxl:w-[1440px] mx-auto w-[375px] px-[20px] md:w-[744px] lg:w-[992px] lg:px-[80px] xl:w-[1200px] xl:px-[40px]">
          <SearchForm
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSubmit={handleSearchSubmit}
          >
            <div className="col-span-5 col-start-5 flex flex-row gap-x-5 md:col-span-2 md:col-start-8 lg:col-span-1 lg:col-end-10">
              {(allowDownload || (isLogedIn && hasSearchOrFilters && platform !== 'all')) && (
                <ActionsMenu
                  allowDownload={allowDownload}
                  downloadUrl={downloadUrl}
                  isLoggedIn={isLogedIn || false}
                  hasSearchOrFilters={hasSearchOrFilters && platform !== 'all'}
                  hasResults={hits.length > 0}
                  onAddAllToBoard={handleAddAllToBoard}
                />
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
                platform={platform}
                tabs={tabs}
                useNlp={useNlp}
              />
            </div>
          </SearchForm>

          <p className="lead mb-[40px]">
            Pin interesting experiments and action plans on a board by clicking
            "Add to board". You can create new boards or add to existing ones.
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

          <PlatformTabs
            tabs={tabs}
            currentPlatform={platform}
            searchParams={windowParams}
          />

          <div className="section-content">
            <ContentGrid
              loading={loading}
              items={hits}
              isLoggedIn={isLogedIn || false}
              platform={platform}
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
