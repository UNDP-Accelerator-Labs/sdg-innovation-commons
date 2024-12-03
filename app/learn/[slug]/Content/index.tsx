"use client";

import { useState, useEffect } from 'react';
import { MenuItem } from '@headlessui/react'
import Card from '@/app/ui/components/Card/without-img';
import { NoImgCardSkeleton } from '@/app/ui/components/Card/skeleton';
import { pagestats, Pagination } from '@/app/ui/components/Pagination';
import nlpApi from '@/app/lib/data/nlp-api';
import { formatDate, defaultSearch, page_limit } from '@/app/lib/utils';
import { PostProps } from '@/app/lib/definitions';
import clsx from 'clsx';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/app/ui/components/Button';
import Filters from '../Filters';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import platformApi from '@/app/lib/data/platform-api';
import AddToBoard from '@/app/ui/components/Modal/add-to-board';
import Notification from '@/app/ui/components/Notification';
import DropDown from '@/app/ui/components/DropDown';

export interface PageStatsResponse {
    total: number;
    pages: number;
}

interface SectionProps {
    searchParams: any;
    tabs: any;
    docType: string;
}

export default function Section({
    searchParams,
    tabs,
    docType
}: SectionProps) {
    const { page, search } = searchParams;
    const windowParams = new URLSearchParams(useSearchParams());
    windowParams.set('page', '1');

    const platform = 'blog';
    const { sharedState } = useSharedState();
    const { isLogedIn } = sharedState || {}

    // const docType = 'blogs'
    const [pages, setPages] = useState<number>(0);
    const [hits, setHits] = useState<PostProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [filterVisibility, setFilterVisibility] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState(search || '');

    const [boards, setBoards] = useState<any[]>([]);

    const [objectIdz, setObjectIdz] = useState<number[]>([]);

    //Notification DOM states
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState<string>("Action Required!");
    const [submessage, setSubMessage] = useState<string>("You need to log in to engage with this post.");
    const [messageType, setMessageType] = useState<string>("warning");
    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    // Fetch data on component mount
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            // const counts = await statsApi({ doc_type });

            // TO DO: CHANGE THIS TO nlpAPI
            // const data = await learnApi({ limit: displayN, search: search?.length ? search : defaultSearch('learn'), doc_type });
            // const { hits: fetchedHits } = data || {};
            // setHits(processHits(fetchedHits, displayN));

            let doc_type: string[];
            if (docType === 'all') doc_type = tabs.slice(1);
            else doc_type = [docType];

            const { total, pages: totalPages }: PageStatsResponse = await pagestats(page, doc_type, 3);
            setPages(totalPages);

            if (searchParams.countries) searchParams.iso3 = searchParams.countries;
            const data = await nlpApi(
                { ...searchParams, ...{ limit: page_limit, doc_type } }
            );
            setHits(data);

            const idz: number[] = data?.map((p: any) => p?.doc_id)
            setObjectIdz(idz)

            const { data: board, count: board_count } = await platformApi(
                { space: 'private' },
                'solution',
                'pinboards'
            );
            setBoards(board)

            setLoading(false);
        }
        fetchData();
    }, []);

    const handleAddAllToBoard = (e: any) => {
        e.preventDefault();
        setModalOpen(true)
    }

    return (
        <>
            <section className='home-section py-[80px] !border-none'>
                <div className='inner mx-auto px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px]'>
                    {/* Search bar */}
                    <form id='search-form' method='GET' className='section-header relative pb-[40px] lg:pb-[80px]'>
                        <div className='col-span-9 lg:col-span-4 flex flex-row group items-stretch'>
                            <input type='text' name='search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='bg-white border-black !border-r-0 grow' id='main-search-bar' placeholder='What are you looking for?' />
                            <Button type='submit' className='border-l-0 grow-0'>
                                Search
                            </Button>
                        </div>
                        <div className='col-span-5 col-start-5 md:col-span-2 md:col-start-8 lg:col-end-10 lg:col-span-1 flex flex-row gap-x-5'>
                            <button type='button' className='w-full h-[60px] text-[18px] bg-white border-black border-[1px] flex justify-center items-center cursor-pointer' onClick={(e) => setFilterVisibility(!filterVisibility)}>
                                <img src='/images/icon-filter.svg' alt='Filter icon' className='mr-[10px]' />
                                {!filterVisibility ? (
                                    'Filters'
                                ) : (
                                    'Close'
                                )}
                            </button>

                            <DropDown>
                                {
                                    isLogedIn && search?.length ? (
                                        <MenuItem as="button" className="w-full text-start bg-white hover:bg-lime-yellow">

                                            <div
                                                className="block p-4 text-inherit text-base focus:bg-gray-100 focus:text-gray-900 focus:outline-none bg-inherit border-none"
                                                onClick={handleAddAllToBoard}
                                            >
                                                Add All to Board
                                            </div>
                                        </MenuItem>
                                    ) : ''
                                }
                            </DropDown>
                        </div>
                        <div className='col-span-9'>
                            <Filters
                                className={clsx(filterVisibility ? '' : 'hidden')}
                                searchParams={searchParams}
                                platform={docType}
                                tabs={tabs}
                            />
                        </div>
                    </form>
                    {/* Display tabs */}
                    <nav className='tabs flex-wrap items-end'>
                        {tabs.map((d: any, i: number) => {
                            let txt: string = '';
                            if (d === 'all') txt = 'all items';
                            else txt = d;
                            return (
                                <div key={i} className={clsx('tab tab-line mb-[10px] md:mb-0 lg:mb-0', docType === d ? 'font-bold' : 'yellow')}>
                                    <Link href={`/learn/${d}?${windowParams.toString()}`}>
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
                                <>
                                    {new Array(page_limit).fill(0).map((d, i) => (
                                        <NoImgCardSkeleton key={i} />
                                    ))}
                                </>
                            ) : (
                                hits?.map((post: any, i: number) => {
                                    return (
                                        <Card
                                            key={i}
                                            id={post.doc_id}
                                            // country={post?.meta?.iso3[0] === 'NUL' || !post?.meta?.iso3[0] ? 'Global' : post?.meta?.iso3[0]}
                                            country={post?.country === 'NUL' || !post?.country ? 'Global' : post?.country}
                                            date={formatDate(post?.meta?.date) || ''}
                                            title={post?.title || ''}
                                            description={`${post?.snippets} ${post?.snippets?.length ? '...' : ''}`}
                                            tags={post?.meta?.doc_type || ''}
                                            tagStyle="bg-light-blue"
                                            href={post?.url}
                                            openInNewTab={true}
                                            source={post?.meta?.doc_type || 'blog'}
                                            isLogedIn={isLogedIn}
                                            boardInfo={{
                                                boards: boards,
                                            }}
                                            data={post}
                                        />
                                    )
                                })
                            )}
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
                </div>
            </section>

            <AddToBoard
                boards={boards || []}
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                platform={platform}
                id={objectIdz}

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


export function processHits(hits: PostProps[], sliceValue: number): PostProps[] {
    // Filter to remove duplicates based on the 'url' or 'title' property
    const uniqueHits = hits?.filter(
        (item, index, self) =>
            index === self.findIndex((t) =>
                (item?.title && t?.title === item?.title) ||
                (item?.url && t?.url === item?.url)
            )
    );
    return uniqueHits?.slice(0, sliceValue);
}