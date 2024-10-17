"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/app/ui/components/Button';
import Card from '@/app/ui/components/Card/without-img';
import { NoImgCardSkeleton } from '@/app/ui/components/Card/skeleton';
import Link from 'next/link';
import learnApi from '@/app/lib/data/learn';
import { formatDate, defaultSearch } from '@/app/lib/utils';
import { PostProps } from '@/app/lib/definitions';

export default function Section() {
    const [hits, setHits] = useState<PostProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const displayN = 27;

    // Fetch data on component mount
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await learnApi({ limit: displayN, search: defaultSearch('learn') });
            const { hits: fetchedHits } = data || {};
            setHits(processHits(fetchedHits, displayN));
            setLoading(false); 
        }
        fetchData();
    }, []); 

    return (
        <>
            <section className='lg:home-section lg:px-[80px] lg:pb-[100px] grid-bg !border-none'>
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
                            hits?.map((post: any) => (
                                <Card
                                    key={post.doc_id}
                                    country={post?.meta?.iso3[0] === 'NUL' || !post?.meta?.iso3[0] ? 'Global' : post?.meta?.iso3[0]}
                                    date={formatDate(post?.meta?.date) || ''}
                                    title={post?.title || ''}
                                    description={`${post?.snippets} ${post?.snippets?.length ? '...' : ''}`}
                                    tags={post?.base || ''}
                                    tagStyle="bg-light-blue"
                                    href={post?.url}
                                    openInNewTab={true}
                                />
                            ))
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