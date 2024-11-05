"use client";

import { useState, useEffect } from 'react';
import Card from '@/app/ui/components/Card/without-img';
import { NoImgCardSkeleton } from '@/app/ui/components/Card/skeleton';
import { pagestats, Pagination } from '@/app/ui/components/Pagination';
import nlpApi from '@/app/lib/data/nlp-api';
import { formatDate, defaultSearch, page_limit } from '@/app/lib/utils';
import { PostProps } from '@/app/lib/definitions';
import clsx from 'clsx';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import statsApi from '@/app/lib/data/nlp-pagination';

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

    // const docType = 'blogs'
    const [pages, setPages] = useState<number>(0);
    const [hits, setHits] = useState<PostProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const displayN = page_limit;

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

            const data = await nlpApi(
                { ... searchParams, ...{ limit: page_limit, doc_type } }
            );
            setHits(data);

            setLoading(false); 
        }
        fetchData();
    }, []); 

    return (
        <>
        <section className='lg:home-section lg:pb-[80px] !border-none'>
            <div className='inner lg:mx-auto lg:px-[80px] lg:w-[1440px]'>
                {/* Display tabs */}
                <nav className='tabs'>
                    {tabs.map((d: any, i: number) => {
                        let txt: string = '';
                        if (d === 'all') txt = 'all items';
                        else txt = d;
                        return (
                            <div key={i} className={clsx('tab tab-line', docType === d ? 'font-bold' : 'yellow')}>
                                <Link href={`/learn/${d}?${windowParams.toString()}`}>
                                    {`${txt}${txt.slice(-1) === 's' ? '' : 's'}`}
                                </Link>
                            </div>
                        )
                    })}
                </nav>
                <div className='section-content'>
                    {/* Display Cards */}
                    <div className='grid gap-[20px] lg:grid-cols-3'>
                        {loading ? (
                            <>
                                {new Array(displayN).fill(0).map((d, i) => (
                                    <NoImgCardSkeleton key={i} />
                                ))}
                            </>
                        ) : (
                            hits?.map((post: any) => {
                                return (
                                    <Card
                                        key={post.doc_id}
                                        // country={post?.meta?.iso3[0] === 'NUL' || !post?.meta?.iso3[0] ? 'Global' : post?.meta?.iso3[0]}
                                        country={post?.country === 'NUL' || !post?.country ? 'Global' : post?.country}
                                        date={formatDate(post?.meta?.date) || ''}
                                        title={post?.title || ''}
                                        description={`${post?.snippets} ${post?.snippets?.length ? '...' : ''}`}
                                        tags={post?.meta?.doc_type || ''}
                                        tagStyle="bg-light-blue"
                                        href={post?.url}
                                        openInNewTab={true}
                                        source={post?.meta?.doc_type || ''}
                                    />
                                )
                            })
                        )}
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
            </div>
        </section>
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