"use client";
import { useState, useEffect, useCallback } from 'react';
import Card from '@/app/ui/components/Card/collection-card';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import { pagestats, Pagination } from '@/app/ui/components/Pagination';
import platformApi from '@/app/lib/data/platform-api';
import { page_limit, commonsPlatform } from '@/app/lib/utils';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/app/ui/components/Button';
// import Filters from '../Filters';
import clsx from 'clsx';
import { collection as collectionData } from '@/app/lib/data/collection/tempData';

export interface PageStatsResponse {
    total: number;
    pages: number;
}

interface Props {
    searchParams: any;
}

export default function Section({
    searchParams
}: Props) {
    const { sharedState } = useSharedState();
    const { isLogedIn, session } = sharedState || {}
    
    const data = collectionData.map((d: any, i: number) => {
        const { id, ...obj } = d;
        obj.key = id;
        obj.id = i;
        obj.href = `/next-practices/${id}`;
        obj.description = obj.sections[0].items[0].txt;
        // obj.cardBackgroundImage = '/images/Rectangle 68.png';
        return obj
    });

    return (
        <>
        <section className='home-section py-[80px]'>
            <div className='inner mx-auto px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px]'>
                {/* SEARCH */}
                <form id='search-form' method='GET' className='section-header relative pb-[40px] lg:pb-[40px]'>
                    {/*<div className='col-span-4 flex flex-row group items-stretch'>
                    <input type='text' name='search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}  className='bg-white border-black !border-r-0 grow' id='main-search-bar' placeholder='What are you looking for?' />
                    <Button type='submit' className='border-l-0 grow-0'>
                        Search
                    </Button>
                </div>
                <div className='lg:col-end-10'>
                    <button type='button' className='w-full h-[60px] text-[18px] bg-white border-black border-[1px] flex justify-center items-center' onClick={(e) => setFilterVisibility(!filterVisibility)}>
                        <img src='/images/icon-filter.svg' alt='Filter icon' className='mr-[10px]' />
                        {!filterVisibility ? (
                            'Filters'
                        ) : (
                            'Close'
                        )}
                    </button>
                </div>
                <div className='col-span-9'>
                    <Filters 
                        className={clsx(filterVisibility ? '' : 'hidden')}
                        searchParams={searchParams}
                    />
                </div>*/}
                    {/* {
                        isLogedIn && (
                            <div className="flex flex-row font-space-mono">
                                <div className="flex items-center my-1">
                                    <input
                                        type="radio"
                                        className="mr-2 border-solid border-1 hover:border-light-blue disabled:checked:text-gray-500"
                                        name="space"
                                        onChange={(e) => handleSpace(e, 'published')}
                                        checked={_space === 'published'}
                                        value={'published'}
                                    />
                                    <label className={clsx("flex-grow", 'text-gray-800')}>Published</label>
                                </div>
                                <div className="flex items-center my-1">
                                    <input
                                        type="radio"
                                        className="mr-2 border-solid border-1 hover:border-light-blue disabled:checked:text-gray-500"
                                        name="space"
                                        onChange={(e) => handleSpace(e, 'private')}
                                        checked={_space === 'private'}
                                        value={'private'}
                                    />
                                    <label className={clsx("flex-grow", 'text-gray-800')}>Private</label>
                                </div>
                            </div>
                        )} */}
                </form>

                {isLogedIn && session?.pinboards?.length ? (
                    <p className='lead mb-[40px]'>
                        Browse through thematic curated boards on frontier sustainable development challenges. Click on “My boards” at the bottom right to access and customize your own boards.
                    </p>
                ) : null}

                <div className='section-content pt-[40px]'>
                    {/* Display Cards */}
                    <div className='grid gap-[20px] md:grid-cols-2 lg:grid-cols-3'>
                        {data?.map((d: any, i: number) => (
                            <Card
                                key={i}
                                id={d.id}
                                title={d.title}
                                description={''}
                                tags={[]}
                                href={d.href}
                                viewCount={d.boards.length}
                                backgroundImage={d.mainImage}
                                openInNewTab={false}
                                className='mt-10'
                            />
                        ))}
                    </div>
                </div>
                {/*<div className='pagination'>
                    <div className='w-full flex justify-center col-start-2'>
                        {!loading ? (
                            <Pagination
                                page={+page}
                                totalPages={pages}
                            />
                        ) : (<small className='block w-full text-center'>Loading pagination</small>)
                        }
                    </div>
                </div>*/}
            </div>
        </section>
        </>
    );
}