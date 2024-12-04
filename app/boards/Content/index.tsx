"use client";
import { useState, useEffect, useCallback } from 'react';
import Card from '@/app/ui/components/Card/featured-card';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import { pagestats, Pagination } from '@/app/ui/components/Pagination';
import platformApi from '@/app/lib/data/platform-api';
import { page_limit } from '@/app/lib/utils';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/app/ui/components/Button';
// import Filters from '../Filters';
import clsx from 'clsx';

export interface PageStatsResponse {
    total: number;
    pages: number;
}

interface SectionProps {
    searchParams: any;
}

export default function Section({
    searchParams
}: SectionProps) {
    const { page, search, space } = searchParams;
    const windowParams = new URLSearchParams(useSearchParams());

    const [pages, setPages] = useState<number>(0);
    const [hits, setHits] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [_space, setSpace] = useState<string>(space || 'published');
    windowParams.set('space', _space);
    const { sharedState } = useSharedState();
    const { isLogedIn } = sharedState || {}
  

    async function fetchData(): Promise<void> {
        setLoading(true);
        const { data, count } = await platformApi(
            { ...searchParams, ...{ limit: page_limit, space: _space } },
            'solution', // IN THIS CASE, PLATFORM IS IRRELEVANT, SINCE IT IS PULLING FROM THE GENERAL DB
            'pinboards'
        );
        const pages = Math.ceil(count / page_limit);

        setHits(data);
        setPages(pages);
        setLoading(false);
    }

    const handleSpace = (e: any, space: string)=>{
        setSpace(space)
        const form = e.target.closest('form');
        form.submit();
    }

    useEffect(() => {
        fetchData();
    }, [_space]);

    return (
        <>
            <section className='home-section py-[80px]'>
                <div className='inner mx-auto px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px]'>
                    {/* SEARCH */}
                    <form id='search-form' method='GET' className='section-header relative pb-[40px] lg:pb-[80px]'>
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
                        {
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
                            )}
                    </form>

                    <div className='section-content'>
                        {/* Display Cards */}
                        <div className='grid gap-[20px] md:grid-cols-2 lg:grid-cols-3'>
                            {loading ? (
                                <ImgCardsSkeleton /> // Show Skeleton while loading
                            ) : (
                                hits?.map((post: any) => (
                                    <Card
                                        key={post?.pinboard_id}
                                        id={post?.pinboard_id}
                                        country={post?.country === 'NUL' || !post?.country ? 'Global' : post?.country}
                                        title={post?.title || ''}
                                        description={post?.description?.length > 200 ? `${post?.description.slice(0, 200)}…` : post?.description}
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
                    <div className='pagination'>
                        <div className='w-full flex justify-center col-start-2'>
                            {!loading ? (
                                <Pagination
                                    page={+page}
                                    totalPages={pages}
                                />
                            ) : (<small className='block w-full text-center'>Loading pagination</small>)
                            }
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}