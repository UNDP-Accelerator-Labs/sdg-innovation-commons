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

    const [pages, setPages] = useState<number>(0);
    const [hits, setHits] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    async function fetchData(): Promise<void> {
        setLoading(true);

        const { total, pages: totalPages }: PageStatsResponse = await pagestats(page, platform, 3);
        setPages(totalPages);
        
        let data: any[];

        if (!search) {
            data = await platformApi(
                { ...searchParams, ...{ limit: page_limit, include_locations: true } },
                platform,
                'pads'
            );
        } else {
            console.log('look for search term', search)
            data = await nlpApi(
                { ... searchParams, ...{ limit: page_limit, doc_type: platform } },
                platform
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
        <section className='lg:home-section lg:px-[80px] lg:py-[100px]'>
            {/* Display tabs */}
            <nav className='tabs'>
                {tabs.map((d, i) => {
                    return (
                    <div key={i} className={clsx('tab tab-line', platform === d ? 'font-bold' : 'orange')}>
                        <Link href={`/test/${d}?${windowParams.toString()}`}>{`${d}s`}</Link>
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
                                country={post?.country === 'NUL' || !post?.country ? 'Global' : post?.country}
                                title={post?.title || ''}
                                description={post?.snippets?.length ? `${post?.snippets} ${post?.snippets?.length ? '...' : ''}` : post?.snippet }
                                source={post?.base || ''}
                                tagStyle="bg-light-orange"
                                tagStyleShade="bg-light-orange-shade"
                                href={post?.url}
                                viewCount={0}
                                tags={post?.tags}
                                sdg={`SDG ${post?.sdg?.join('/')}`}
                                backgroundImage={post?.vignette}
                                className=''
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
        </section>
        </>
    );
}
