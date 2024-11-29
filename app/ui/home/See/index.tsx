"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/app/ui/components/Button';
import Card from '@/app/ui/components/Card/with-img';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import Link from 'next/link';
import platformApi from '@/app/lib/data/platform-api';
import { boolean } from 'zod';

export interface Props {
    boards: any[];
    isLogedIn: boolean;
}

export default function Section({ boards, isLogedIn}: Props) {
    const [hits, setHits] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Loading state

    // Fetch data on component mount
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await platformApi({ limit: 3, page: 1, orderby: 'random' }, 'solution', 'pads');
            setHits(data);
            setLoading(false); 
        }
        fetchData();
    }, []); 

    return (
        <>
        <section className='home-section py-[40px] lg:py-[80px]'>
            <div className='inner mx-auto px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px]'>
                {/* Display the section title and description */}
                <div className='section-header lg:mb-[100px]'>
                    <div className='c-left col-span-9 lg:col-span-5'>
                        <h2 className='mb-[20px]'>
                            <span className='slanted-bg green'>
                                <span>What We See</span>
                            </span>
                        </h2>
                    </div>
                    <div className='c-right col-span-9 lg:col-span-4 mb-[40px] lg:mb-0 lg:mt-[20px]'>
                        <p className='lead'>
                            <b>Discover and learn existing Sustainable Development Solutions on the ground.</b>
                        </p>
                    </div>
                </div>
                <div className='section-content'>
                    {/* Display Cards */}
                    <div className='grid gap-[20px] md:grid-cols-2 xl:grid-cols-3'>
                        {loading ? (
                            <ImgCardsSkeleton /> // Show Skeleton while loading
                        ) : (
                            hits?.map((post: any, i: number) => {
                                let countries = post?.locations?.map((d: any) => d.country) || [];
                                if (!countries.length) countries = [post?.country === 'NUL' || !post?.country ? 'Global' : post?.country];
                                else {
                                    countries = countries.filter((value: string, index: number, array: string[]) => {
                                      return array.indexOf(value) === index;
                                    })
                                    if (countries.length > 3) {
                                        const n = countries.length;
                                        countries = countries.slice(0, 3);
                                        countries.push(`+${n - 3}`);
                                    }
                                }
                                return (
                                    <Card
                                        key={post?.doc_id || post?.pad_id }
                                        id={post.doc_id || post?.pad_id}
                                        country={countries}
                                        title={post?.title || ''}
                                        description={post?.snippets?.length ? `${post?.snippets} ${post?.snippets?.length ? '...' : ''}` : post?.snippet}
                                        source={post?.base || 'solution'}
                                        tagStyle="bg-light-green"
                                        tagStyleShade="bg-light-green-shade"
                                        href={post?.url}
                                        viewCount={0}
                                        tags={post?.tags}
                                        sdg={`SDG ${post?.sdg?.join('/')}`}
                                        backgroundImage={post?.vignette}
                                        date={post?.date}
                                        engagement={post?.engagement}
                                        data={post}
                                        className={i === 2 ? 'hidden xl:block' : ''}

                                        isLogedIn={isLogedIn}
                                        boardInfo={{
                                            boards
                                        }}
                                    />
                                )
                            })
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
