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


/*
--- DAPO'S IMPLEMENTATION USING SEMANTIC SEARCH
import { useState, useEffect } from 'react';
import Card from '@/app/ui/components/Card/with-img';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import seeApi from '@/app/lib/data/see';
import { processHits } from '@/app/ui/home/Learn';
import { defaultSearch, page_limit } from '@/app/lib/utils';


const [hits, setHits] = useState<any[]>([]);
const [loading, setLoading] = useState<boolean>(true); // Loading state
const displayN = page_limit;

// Fetch data on component mount
useEffect(() => {
    async function fetchData() {
        setLoading(true);
        const data = await seeApi({ limit: displayN, search: searchTerm?.length ? searchTerm : defaultSearch('see') });
        const { hits: fetchedHits } = data || {};
        setHits(processHits(fetchedHits, displayN));
        setLoading(false); 
    }
    fetchData();
}, [searchTerm]);

*/


export interface PageStatsResponse {
    total: number;
    pages: number;
}

interface PlatformApiResponse {
    hits: any[]; 
}

interface SectionProps {
    searchTerm: string; 
}

export default function Section({ searchTerm }: SectionProps) {
    const [currPage, setCurrPage] = useState<number>(1);
    const [pages, setPages] = useState<number>(0);
    const [hits, setHits] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const platform = 'solution';

    async function fetchData(page: number): Promise<void> {
        setLoading(true);
        
        const { total, pages: totalPages }: PageStatsResponse = await pagestats(page, platform);
        setPages(totalPages);
        setCurrPage(page);

        const data: any = await platformApi(
            { limit: page_limit, page, include_locations: true }, 
            platform
        );
        setHits(data);

        setLoading(false);
    }

    useEffect((): void => {
        const params = new URLSearchParams(window.location.search);
        const page: number = !isNaN(parseInt(params.get('page') || '')) ? parseInt(params.get('page') || '') : 1;
        fetchData(page);
    }, []); 

    const handleClick = useCallback((page: number): void => {
        fetchData(page);
    }, []);


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
                                key={post?.doc_id || post?.pad_id}
                                country={post?.country === 'NUL' || !post?.country ? 'Global' : post?.country}
                                title={post?.title || ''}
                                description={post?.snippets?.length ? `${post?.snippets} ${post?.snippets?.length ? '...' : ''}` : post?.snippet}
                                source={post?.base || 'Solution'}
                                tagStyle="bg-light-green"
                                tagStyleShade="bg-light-green-shade"
                                href={post?.url}
                                viewCount={0}
                                tags={post?.tags}
                                sdg={`SDG ${post?.sdg?.join('/')}`}
                                backgroundImage={post?.vignette}
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
