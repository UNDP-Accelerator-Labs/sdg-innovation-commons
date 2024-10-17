"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/app/ui/components/Button';
import Card from '@/app/ui/components/Card/with-img';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import Link from 'next/link';
import seeApi from '@/app/lib/data/see';
import { processHits } from '@/app/ui/home/Learn';
import { defaultSearch } from '@/app/lib/utils';

export default function Section() {
    const [hits, setHits] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const displayN = 27;

    // Fetch data on component mount
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await seeApi({ limit: displayN, search: defaultSearch('see') });
            const { hits: fetchedHits } = data || {};
            setHits(processHits(fetchedHits, displayN));
            setLoading(false); // Set loading to false when data is fetched
        }
        fetchData();
    }, []); // Empty dependency array to run only on mount

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
                                key={post?.doc_id || post?.pad_id }
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
        </section>
        </>
    );
}
