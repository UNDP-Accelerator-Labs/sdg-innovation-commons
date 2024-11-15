"use client";
import { useState, useEffect, useCallback } from 'react';
import Card from '@/app/ui/components/Card/with-img';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import { pagestats, Pagination } from '@/app/ui/components/Pagination';
import platformApi from '@/app/lib/data/platform-api';
import nlpApi from '@/app/lib/data/nlp-api';
import { page_limit, commonsPlatform } from '@/app/lib/utils';
import { Button } from '@/app/ui/components/Button';
// import Filters from '../Filters';
import clsx from 'clsx';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Info from '../Info';

export interface PageStatsResponse {
    total: number;
    pages: number;
}

interface SectionProps {
    searchParams: any;
    platforms: any[];
    tabs: string[];
    pads: any[];
    pages: number;
    board: number;
    description: string;
}

export default function Section({
    searchParams,
    platforms,
    tabs,
    pads,
    pages,
    board,
    description,
}: SectionProps) {
    const { page, search } = searchParams;
    const windowParams = new URLSearchParams(useSearchParams());
    windowParams.set('page', '1');

    const [searchQuery, setSearchQuery] = useState<string>(searchParams.search || '');
    const [filterVisibility, setFilterVisibility] = useState<boolean>(false);
    const [vignette, setVignette] = useState<string>('');

    const [hits, setHits] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const platform: string = tabs[0];

    async function fetchData(): Promise<void> {
        setLoading(true);

        // if (!search) {
            
            const platformData: any[] = await Promise.all(platforms.map(async (d: any) => {
                const platform: string = commonsPlatform.find((c: any) => c.shortkey === d.platform)?.key || d.platform;
                const platformPads: any[] = pads.filter((c: any) => c.platform === d.platform).map((c: any) => c.pad_id);
                const data: any[] = await platformApi(
                    { include_locations: true, pads: platformPads },
                    platform, 
                    'pads'
                );
                return data || [];
            }));

        // } 
        // else {
        //     console.log('look for search term', search)
        //     data = await nlpApi(
        //         { ...searchParams, ...{ limit: page_limit, doc_type: platform } },
        //     );
        // }

        const vignettes = platformData.flat().map(d => d.vignette);
        setVignette(vignettes[Math.floor(Math.random() * vignettes.length)]);

        setHits(platformData.flat());
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
        {loading ? null :
            (
                <Info description={description} vignette={vignette} />
            )
        }
        <section className='home-section lg:py-[80px]'>
            <div className='inner lg:mx-auto lg:px-[80px] lg:w-[1440px]'>
                {/* Display the section title and description */}
                <div className='section-header lg:mb-[100px]'>
                    <div className='c-left lg:col-span-5'>
                        <h2 className='slanted-bg yellow lg:mt-[5px]'>
                            <span>Full Board Overview</span>
                        </h2>
                    </div>
                    <div className='c-right lg:col-span-4 lg:mt-[20px]'>
                        <p className="lead">
                            <b>Search through all the items that are part of this board.</b>
                        </p>
                    </div>
                </div>
                {/* SEARCH */}
                <form id='search-form' method='GET' className='section-header relative lg:pb-[60px]'>
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
                        {/*<Filters 
                            className={clsx(filterVisibility ? '' : 'hidden')}
                            searchParams={searchParams}
                        />*/}
                    </div>
                </form>
                {/* Display tabs */}
                <nav className='tabs'>
                    {loading ? null :
                    (
                        tabs.map((d: any, i: number) => {
                            let txt: string = '';
                            if (d === 'all') txt = 'all items';
                            else txt = d;
                            console.log(d)
                            // windowParams.set('platform', d);
                            return (
                                <div key={i} className={clsx('tab tab-line', platform === d ? 'font-bold' : 'yellow')}>
                                    <Link href={`/boards/${board}/${encodeURI(d.toLowerCase())}?${windowParams.toString()}`}>
                                        {`${txt}${txt.slice(-1) === 's' ? '' : 's'}`}
                                    </Link>
                                </div>
                            )
                        })
                    )}
                </nav>
                <div className='section-content'>
                    {/* Display Cards */}
                    <div className='grid gap-[20px] lg:grid-cols-3'>
                        {loading ? (
                            <ImgCardsSkeleton /> // Show Skeleton while loading
                        ) : (
                            hits?.map((post: any) => {
                                let color: string = 'green';
                                let path: string = 'see';
                                if (post?.base === 'action plan') {
                                    color = 'yellow';
                                    path = 'test';
                                } else if (post?.base === 'experiment') {
                                    color = 'orange';
                                    path = 'test';
                                }
                                return (
                                    <Card
                                        key={post?.doc_id || post?.pad_id}
                                        link={`/${path}/${path !== 'see' ? `${post?.base}/` : ''}${post?.doc_id || post?.pad_id}`}
                                        country={post?.country === 'NUL' || !post?.country ? 'Global' : post?.country}
                                        title={post?.title || ''}
                                        description={post?.snippets?.length ? `${post?.snippets} ${post?.snippets?.length ? '...' : ''}` : post?.snippet}
                                        source={post?.base || 'Solution'}
                                        tagStyle={`bg-light-${color}`}
                                        tagStyleShade={`bg-light-${color}-shade`}
                                        href={post?.url}
                                        viewCount={0}
                                        tags={post?.tags}
                                        sdg={`SDG ${post?.sdg?.join('/')}`}
                                        backgroundImage={post?.vignette}
                                        date={post?.date}
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