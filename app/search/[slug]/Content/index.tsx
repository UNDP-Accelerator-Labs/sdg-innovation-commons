"use client";

import { useState, useEffect } from 'react';
import Card from '@/app/ui/components/Card/without-img';
import ImgCard from '@/app/ui/components/Card/with-img';
import { NoImgCardSkeleton } from '@/app/ui/components/Card/skeleton';
import globalSearch from '@/app/lib/data/global-search';
import { formatDate, page_limit } from '@/app/lib/utils';
import { PostProps } from '@/app/lib/definitions';

export interface ContentProps {
    slug: string;
}

const Content: React.FC<ContentProps> = ({ slug }) => {
    const [hits, setHits] = useState<PostProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true); 

    // Fetch data on component mount
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await globalSearch({ search: decodeURIComponent(slug) });
            const { hits: fetchedHits } = data || {};
            setHits(fetchedHits);
            setLoading(false); 
        }
        fetchData();
    }, [slug]); 

    return (
        <>
            <section className='lg:home-section lg:px-[80px] lg:pb-[100px] grid-bg !border-none'>
                <div className='section-content flex lg:flex-row'>
                    {/* Display Cards */}
                    <div className='w-full grid gap-[20px] lg:grid-cols-3'>
                        {loading ? (
                            <>
                            {new Array(page_limit).fill(0).map((d, i) => (
                                <NoImgCardSkeleton key={i} />
                            ))}
                            </>
                        ) : (
                            hits?.map((post: any) => {
                            return !post?.vignette?.length ? (
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
                            ) : (
                                <ImgCard
                                    key={post?.doc_id || post?.pad_id}
                                    country={post?.country === 'NUL' || !post?.country ? 'Global' : post?.country}
                                    title={post?.title || ''}
                                    description={post?.snippet?.length ? `${post?.snippet}}` : post?.snippets}
                                    source={post?.base || ''}
                                    tagStyle="bg-light-green"
                                    tagStyleShade="bg-light-green-shade"
                                    href={post?.url}
                                    viewCount={0}
                                    tags={post?.tags}
                                    sdg={`SDG ${post?.sdg?.join('/')}`}
                                    backgroundImage={post?.vignette}
                                />
                            );
                            })
                        )}
                        </div>

                </div>
            </section>
        </>
    );
}

export default Content;