"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/app/ui/components/Button';
import Card from '@/app/ui/components/Card/with-img';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import Link from 'next/link';
import platformApi from '@/app/lib/data/platform-api';
import { processHits } from '../Learn';
import { defaultSearch } from '@/app/lib/utils';

export default function Section() {
    const [hits, setHits] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Loading state

    // Fetch data on component mount
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            // const data = await platformApi({ limit: 10, search: defaultSearch('see') });
            // const { hits: fetchedHits } = data || {};
            // setHits(processHits(fetchedHits, 3));

            const data = await platformApi({ limit: 3, page: 1, orderby: 'random' }, 'solution', 'pads');
            setHits(data);

            setLoading(false); // Set loading to false when data is fetched
        }
        fetchData();
    }, []); // Empty dependency array to run only on mount

    return (
        <>
        <section className='lg:home-section lg:py-[80px]'>
            <div className='inner lg:mx-auto lg:px-[80px] lg:w-[1440px]'>
                {/* Display the section title and description */}
                <div className='section-header lg:mb-[100px]'>
                    <div className='c-left lg:col-span-5'>
                        <h2 className='slanted-bg green lg:mt-[5px]'>
                            <span>What We See</span>
                        </h2>
                    </div>
                    <div className='c-right lg:col-span-4 lg:mt-[20px]'>
                        <p className="lead">
                            <b>Discover and learn existing Sustainable Development Solutions on the ground.</b>
                        </p>
                    </div>
                </div>
                <div className='section-content'>
                    {/* Display Cards */}
                    <div className='grid gap-[20px] lg:grid-cols-3'>
                        {loading ? (
                            <ImgCardsSkeleton /> // Show Skeleton while loading
                        ) : (
                            hits?.map((post: any) => (
                                <Card
                                    key={post?.doc_id || post?.pad_id }
                                    id={post.doc_id || post?.pad_id}
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
                                    date={post?.date}
                                />
                            ))
                        )}
                    </div>
                </div>
                <div className='section-footer text-right'>
                    <Button>
                        <Link href={'/see'}>
                            View All
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
        </>
    );
}
