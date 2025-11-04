'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MenuItem } from '@headlessui/react';
import clsx from 'clsx';
import { SectionProps } from '@/app/test/[platform]/Content';
import { Button } from '@/app/ui/components/Button';
import Filters from '@/app/test/[platform]/Filters';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import DropDown from '@/app/ui/components/DropDown';

export default function Hero({ searchParams, platform, tabs }: SectionProps) {
  const { page, search } = searchParams;
  const windowParams = new URLSearchParams(useSearchParams());
  windowParams.set('page', '1');

  const [searchQuery, setSearchQuery] = useState(search || '');
  const [filterVisibility, setFilterVisibility] = useState<boolean>(false);

  const { sharedState, setSharedState } = useSharedState();
  const { isLogedIn, session } = sharedState || {};
  const { objectIdz, allObjectIdz } = sharedState?.searchData || {};

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

  function hasFilterParams(): boolean {
    const keysToCheck = ['countries'];
    return keysToCheck.some((key) => key in searchParams && searchParams[key]);
  }

  return (
    <>
      <section className="lg:home-section relative !border-t-0">
        {/*<img className='w-[40%] absolute left-0 bottom-[-15%]' alt="Branding illustration" src="/images/hero_learn_hand_01.png" />*/}
        <div className="inner xxl:px-[80px] xxl:w-[1440px] mx-auto w-[375px] px-[20px] md:w-[744px] lg:w-[992px] lg:px-[80px] xl:w-[1200px] xl:px-[40px]">
          <div className="section-content grid grid-cols-9 gap-[20px] lg:pt-[80px]">
            <div className="c-left lg:col-span-5 lg:mb-[60px] lg:mt-[80px]">
              <h1>
                <span className="slanted-bg yellow">
                  <span>
                    {search?.length ? (
                      <>
                        Search Results for
                        <br />
                        {search}
                      </>
                    ) : (
                      <>Search</>
                    )}
                  </span>
                </span>
              </h1>
            </div>
          </div>
        </div>
      </section>
      <section className="home-section !border-t-0 py-0">
        <div className="inner xxl:px-[80px] xxl:w-[1440px] mx-auto w-[375px] px-[20px] md:w-[744px] lg:w-[992px] lg:px-[80px] xl:w-[1200px] xl:px-[40px]">
          {/* Search bar */}
          <form
            id="search-form"
            method="GET"
            className="section-header relative pb-[40px] lg:pb-[80px]"
          >
            <div className="group col-span-9 flex flex-row items-stretch lg:col-span-4">
              <input
                type="text"
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="grow !border-r-0 border-black bg-white"
                id="main-search-bar"
                placeholder="Looking for something?"
              />
              <Button type="submit" className="grow-0 border-l-0">
                Search
              </Button>
            </div>

            <div className="col-span-5 col-start-5 flex flex-row gap-x-5 md:col-span-2 md:col-start-8 lg:col-span-1 lg:col-end-10">
              {isLogedIn && (search?.length || hasFilterParams()) && objectIdz.length ? (
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
                platform={'all'}
                tabs={tabs}
              />
            </div>
          </form>
          <p className="lead mt-[-40px] mb-[20px]">
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
        </div>
      </section>
    </>
  );
}
