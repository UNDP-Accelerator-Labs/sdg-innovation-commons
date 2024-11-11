"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/app/ui/components/Button';
import Card from '@/app/ui/components/Card/with-img';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import Link from 'next/link';
import clsx from 'clsx';
import platformApi from '@/app/lib/data/platform-api';
import nlpApi from '@/app/lib/data/nlp-api';
import { processHits } from '../Learn';
import { PostProps } from '@/app/lib/definitions';
import { defaultSearch } from '@/app/lib/utils';
import { useIsVisible } from '@/app/ui/components/Interaction';

export default function Section() {
    const tabs = ['all', 'experiment', 'action plan'] as const; 
    type TabType = typeof tabs[number]; 

    // Manage the active tab and data
    const [activeTab, setActiveTab] = useState<TabType>(tabs[0]);

    const [hits, setHits] = useState<PostProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Loading state

    // Fetch data when the tab changes
    useEffect(() => {
        async function fetchData() {
            setLoading(true); // Set loading to true when fetching starts
            
            // const data = await testApi({ limit: 5, search: defaultSearch('test'), doc_type: [activeTab] });
            // const { hits: fetchedHits } = data || {};
            // setHits(processHits(fetchedHits, 3));

            let data: any[];

            if (activeTab !== 'all') {
                data = await platformApi(
                    { limit: 3, page: 1, orderby: 'random' }, 
                    activeTab, 
                    'pads'
                );
            } else {
                console.log('look for all items')
                data = await nlpApi(
                    { limit: 3, doc_type: tabs.slice(1), search: defaultSearch('test') }
                );
            }


            // const data = await platformApi({ limit: 3, page: 1, orderby: 'random' }, activeTab, 'pads');
            setHits(data);

            setLoading(false); // Set loading to false when fetching ends
        }

        fetchData();
    }, [activeTab]);

    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useIsVisible(ref);

    return (
        <>
        <section className='lg:home-section lg:py-[80px]'>
            <div className='inner lg:mx-auto lg:px-[80px] lg:w-[1440px]'>
                {/* Display the section title and description */}
                <div className='section-header lg:mb-[40px]'>
                    <div className='c-left lg:col-span-5'>
                        <h2 ref={ref} className={`orange lg:mt-[5px] ${isVisible ? 'slanted-bg' : ''}`}>
                            <span>What We Test</span>
                        </h2>
                    </div>
                    <div className='c-right lg:col-span-4 lg:mt-[20px]'>
                        <p className="lead">
                            <b>Discover wicked development challenges we are curious about and the experiments conducted to learn what works and what doesn't in sustainable development.</b>
                        </p>
                    </div>
                </div>
                <div className='section-content'>
                    {/* Display tabs */}
                    <nav className='tabs'>
                        {tabs.map((d, i) => {
                            let txt: string = '';
                            if (d === 'all') txt = 'all items';
                            else txt = d;

                            return (
                                <div key={i}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveTab(d);
                                    }}
                                    className={clsx('tab tab-line', activeTab === d ? 'font-bold' : 'orange')}
                                >
                                    {`${txt}${txt.slice(-1) === 's' ? '' : 's'}`}
                                </div>
                            )
                        })}
                    </nav>
                    {/* Display Cards */}
                    <div className='grid gap-[20px] lg:grid-cols-3'>
                        {loading ? (
                            <ImgCardsSkeleton /> // Show Skeleton when loading
                        ) : (
                            hits?.map((post: any) => (
                                <Card
                                    key={post?.doc_id || post?.pad_id }
                                    country={post?.country === 'NUL' || !post?.country ? 'Global' : post?.country}
                                    title={post?.title || ''}
                                    description={post?.snippets?.length ? `${post?.snippets} ${post?.snippets?.length ? '...' : ''}` : post?.snippet }
                                    source={post?.base || ''}
                                    tagStyle={post?.base === 'action plan' ? 'bg-light-yellow' : 'bg-light-orange'}
                                    tagStyleShade={post?.base === 'action plan' ? 'bg-light-yellow-shade' : 'bg-light-orange-shade'}
                                    href={post?.url}
                                    viewCount={0}
                                    tags={post?.tags}
                                    sdg={`SDG ${post?.sdg?.join('/')}`}
                                    backgroundImage={post?.vignette}
                                    className=''
                                    date={post?.date}
                                />
                            ))
                        )}
                    </div>
                </div>
                <div className='section-footer text-right'>
                    <Button>
                        <Link href={'/test/all'}>
                            View All
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
        </>
    );
}
