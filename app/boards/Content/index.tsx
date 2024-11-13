"use client";
import { useState, useEffect, useCallback } from 'react';
import Card from '@/app/ui/components/Card/featured-card';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import { pagestats, Pagination } from '@/app/ui/components/Pagination';
import platformApi from '@/app/lib/data/platform-api';
import nlpApi from '@/app/lib/data/nlp-api';
import { page_limit } from '@/app/lib/utils';
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
    const { page, search } = searchParams;

    const [searchQuery, setSearchQuery] = useState<string>(searchParams.search || '');
    const [filterVisibility, setFilterVisibility] = useState<boolean>(false);

    const [pages, setPages] = useState<number>(0);
    const [hits, setHits] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // const platform = 'solution';

    async function fetchData(): Promise<void> {
        setLoading(true);

        // const { total, pages: totalPages }: PageStatsResponse = await pagestats(page, platform, 3);
        // setPages(totalPages);
        
        // let data: any[];

        // if (!search) {
            const { data, count } = await platformApi(
                { ...searchParams, ...{ limit: page_limit } },
                'solution', // IN THIS CASE, PLATFORM IS IRRELEVANT, SINCE IT IS PULLING FROM THE GENERAL DB
                'pinboards'
            );
        // } 
        // else {
        //     console.log('look for search term', search)
        //     data = await nlpApi(
        //         { ...searchParams, ...{ limit: page_limit, doc_type: platform } },
        //     );
        // }
        const pages = Math.ceil(count / page_limit);

        setHits(data);
        setPages(pages);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
        <section className='home-section lg:py-[80px]'>
            <div className='inner lg:mx-auto lg:px-[80px] lg:w-[1440px]'>
                {/* SEARCH */}
                {/*<form id='search-form' method='GET' className='section-header relative lg:pb-[60px]'>
                    <div className='col-span-4 flex flex-row group items-stretch'>
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
                    </div>

                </form>*/}

                <div className='section-content'>
                    {/* Display Cards */}
                    <div className='grid gap-[20px] lg:grid-cols-3'>
                        {loading ? (
                            <ImgCardsSkeleton /> // Show Skeleton while loading
                        ) : (
                            hits?.map((post: any) => (
                                <Card
                                    key={post?.pinboard_id}
                                    country={post?.country === 'NUL' || !post?.country ? 'Global' : post?.country}
                                    title={post?.title || ''}
                                    description={post?.description}
                                    source={post?.base || 'Solution'}
                                    tagStyle="bg-light-green"
                                    tagStyleShade="bg-light-green-shade"
                                    href={`/boards/${post?.pinboard_id}`}
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
                            page={+page ?? 1}
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