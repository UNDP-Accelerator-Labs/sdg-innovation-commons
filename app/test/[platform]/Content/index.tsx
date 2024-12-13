"use client";

import { useState, useEffect, useCallback } from 'react';
import { MenuItem } from '@headlessui/react'
import Card from '@/app/ui/components/Card/with-img';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import { pagestats, Pagination } from '@/app/ui/components/Pagination';
import platformApi, { pin } from '@/app/lib/data/platform-api';
import nlpApi from '@/app/lib/data/nlp-api';
import { page_limit } from '@/app/lib/utils';
import clsx from 'clsx';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/app/ui/components/Button';
import Filters from '../Filters';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import AddToBoard from '@/app/ui/components/Modal/add-to-board';
import Notification from '@/app/ui/components/Notification';
import DropDown from '@/app/ui/components/DropDown';

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
    tabs
}: SectionProps) {
    const { page, search } = searchParams;
    const windowParams = new URLSearchParams(useSearchParams());
    windowParams.set('page', '1');

    const { sharedState } = useSharedState();
    const { isLogedIn, session } = sharedState || {}

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

    const [boards, setBoards] = useState<any[]>([]);

    //Notification DOM states
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState<string>("Action Required!");
    const [submessage, setSubMessage] = useState<string>("You need to log in to engage with this post.");
    const [messageType, setMessageType] = useState<string>("warning");
    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    const handleAddAllToBoard = (e: any) => {
        e.preventDefault();
        setModalOpen(true)
    }

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
            setAllObjectIdz(null)
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
            
            const sorted_keys: Record<string, number[]> = {}; 
            
            data.forEach((item: Item) => {
                const key = item.base;
                if (!sorted_keys[key]) {
                    sorted_keys[key] = []; 
                }
                sorted_keys[key].push(item.pad_id); 
            });
            setAllObjectIdz(sorted_keys)
            
            setallowDownLoad(true)
        }

        const idz: number[] = data?.map(p => p?.pad_id || p?.doc_id)
        setObjectIdz(idz)

        const baseUrl = await platformApi({ render: true, action: 'download' }, platform, 'pads', true);
        const params = new URLSearchParams();
        idz.forEach(id => params.append('pads', id.toString()));
        const url = `${baseUrl}&${params.toString()}`;
        setHref(url)

        setHits(data);

        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchBoard() {
            const { data: board, count: board_count } = await platformApi(
                { space: session?.rights >= 3 ? 'all' : 'private' },
                'solution',
                'pinboards'
            );
            setBoards(board)
        }
        fetchBoard();
    }, [session]);

    return (
        <>
            <section className='home-section py-[80px]'>
                <div className='inner mx-auto px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px]'>
                    {/* Search bar */}
                    <form id='search-form' method='GET' className='section-header relative pb-[40px] lg:pb-[40px]'>
                        <div className='col-span-9 lg:col-span-4 flex flex-row group items-stretch'>
                            <input type='text' name='search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='bg-white border-black !border-r-0 grow' id='main-search-bar' placeholder='What are you looking for?' />
                            <Button type='submit' className='border-l-0 grow-0'>
                                Search
                            </Button>
                        </div>
                        <div className='col-span-5 col-start-5 md:col-span-2 md:col-start-8 lg:col-end-10 lg:col-span-1  flex flex-row gap-x-5'>
                            {(allowDownLoad && hrefs?.length > 0) || (isLogedIn && search?.length > 0 && platform !== 'all') ? (
                                <DropDown>
                                    {allowDownLoad && hrefs?.length > 0 && (
                                        <MenuItem as="button" className="w-full text-start bg-white hover:bg-lime-yellow">
                                            <a
                                                className="block p-4 text-inherit text-base data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                                href={hrefs}
                                                target="_blank"
                                            >
                                                Download All
                                            </a>
                                        </MenuItem>
                                    )}
                                    {isLogedIn && search?.length > 0 &&  (
                                        <MenuItem as="button" className="w-full text-start bg-white hover:bg-lime-yellow">
                                            <div
                                                className="block p-4 text-inherit text-base data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none cursor-pointer"
                                                onClick={handleAddAllToBoard}
                                            >
                                                Add All to Board
                                            </div>
                                        </MenuItem>
                                    )}
                                </DropDown>
                            ) : null}

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

                    {isLogedIn && session?.pinboards?.length ? (
                        <p className='lead mb-[40px]'>
                            Pin interesting experiments and action plans on a board by clicking “Add to board”. You can create new boards or add to existing ones. Customize your boards by clicking on “My boards” at the bottom right.
                        </p>
                    ) : null}

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
                                        description={post?.snippets?.length ? `${post?.snippets} ${post?.snippets?.length ? '...' : ''}` : post?.snippet}
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

            <AddToBoard
                boards={boards || []}
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                platform={platform}
                id={objectIdz}
                allObjectIdz={allObjectIdz}

                setMessage={setMessage}
                setSubMessage={setSubMessage}
                setMessageType={setMessageType}
                setShowNotification={setShowNotification}
            />

            {showNotification && (
                <Notification
                    message={message}
                    subMessage={submessage}
                    type={messageType}
                />

            )}
        </>
    );
}
