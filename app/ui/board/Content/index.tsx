import clsx from 'clsx';
import Link from 'next/link';
import Card from '@/app/ui/components/Card/with-img';

import boardData from '@/app/lib/data/board';

import { pagestats, Pagination } from '@/app/ui/components/Pagination';
import { commonsPlatform, page_limit } from '@/app/lib/utils';

import Hero from '../Hero';
import Infobar from '../Infobar';
import Search from '../Search';
import Tabs from '../Tabs';

interface Props {
    id?: number;
    platform: string;
    searchParams: any;
}

export default async function Section({
    id,
    platform,
    searchParams,
}: Props) {
    const { page } = searchParams;
    const { 
        title, 
        description, 
        creatorName, 
        contributors, 
        lab, 
        tabs, 
        pages, 
        platforms, 
        pads, 
        tags, 
        locations, 
        data, 
        vignette 
    } = await boardData({ id, platform, searchParams });

    return (
        <>
        <Hero 
            title={title}
            creator={creatorName}
            lab={lab}
            includeMetadata={true}
            contributors={contributors}
            padsCount={pads.count}
            locations={locations}
            tags={tags}
        />

        {description?.length && (
            <Infobar 
                description={description} 
                vignette={vignette} 
            />
        )}
        
        <section className='home-section lg:py-[80px]'>
            <div className='inner lg:mx-auto lg:px-[80px] lg:w-[1440px]'>
                {/* Display the section title and description */}
                <div className='section-header lg:mb-[100px]'>
                    <div className='c-left lg:col-span-5'>
                        <h2 className='lg:mt-[5px]'>
                            <span className='slanted-bg yellow'>
                                <span>Full Board Overview</span>
                            </span>
                        </h2>
                    </div>
                    <div className='c-right lg:col-span-4 lg:mt-[20px]'>
                        <p className="lead">
                            <b>Search through all the items that are part of this board.</b>
                        </p>
                    </div>
                </div>
                {/* SEARCH */}
                <Search searchParams={searchParams} />
                {/* Display tabs */}
                <Tabs id={id} tabs={tabs} platform={platform} />
                <div className='section-content'>
                    {/* Display Cards */}
                    <div className='grid gap-[20px] lg:grid-cols-3'>
                        {
                            data?.flat()
                            .map((d: any) => {
                                if (d) {
                                    let color: string = 'green';
                                    let path: string = 'see';
                                    if (d?.base === 'action plan') {
                                        color = 'yellow';
                                        path = 'test';
                                    } else if (d?.base === 'experiment') {
                                        color = 'orange';
                                        path = 'test';
                                    }
                                    return (
                                        <Card
                                            key={d?.doc_id || d?.pad_id}
                                            id={d?.doc_id || d?.pad_id}
                                            country={d?.country === 'NUL' || !d?.country ? 'Global' : d?.country}
                                            title={d?.title || ''}
                                            description={d?.snippets?.length ? `${d?.snippets} ${d?.snippets?.length ? '...' : ''}` : d?.snippet}
                                            source={d?.base || 'solution'}
                                            tagStyle={`bg-light-${color}`}
                                            tagStyleShade={`bg-light-${color}-shade`}
                                            href={d?.url}
                                            viewCount={0}
                                            tags={d?.tags}
                                            sdg={`SDG ${d?.sdg?.join('/')}`}
                                            backgroundImage={d?.vignette}
                                            date={d?.date}
                                            engagement={d?.engagement}
                                        />
                                    )
                                }
                            })
                        }
                    </div>
                </div>
                <div className='pagination'>
                    <div className='w-full flex justify-center col-start-2'>
                        <Pagination
                            page={+page ?? 1}
                            totalPages={pages}
                        />
                    </div>
                </div>
            </div>
        </section>
        </>
    );
}