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
    const displayN = 4;

    // Fetch data on component mount
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await learnApi({ limit: 10, search: defaultSearch('learn') });
            const { hits: fetchedHits } = data || {};
            setHits(processHits(fetchedHits, displayN));
            setLoading(false); 
        }

        fetchData();
    }, []); 

    return (
        <>
            <section className='lg:home-section lg:px-[80px] lg:py-[100px] grid-bg'>
                {/* Display the section title and description */}
                <div className='section-header lg:mb-[100px]'>
                    <div className='c-left lg:col-span-5'>
                        <h2 className='slanted-bg yellow lg:mt-[5px]'>
                            <span>What We Learn</span>
                        </h2>
                    </div>
                    <div className='c-right lg:col-span-4 lg:mt-[20px]'>
                        <p className="lead">
                            <b>Browse through our blogs, publications, and toolkits to learn what works and what doesn’t in sustainable development.</b>
                        </p>
                    </div>
                </div>
                <div className='section-content flex lg:flex-row'>
                    {/* Display Cards */}
                    <div className='w-full grid gap-[20px] lg:grid-cols-3'>
                        <div className='grid gap-[20px] lg:grid-cols-2 lg:col-span-2 lg:col-start-2'>
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
                </div>
                <div className='section-footer text-right'>
                    <Button>
                        <Link href={'/learn'}>
                            Read All
                        </Link>
                    </Button>
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

