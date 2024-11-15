"use client";

import { useState, useEffect, useCallback } from 'react';
import Card from '@/app/ui/components/Card/with-img';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import { pagestats, Pagination } from '@/app/ui/components/Pagination';
import platformApi from '@/app/lib/data/platform-api';
import nlpApi from '@/app/lib/data/nlp-api';
import { page_limit } from '@/app/lib/utils';
import clsx from 'clsx';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/app/ui/components/Button';
import Filters from '../Filters';

export interface PageStatsResponse {
    total: number;
    pages: number;
}

interface SectionProps {
    searchParams: any;
    platform: string;
    tabs: string[];
}

export default function Section({
    searchParams,
    platform,
    tabs
}: SectionProps) {
    const { page, search } = searchParams;
    const windowParams = new URLSearchParams(useSearchParams());
    windowParams.set('page', '1');

    const [searchQuery, setSearchQuery] = useState(search || '');
    const [filterVisibility, setFilterVisibility] = useState<boolean>(false);

    const [pages, setPages] = useState<number>(0);
    const [hits, setHits] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    async function fetchData(): Promise<void> {
        setLoading(true);
    
        let data: any[];

        if (!search && platform !== 'all') {
            const { total, pages: totalPages }: PageStatsResponse = await pagestats(page, platform, searchParams);
            setPages(totalPages);

            data = await platformApi(
                { ...searchParams, ...{ limit: page_limit, include_locations: true } },
                platform,
                'pads'
            );
        } else {
            console.log('look for search term', search)
            let doc_type: string[];
            if (platform === 'all') doc_type = tabs.slice(1);
            else doc_type = [platform];
            if (searchParams.countries) searchParams.iso3 = searchParams.countries;

            const { total, pages: totalPages }: PageStatsResponse = await pagestats(page, doc_type, 3);

            data = await nlpApi(
                { ... searchParams, ...{ limit: page_limit, doc_type } }
            );
        }
        setHits(data);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
        <section className='lg:home-section lg:py-[80px]'>
            <div className='inner lg:mx-auto lg:px-[80px] lg:w-[1440px]'>
                {/* Search bar */}
                <form id='search-form' method='GET' className='section-header relative lg:pb-[60px]'>
                    <div className='col-span-4 flex flex-row group items-stretch'>
                        <input type='text' name='search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}  className='bg-white border-black !border-r-0 grow' id='main-search-bar' placeholder='What are you looking for?' />
                        <Button type='submit' className='border-l-0 grow-0'>
                            Search
                        </Button>
                    </div>
                    <div className='lg:col-end-10'>
                        <button type='button' className='w-full h-[60px] text-[18px] bg-white border-black border-[1px] flex justify-center items-center cursor-pointer' onClick={(e) => setFilterVisibility(!filterVisibility)}>
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
                            platform={platform}
                            tabs={tabs}
                        />
                    </div>
                </form>
                {/* Display tabs */}
                <nav className='tabs'>
                    {tabs.map((d, i) => {
                        let txt: string = '';
                        if (d === 'all') txt = 'all items';
                        else txt = d;
                        return (
                            <div key={i} className={clsx('tab tab-line', platform === d ? 'font-bold' : 'orange')}>
                                <Link href={`/test/${d}?${windowParams.toString()}`}>
                                    {`${txt}${txt.slice(-1) === 's' ? '' : 's'}`}
                                </Link>
                            </div>
                        )
                    })}
                </nav>
                <div className='section-content'>
                    {/* Display Cards */}
                    <div className='grid gap-[20px] lg:grid-cols-3'>
                        {loading ? (
                            <ImgCardsSkeleton /> // Show Skeleton while loading
                        ) : (
                            hits?.map((post: any) => (
                                <Card
                                    key={post.doc_id || post?.pad_id}
                                    link={`/test/${post?.base}/${post?.doc_id || post?.pad_id}`}
                                    country={post?.country === 'NUL' || !post?.country ? 'Global' : post?.country}
                                    title={post?.title || ''}
                                    description={post?.snippets?.length ? `${post?.snippets} ${post?.snippets?.length ? '...' : ''}` : post?.snippet }
                                    source={post?.base || ''}
                                    tagStyle={post?.base === 'action plan' ? 'bg-light-yellow' : 'bg-light-orange'}
                                    tagStyleShade={post?.base === 'action plan' ? 'bg-light-yellow-shade' : 'bg-light-orange-shade'}
                                    href={post?.url}
                                    viewCount={0}
                                    tags={post?.tags}
                                    sdg={`SDG ${post?.sdg?.join('/')}`}
                                    backgroundImage={post?.vignette}
                                    className=''
                                    date={post?.date}
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
