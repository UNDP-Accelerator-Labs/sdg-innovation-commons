"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/app/ui/components/Button';
import Card from '@/app/ui/components/Card/with-img';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import { pagestats, Pagination } from '@/app/ui/components/Pagination';
import Link from 'next/link';
import platformApi from '@/app/lib/data/platform-api';
import { processHits } from '@/app/ui/home/Learn';
import { defaultSearch, page_limit } from '@/app/lib/utils';

export default function Section() {
    const [currPage, setCurrPage] = useState<any[]>([]);
    const [pages, setPages] = useState<any[]>([]);
    const [hits, setHits] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Loading state

    async function fetchData(page: number, platform: string) {
        setLoading(true);

        
        const { total, pages: totalPages } = await pagestats(page, platform);
        // const pagelist = new Array(totalPages).fill(0).map((d, i) => i + 1)
        setPages(totalPages);
        setCurrPage(page);

        const data = await platformApi({ limit: page_limit, page, include_locations: true }, platform);
        setHits(data);
        // const { hits: fetchedHits } = data || {};
        // setHits(processHits(fetchedHits, page_limit));
        setLoading(false); // Set loading to false when data is fetched
    }

    // Fetch data on component mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const page: number = !isNaN(parseInt(params.get('page'))) ? parseInt(params.get('page')) : 1;
        fetchData(page, 'experiment');
    }, []); // Empty dependency array to run only on mount

    const handleClick = useCallback(page => {
        fetchData(page, 'experiment')
    });

    return (
        <>
        <section className='lg:home-section lg:px-[80px] lg:py-[100px]'>
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
                        page={currPage}
                        totalPages={pages}
                        handleClick={handleClick}
                    />
                ) : (<small className='block w-full text-center'>Loading pagination</small>)
                }
                </div>
            </div>
        </section>
        </>
    );
}
