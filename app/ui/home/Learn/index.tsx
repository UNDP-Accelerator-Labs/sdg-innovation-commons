"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/app/ui/components/Button';
import Card from '@/app/ui/components/Card/without-img';
import { NoImgCardSkeleton } from '@/app/ui/components/Card/skeleton';
import Link from 'next/link';
import nlpApi from '@/app/lib/data/nlp-api';
import { formatDate, defaultSearch } from '@/app/lib/utils';
import { PostProps } from '@/app/lib/definitions';
import { Props } from '../See'

export default function Section({ boards, isLogedIn}: Props) {
    const [hits, setHits] = useState<PostProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const displayN = 4;

    // Fetch data on component mount
    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            const data = await nlpApi(
                { limit: 4, doc_type: ['blog', 'publications', 'news'], search: defaultSearch('learn') }
            );

            setHits(data);
            setLoading(false); 
        }

        fetchData();
    }, []); 

    return (
        <>
        <section className='home-section py-[40px] lg:py-[80px] grid-bg'>
            <div className='inner mx-auto px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px]'>
                {/* Display the section title and description */}
                <div className='section-header lg:mb-[100px]'>
                    <div className='c-left col-span-9 lg:col-span-5'>
                        <h2 className='mb-[20px]'>
                            <span className='slanted-bg yellow'>
                                <span>What We Learn</span>
                            </span>
                        </h2>
                    </div>
                    <div className='c-right col-span-9 lg:col-span-4 mb-[40px] lg:mb-0 lg:mt-[20px]'>
                        <p className="lead">
                            <b>Browse through our blogs, publications, and toolkits to learn what works and what doesn’t in sustainable development.</b>
                        </p>
                    </div>
                </div>
                <div className='section-content'>
                    {/* Display Cards */}
                    <div className='w-full grid gap-[20px] md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-3'>
                        <div className='grid md:grid-cols-2 col-span-2  lg:grid lg:grid-cols-2 lg:col-span-2 lg:col-start-2 gap-[20px] '>
                            {loading ? (
                                <>
                                    {new Array(displayN).fill(0).map((d, i) => (
                                        <NoImgCardSkeleton key={i} />
                                    ))}
                                </>
                            ) : (
                                hits?.map((post: any, i: number) => (
                                    <Card
                                        id={post.doc_id}
                                        key={post.doc_id}
                                        // country={post?.meta?.iso3[0] === 'NUL' || !post?.meta?.iso3[0] ? 'Global' : post?.meta?.iso3[0]}
                                        country={post?.country === 'NUL' || !post?.country ? 'Global' : post?.country}
                                        date={formatDate(post?.meta?.date) || ''}
                                        title={post?.title || ''}
                                        description={`${post?.snippets} ${post?.snippets?.length ? '...' : ''}`}
                                        tags={post?.base || ''}
                                        tagStyle="bg-light-blue"
                                        href={post?.url}
                                        openInNewTab={true}
                                        className={i >= 2 ? 'hidden xl:block' : ''}
                                        source={post?.base || 'blog'}

                                        isLogedIn={isLogedIn}
                                        boardInfo={{
                                            boards
                                        }}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
                <div className='section-footer text-right'>
                    <Button>
                        <Link href={'/learn/all'}>
                            Read All
                        </Link>
                    </Button>
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

