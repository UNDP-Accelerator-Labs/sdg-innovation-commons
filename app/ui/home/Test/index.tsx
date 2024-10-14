"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/app/ui/components/Button';
import Card from '@/app/ui/components/Card/with-img';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import Link from 'next/link';
import clsx from 'clsx';
import testApi from '@/app/lib/data/test';
import { processHits } from '../Learn';
import { PostProps } from '@/app/lib/definitions';

export default function Section() {
    // Manage the active tab and data
    const [activeTab, setActiveTab] = useState<'experiment' | 'action plan'>('experiment');
    const [hits, setHits] = useState<PostProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Loading state

    // Fetch data when the tab changes
    useEffect(() => {
        async function fetchData() {
            setLoading(true); // Set loading to true when fetching starts
            const data = await testApi({ limit: 5, search: 'What is the network testing?', doc_type: [activeTab] });
            const { hits: fetchedHits } = data || {};
            setHits(processHits(fetchedHits, 3));
            setLoading(false); // Set loading to false when fetching ends
        }

        fetchData();
    }, [activeTab]);

    return (
        <>
            <div className="w-full relative bg-white border-black border-t-[1px] border-solid box-border overflow-hidden flex flex-col items-center justify-end py-10 lg:py-[100px] px-0 gap-[30px] lg:gap-[100px] text-left text-17xl text-black">
                <div className="self-stretch flex flex-col lg:flex-row items-start justify-start py-0 px-5 lg:px-20 gap-[30px] lg:gap-[357px] z-[2]">
                    <div className="w-[292.4px] relative h-[54px]">
                        <img className="absolute top-[23.17px] lg:top-[28px] left-[-10.5px] lg:left-[0px] mw-[200.3px] lg:w-[292.4px] h-[26px]" alt="" src="images/Rectangle-orange.svg" />
                        <b className="absolute lg:top-[0px] lg:left-[22px] text-h2-desktop lg:text-h2-desktop">What We Test</b>
                    </div>
                    <div className="flex-1 flex flex-col items-start justify-start gap-10 text-3xl">
                        <b className="self-stretch lg:w-[517.5px] relative text-h3-mobile lg:text-h3-desktop inline-block">Discover wicked development challenges we are curious about and the experiments conducted to learn what works and what doesn´t in sustainable development</b>
                    </div>
                </div>

                <div className="self-stretch flex flex-col items-start justify-start gap-[50px] text-sm ">
                    <div className="self-stretch flex flex-col items-start justify-start">
                        <div className="self-stretch flex flex-col items-start justify-start py-0 px-5 lg:px-20 gap-[45px]">

                            {/* Tabs */}
                            <div className="w-full relative flex flex-row items-center justify-start text-center text-lg text-black">
                                <div className="w-[290px] border-light-orange-shade border-b-[2px] border-solid box-border h-9 flex flex-col items-start justify-start">
                                    <div className="flex flex-row items-start justify-start gap-spacing-xl cursor-pointer">
                                        <div
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setActiveTab('experiment');
                                            }}
                                            className={clsx("h-9 flex flex-row items-center justify-center pt-0 px-spacing-xs pb-spacing-lg box-border cursor-pointer", activeTab === 'experiment' ? 'border-black border-b-[2px] border-solid' : '')}
                                        >
                                            <b className="relative leading-[20px]">Experiments</b>
                                        </div>
                                        <div
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setActiveTab('action plan');
                                            }}
                                            className={clsx("h-9 flex flex-row items-center justify-center pt-0 px-spacing-xs pb-spacing-lg box-border cursor-pointer", activeTab === 'action plan' ? 'border-black border-b-[2px] border-solid' : '')}
                                        >
                                            <b className="relative leading-[20px]">Learning Plans</b>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Display Cards */}
                            <div className="flex flex-col md:flex-row lg:flex-row gap-5">
                                {loading ? (
                                    <ImgCardsSkeleton /> // Show Skeleton when loading
                                ) : (
                                    hits?.map((post: any) => (
                                        <Card
                                            key={post.doc_id}
                                            country={post?.country === 'NUL' || !post?.country ? 'Global' : post?.country}
                                            title={post?.title || ''}
                                            description={post?.snippets?.length ? `${post?.snippets} ${post?.snippets?.length ? '...' : ''}` : post?.snippet }
                                            source={post?.base || ''}
                                            tagStyle="bg-light-orange"
                                            tagStyleShade="bg-light-orange-shade"
                                            viewCount={0}
                                            tags={post?.tags}
                                            sdg={`SDG ${post?.sdg?.join('/')}`}
                                            backgroundImage={post?.vignette}
                                            className='lg:!h-[700px]'
                                        />
                                    ))
                                )}
                            </div>

                        </div>
                    </div>
                    <div className="self-stretch flex flex-row items-start justify-end py-0 px-20 gap-10 text-center text-sm lg:text-lg">
                        <Button>
                            <Link href={'/test'}>
                                View All
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
