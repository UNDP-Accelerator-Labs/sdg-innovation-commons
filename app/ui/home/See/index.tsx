"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/app/ui/components/Button';
import Card from '@/app/ui/components/Card/with-img';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import Link from 'next/link';
import seeApi from '@/app/lib/data/see';
import { processHits } from '../Learn';

export default function Section() {
    const [hits, setHits] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Loading state

    // Fetch data on component mount
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await seeApi({ limit: 10, search: 'What solutions is the network seeing?' });
            const { hits: fetchedHits } = data || {};
            setHits(processHits(fetchedHits, 3));
            setLoading(false); // Set loading to false when data is fetched
        }

        fetchData();
    }, []); // Empty dependency array to run only on mount

    return (
        <>
            <div className="w-full relative bg-white border-black border-t-[1px] border-solid box-border overflow-hidden flex flex-col items-center justify-end py-10 lg:py-[100px] px-0 gap-[30px] lg:gap-[100px] text-left text-17xl text-black">
                <div className="self-stretch flex flex-col lg:flex-row items-start justify-start py-0 px-5 lg:px-20 gap-[30px] lg:gap-[357px] z-[2]">
                    <div className="w-[292.4px] relative h-[54px]">
                        <img className="absolute top-[23.17px] lg:top-[28px] left-[-10.5px] lg:left-[0px] mw-[200.3px] lg:w-[292.4px] h-[26px]" alt="" src="images/Rectangle-light-green.svg" />
                        <b className="absolute lg:top-[0px] lg:left-[22px] text-h2-desktop lg:text-h2-desktop ">What We See</b>
                    </div>
                    <div className="flex-1 flex flex-col items-start justify-start gap-10 text-3xl">
                        <b className="self-stretch lg:w-[517.5px] relative text-h3-mobile lg:text-h3-desktop inline-block">Discover and learn existing Sustainable Development Solutions on the ground</b>
                    </div>
                </div>
                <div className="self-stretch flex flex-col items-start justify-start gap-[50px] text-sm ">
                    <div className="self-stretch flex flex-col items-start justify-start">
                        <div className="self-stretch flex flex-col items-start justify-start py-0 px-5 lg:px-20 gap-[45px]">
                            <div className="flex flex-col md:flex-row lg:flex-row gap-5 ">
                                {loading ? (
                                    <ImgCardsSkeleton /> // Show Skeleton while loading
                                ) : (
                                    hits?.map((post: any) => (
                                        <Card
                                            key={post.doc_id}
                                            country={post?.country === 'NUL' || !post?.country ? 'Global' : post?.country}
                                            title={post?.title || ''}
                                            description={post?.snippets?.length ? `${post?.snippets} ${post?.snippets?.length ? '...' : ''}` : post?.snippet}
                                            source={post?.base || ''}
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
                    </div>
                    <div className="self-stretch flex flex-row items-start justify-end py-0 px-20 gap-10 text-center text-sm lg:text-lg">
                        <Button>
                            <Link href={'/see'}>
                                View All
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
