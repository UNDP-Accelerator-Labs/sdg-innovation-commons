"use client";
import { useState, useEffect, useCallback } from 'react';
import { MenuItem } from '@headlessui/react'
import Card from '@/app/ui/components/Card/with-img';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import { pagestats, Pagination } from '@/app/ui/components/Pagination';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import platformApi from '@/app/lib/data/platform-api';
import nlpApi from '@/app/lib/data/nlp-api';
import { page_limit } from '@/app/lib/utils';
import { Button } from '@/app/ui/components/Button';
import AddToBoard from '@/app/ui/components/Modal/add-to-board';
import Notification from '@/app/ui/components/Notification';
import DropDown from '@/app/ui/components/DropDown';
import Filters from '../Filters';
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

    const { sharedState } = useSharedState();
    const { isLogedIn, session } = sharedState || {}

    const [searchQuery, setSearchQuery] = useState<string>(searchParams.search || '');
    const [filterVisibility, setFilterVisibility] = useState<boolean>(false);

    const [pages, setPages] = useState<number>(0);
    const [hits, setHits] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [boards, setBoards] = useState<any[]>([]);

    const [objectIdz, setObjectIdz] = useState<number[]>([]);
    const [hrefs, setHref] = useState<string>('');

    //Notification DOM states
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState<string>("Action Required!");
    const [submessage, setSubMessage] = useState<string>("You need to log in to engage with this post.");
    const [messageType, setMessageType] = useState<string>("warning");
    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    const platform = 'solution';

    async function fetchData(): Promise<void> {
        setLoading(true);

        const { total, pages: totalPages }: PageStatsResponse = await pagestats(page, platform, searchParams);
        setPages(totalPages);

        let data: any[];

        if (!search) {
            console.log(searchParams)

            data = await platformApi(
                { ...searchParams, ...{ limit: page_limit } },
                platform,
                'pads'
            );
        } else {
            console.log('look for search term', search)
            data = await nlpApi(
                { ...searchParams, ...{ limit: page_limit, doc_type: platform } }
            );
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

    const handleAddAllToBoard = (e: any) => {
        e.preventDefault();
        setModalOpen(true)
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchBoard(){
            const { data: board, count: board_count } = await platformApi(
                { space : session?.rights >= 3 ? 'all' : 'private' },
                'solution',
                'pinboards'
            );
            setBoards(board)
        }
        fetchBoard();
    }, [session]);

    return (
        <>
            <section className='home-section lg:py-[80px]'>
                <div className='inner w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px] mx-auto'>
                    {/* SEARCH */}
                    <form id='search-form' method='GET' className='section-header relative pb-[40px] lg:pb-[40px]'>
                        <div className='col-span-9 lg:col-span-4 flex flex-row group items-stretch'>
                            <input type='text' name='search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='bg-white border-black !border-r-0 grow' id='main-search-bar' placeholder='What are you looking for?' />
                            <Button type='submit' className='border-l-0 grow-0'>
                                Search
                            </Button>
                        </div>
                        <div className='col-span-5 col-start-5 md:col-span-2 md:col-start-8 lg:col-end-10 lg:col-span-1 flex flex-row gap-x-5'>
                        {(hrefs?.length > 0 || (isLogedIn && search?.length > 0)) && (
                                <DropDown>
                                    {hrefs?.length > 0 && (
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
                                    {isLogedIn && search?.length > 0 && (
                                        <MenuItem as="button" className="w-full text-start bg-white hover:bg-lime-yellow">
                                            <div
                                                className="block p-4 text-inherit text-base focus:bg-gray-100 focus:text-gray-900 focus:outline-none bg-inherit border-none"
                                                onClick={handleAddAllToBoard}
                                            >
                                                Add All to Board
                                            </div>
                                        </MenuItem>
                                    )}
                                </DropDown>
                            )}

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
                            />
                        </div>
                    </form>

                    <p className='text-lg mb-10'>
                    Pin interesting solutions notes on a board by clicking “Add to board”. You can create new boards or add to an existing one. Customize your boards by clicking on “My boards” at the bottom right.
                    </p>

                    <div className='section-content'>
                        {/* Display Cards */}
                        <div className='grid gap-[20px] md:grid-cols-2 xl:grid-cols-3'>
                            {loading ? (
                                <ImgCardsSkeleton /> // Show Skeleton while loading
                            ) : (
                                hits?.map((post: any) => {
                                    let countries = post?.locations?.map((d: any) => d.country) || [];
                                    if (!countries.length) countries = [post?.country === 'NUL' || !post?.country ? 'Global' : post?.country];
                                    else {
                                        countries = countries.filter((value: string, index: number, array: string[]) => {
                                            return array.indexOf(value) === index;
                                        })
                                        if (countries.length > 3) {
                                            const n = countries.length;
                                            countries = countries.slice(0, 3);
                                            countries.push(`+${n - 3}`);
                                        }
                                    }
                                    return (
                                        <Card
                                            key={post?.doc_id || post?.pad_id}
                                            id={post?.doc_id || post?.pad_id}
                                            country={countries}
                                            title={post?.title || ''}
                                            description={post?.snippets?.length ? `${post?.snippets} ${post?.snippets?.length ? '...' : ''}` : post?.snippet}
                                            source={post?.base || 'solution'}
                                            tagStyle="bg-light-green"
                                            tagStyleShade="bg-light-green-shade"
                                            href={post?.url}
                                            viewCount={0}
                                            tags={post?.tags}
                                            sdg={`SDG ${post?.sdg?.join('/')}`}
                                            backgroundImage={post?.vignette}
                                            date={post?.date}
                                            engagement={post?.engagement}
                                            data={post}
                                            isLogedIn={isLogedIn}
                                            boardInfo={{
                                                boards: boards,
                                            }}
                                        />
                                    )
                                })
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
                </div>
            </section>
        </>
    );
}
