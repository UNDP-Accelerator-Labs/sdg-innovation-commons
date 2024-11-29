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
import { is_user_logged_in } from '@/app/lib/session';

export interface PageStatsResponse {
    total: number;
    pages: number;
}

export interface SectionProps {
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
    const [filterParams, setfilterParams ] = useState<any>(searchParams);

    const [allowDownLoad, setallowDownLoad ] = useState<boolean>(false);
    const [hrefs, setHref] = useState<string>('');

    const [isLogedIn, setIsLogedIn] = useState<boolean>(false);
    const [boards, setBoards] = useState<any[]>([]);
  
    async function fetchData(): Promise<void> {
        setLoading(true);

        let data: any[];

        let updatedFilterParams = { ...filterParams }; 
        if (updatedFilterParams?.page) delete updatedFilterParams['page'];
        if (updatedFilterParams?.search) delete updatedFilterParams['search'];
        const hasFilters = Object.values(updatedFilterParams)
        ?.flat()
        .filter(value => value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && value.length === 0))
        ?.length > 0;

        if (!hasFilters && !search && platform !== 'all') {
            const { total, pages: totalPages }: PageStatsResponse = await pagestats(page, platform, searchParams);
            setPages(totalPages);
            data = await platformApi(
                { ...searchParams, ...{ limit: page_limit, include_locations: true } },
                platform,
                'pads'
            );
            setallowDownLoad(true)
        } else {
            console.log('look for search term ', search)
            let doc_type: string[];
            if (platform === 'all') doc_type = tabs.slice(1);
            else doc_type = [platform];
            if (searchParams.countries) searchParams.iso3 = searchParams.countries;

            const { total, pages: totalPages }: PageStatsResponse = await pagestats(page, doc_type, 3);
            setPages(totalPages);

            data = await nlpApi(
                { ...searchParams, ...{ limit: page_limit, doc_type } }
            );
            setallowDownLoad(false)
        }

        const idz: number[] = data?.map(p=>p?.pad_id || p?.doc_id)
        const baseUrl = await platformApi({ render: true, action: 'download' }, platform, 'pads', true);
        const params = new URLSearchParams();
        idz.forEach(id => params.append('pads', id.toString()));
        const url = `${baseUrl}&${params.toString()}`;
        setHref(url)

        setHits(data);

        const { data : board, count: board_count } = await platformApi(
            { ...searchParams, ...{ limit: 200 } }, //TODO: ADD 'all' PARAMETER TO PLATFORM API TO RETURN ALL LIST
            'solution', 
            'pinboards'
        );
        setBoards(board)

        const isValidUser = await is_user_logged_in()
        setIsLogedIn(isValidUser)

        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
        <section className='home-section py-[80px]'>
            <div className='inner mx-auto px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px]'>
                {/* Search bar */}
                <form id='search-form' method='GET' className='section-header relative pb-[40px] lg:pb-[80px]'>
                    <div className='col-span-9 lg:col-span-4 flex flex-row group items-stretch'>
                        <input type='text' name='search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}  className='bg-white border-black !border-r-0 grow' id='main-search-bar' placeholder='What are you looking for?' />
                        <Button type='submit' className='border-l-0 grow-0'>
                            Search
                        </Button>
                    </div>
                    <div className='col-span-5 col-start-5 md:col-span-2 md:col-start-8 lg:col-end-10 lg:col-span-1  flex flex-row gap-x-5'>
                        <button type='button' className='w-full h-[60px] text-[18px] bg-white border-black border-[1px] flex justify-center items-center cursor-pointer' onClick={(e) => setFilterVisibility(!filterVisibility)}>
                            <img src='/images/icon-filter.svg' alt='Filter icon' className='mr-[10px]' />
                            {!filterVisibility ? (
                                'Filters'
                            ) : (
                                'Close'
                            )}
                        </button>
                        {allowDownLoad && hrefs && hrefs.length ? (
                            <Button className='border-l-0 grow-0'>
                            <a href={hrefs} target='_blank' >Download All</a>
                        </Button>
                        ) : '' }
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
                <nav className='tabs items-end'>
                    {tabs.map((d, i) => {
                        let txt: string = '';
                        if (d === 'all') txt = 'all items';
                        else txt = d;
                        return (
                            <div key={i} className={clsx('tab tab-line', platform === d ? 'font-bold' : 'yellow')}>
                                <Link href={`/test/${d}?${windowParams.toString()}`} scroll={false}>
                                    {`${txt}${txt.slice(-1) === 's' ? '' : 's'}`}
                                </Link>
                            </div>
                        )
                    })}
                </nav>
                <div className='section-content'>
                    {/* Display Cards */}
                    <div className='grid gap-[20px] md:grid-cols-2 xl:grid-cols-3'>
                        {loading ? (
                            <ImgCardsSkeleton /> // Show Skeleton while loading
                        ) : (
                            hits?.map((post: any) => (
                                <Card
                                    key={post.doc_id || post?.pad_id}
                                    id={post.doc_id || post?.pad_id}
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
                                    engagement={post?.engagement}
                                    data={post}
                                    isLogedIn={isLogedIn}
                                    boardInfo={{
                                        boards: boards,
                                    }}
                                />
                            ))
                        )}
                    </div>
                </div>
                <div className='pagination'>
                    <div className='w-full flex justify-center col-start-2'>
                    {!loading ? (
                        <Pagination
                            page={page}
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
