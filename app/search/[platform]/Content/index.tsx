"use client";

import { useState, useEffect } from 'react';
import Card from '@/app/ui/components/Card/without-img';
import ImgCard from '@/app/ui/components/Card/with-img';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import nlpApi from '@/app/lib/data/nlp-api';
import { formatDate, page_limit } from '@/app/lib/utils';
import clsx from 'clsx';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { pagestats, Pagination } from '@/app/ui/components/Pagination';
import { PageStatsResponse, SectionProps } from '@/app/test/[platform]/Content';


export default function Content({
    searchParams,
    platform,
    tabs
}: SectionProps) {
    const { page, search } = searchParams;
    const windowParams = new URLSearchParams(useSearchParams());
    windowParams.set('page', '1');

    const [pages, setPages] = useState<number>(0);
    const [hits, setHits] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const initialTab = platform || tabs[0];

    // Manage the active tab and data
    const [docType, setDocType] = useState<string>(initialTab);

    async function fetchData(): Promise<void> {
        setLoading(true);

        let data: any[];
        let doc_type: string[];
        if (platform === 'all') doc_type = tabs.slice(1);
        else doc_type = [platform];
        if (searchParams.countries) searchParams.iso3 = searchParams.countries;

        const { total, pages: totalPages }: PageStatsResponse = await pagestats(page, doc_type, 3);
        setPages(totalPages);

        data = await nlpApi(
            { ...searchParams, ...{ limit: page_limit, doc_type } }
        );
        setHits(data);
        setLoading(false);
    }

    // Fetch data on component mount
    useEffect(() => {
        fetchData();
    }, []);


    return (
        <>
            <section className='lg:home-section !border-t-0 lg:pb-[80px]'>
                <div className='inner w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px] mx-auto'>
                    {/* Display tabs */}
                    <nav className='tabs'>
                        {tabs.map((d, i) => {

                            let txt: string = '';
                            if (d === 'all') txt = 'all items';
                            else txt = d;
                            return (
                                <div key={i} className={clsx('tab tab-line', docType === d ? 'font-bold' : 'yellow')}>
                                    <Link href={`/search/${d}?${windowParams.toString()}`} scroll={false}>
                                        {`${txt}${txt.slice(-1) === 's' ? '' : 's'}`}
                                    </Link>
                                </div>
                            )
                        })}
                    </nav>
                    <div className='section-content'>
                        {/* Display Cards */}
                        <div className='grid gap-[20px] md:grid-cols-2 xl:grid-cols-3'>
                            {loading ? (
                                <ImgCardsSkeleton />
                            ) : (
                                hits?.map((post: any, i: number) => {
                                    return post?.base == 'blog' ? (
                                        <Card
                                            key={i}
                                            id={post.doc_id}
                                            // country={post?.meta?.iso3[0] === 'NUL' || !post?.meta?.iso3[0] ? 'Global' : post?.meta?.iso3[0]}
                                            country={post?.country === 'NUL' || !post?.country ? 'Global' : post?.country}
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
                                            key={i}
                                            id={post?.doc_id || post?.pad_id}
                                            country={post?.country === 'NUL' || !post?.country ? 'Global' : post?.country}
                                            title={post?.title || ''}
                                            description={post?.snippet?.length ? `${post?.snippet?.length > 200 ? `${post.snippet.slice(0, 200)}…` : post.snippet}` : post?.snippets}
                                            source={post?.base || ''}
                                            tagStyle="bg-light-green"
                                            tagStyleShade="bg-light-green-shade"
                                            href={post?.url}
                                            viewCount={0}
                                            tags={post?.tags}
                                            sdg={post?.sdg?.length ? `SDG ${post?.sdg?.join('/')}` : ''}
                                            backgroundImage={post?.vignette}
                                        />
                                    );
                                })
                            )}
                        </div>

                    </div>


                    <div className='pagination'>
                        <div className='w-full flex justify-center col-start-2'>
                            {!loading ? (
                                <Pagination
                                    page={+page}
                                    totalPages={pages}
                                />
                            ) : (<small className='block w-full text-center'>Loading pagination</small>)
                            }
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
