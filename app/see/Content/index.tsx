"use client";

import { useState, useEffect } from 'react';
import Card from '@/app/ui/components/Card/with-img';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import seeApi from '@/app/lib/data/see';
import { processHits } from '@/app/ui/home/Learn';
import { defaultSearch, page_limit } from '@/app/lib/utils';

interface SectionProps {
    searchTerm: string; 
}

export default function Section({ searchTerm }: SectionProps) {
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
