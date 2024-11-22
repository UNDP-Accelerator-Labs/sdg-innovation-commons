"use client";
import { useState, useEffect, useCallback } from 'react';
import Card from '@/app/ui/components/Card/with-img';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import { pagestats, Pagination } from '@/app/ui/components/Pagination';
import platformApi from '@/app/lib/data/platform-api';
import nlpApi from '@/app/lib/data/nlp-api';
import { page_limit } from '@/app/lib/utils';
import { Button } from '@/app/ui/components/Button';
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

    const [searchQuery, setSearchQuery] = useState<string>(searchParams.search || '');
    const [filterVisibility, setFilterVisibility] = useState<boolean>(false);

    const [pages, setPages] = useState<number>(0);
    const [hits, setHits] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

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
        setHits(data);
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
            <form id='search-form' method='GET' className='section-header relative pb-[40px] lg:pb-[80px]'>
                <div className='col-span-9 lg:col-span-4 flex flex-row group items-stretch'>
                    <input type='text' name='search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}  className='bg-white border-black !border-r-0 grow' id='main-search-bar' placeholder='What are you looking for?' />
                    <Button type='submit' className='border-l-0 grow-0'>
                        Search
                    </Button>
                </div>
                <div className='col-span-5 col-start-5 md:col-span-2 md:col-start-8 lg:col-end-10 lg:col-span-1'>
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
                        page={page }
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
