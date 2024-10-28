"use client";

import { useState, useEffect, useCallback } from 'react';
import Card from '@/app/ui/components/Card/with-img';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import { pagestats, Pagination } from '@/app/ui/components/Pagination';
import platformApi from '@/app/lib/data/platform-api';
import nlpApi from '@/app/lib/data/nlp-api';
import { page_limit } from '@/app/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';

export interface PageStatsResponse {
    total: number;
    pages: number;
}

// interface PlatformApiResponse {
//     hits: any[]; 
// }

interface SectionProps {
    apiParams: any;
    handlePageUpdate: Function;
    handleTabUpdate: Function;
    platform: string;
    tabs: string[];
}

export default function Section({
    apiParams,
    handlePageUpdate,
    handleTabUpdate,
    platform,
    tabs
}: SectionProps) {
    const pathname = usePathname();
    const router = useRouter();

    const { page, search } = apiParams;

    const [pages, setPages] = useState<number>(0);
    const [hits, setHits] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    async function fetchData(): Promise<void> {
        setLoading(true);

        const { total, pages: totalPages }: PageStatsResponse = await pagestats(page, platform, 3);
        setPages(totalPages);
        
        let data: any[];
        console.log(platform)

        if (!search) {
            data = await platformApi(
                { ...apiParams, ...{ limit: page_limit, include_locations: true } },
                platform,
                'pads'
            );
        } else {
            console.log('look for search term', search)
            data = await nlpApi(
                { ... apiParams, ...{ limit: page_limit, doc_type: platform } },
                platform
            );
        }
        setHits(data);

        setLoading(false);
    }

    useEffect(() => {
        // set the url search parameters
        const params = new URLSearchParams();
        for (let k in apiParams) {
            params.append(k, apiParams[k]);
        }
        const queryString = params.toString();
        const updatedPath = queryString ? `${pathname}?${queryString}` : pathname;
        // router.push(updatedPath, '', { shallow: true });
        router.push(updatedPath);
        
        fetchData();
    }, [apiParams, platform]);

    const handleClick = useCallback((page: number): void => {
        handlePageUpdate(page);
    }, []);

    return (
        <>
        <section className='lg:home-section lg:px-[80px] lg:py-[100px]'>
            {/* Display tabs */}
            <nav className='tabs'>
                {tabs.map((d, i) => {
                    return (
                    <div key={i}
                        onClick={(e) => {
                            e.preventDefault();
                            handleTabUpdate(d);
                        }}
                        className={clsx('tab tab-line', platform === d ? '' : 'orange')}
                    >
                        <b>{`${d}s`}</b>
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
                        page={page}
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
