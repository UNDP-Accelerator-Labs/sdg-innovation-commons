"use client";

import { useState, useEffect } from 'react';
import Card from '@/app/ui/components/Card/without-img';
import { NoImgCardSkeleton } from '@/app/ui/components/Card/skeleton';
import learnApi from '@/app/lib/data/learn';
import { formatDate, defaultSearch, page_limit } from '@/app/lib/utils';
import { PostProps } from '@/app/lib/definitions';
import clsx from 'clsx';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { statsApi } from '@/app/lib/data/nlp-pagination';

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

    const [hits, setHits] = useState<PostProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const displayN = page_limit;

    // Fetch data on component mount
    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            const doc_type: string[] | null = docType === 'all' ? null : [docType];

            // const counts = await statsApi({ doc_type });
            
            // TO DO: CHANGE THIS TO nlpAPI
            const data = await learnApi({ limit: displayN, search: search?.length ? search : defaultSearch('learn'), doc_type });
            const { hits: fetchedHits } = data || {};
            setHits(processHits(fetchedHits, displayN));
            setLoading(false); 
        }
        fetchData();
    }, []); 

    return (
        <>
            <section className='lg:home-section lg:px-[80px] lg:pb-[100px] !border-none'>
                {/* Display tabs */}
                <nav className='tabs'>
                    {tabs.map((d: any, i: number) => {
                        return (
                        <div key={i} className={clsx('tab tab-line', docType === d ? 'font-bold' : 'blue')}>
                            <Link href={`/learn/${d}?${windowParams.toString()}`}>{`${d}`}</Link>
                        </div>
                        )
                    })}
                </nav>
                <div className='section-content flex lg:flex-row'>
                    {/* Display Cards */}
                    <div className='w-full grid gap-[20px] lg:grid-cols-3'>
                        {loading ? (
                            <>
                                {new Array(displayN).fill(0).map((d, i) => (
                                    <NoImgCardSkeleton key={i} />
                                ))}
                            </>
                        ) : (
                            hits?.map((post: any) => {
                                console.log(post)
                                return (
                                    <Card
                                        key={post.doc_id}
                                        country={post?.meta?.iso3[0] === 'NUL' || !post?.meta?.iso3[0] ? 'Global' : post?.meta?.iso3[0]}
                                        date={formatDate(post?.meta?.date) || ''}
                                        title={post?.title || ''}
                                        description={`${post?.snippets} ${post?.snippets?.length ? '...' : ''}`}
                                        tags={post?.meta?.doc_type || ''}
                                        tagStyle="bg-light-blue"
                                        href={post?.url}
                                        openInNewTab={true}
                                    />
                                )
                            })
                        )}
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