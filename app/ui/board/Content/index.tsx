import clsx from 'clsx';
import Link from 'next/link';
import Card from '@/app/ui/components/Card/with-img';
import BlogCard from '@/app/ui/components/Card/without-img';

import boardData from '@/app/lib/data/board';

import { pagestats, Pagination } from '@/app/ui/components/Pagination';
import { commonsPlatform, page_limit, formatDate } from '@/app/lib/utils';
import { is_user_logged_in } from '@/app/lib/session';
import platformApi from '@/app/lib/data/platform-api';

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

    // Group asynchronous calls
    const [boardDataResult, boardList, isLogedIn] = await Promise.all([
        boardData({ id, platform, searchParams }), 
        {},
        // platformApi({ space : 'private' }, 'solution', 'pinboards'),  
        is_user_logged_in()
    ]);

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
        vignette,
        status,
        is_contributor, 
    } = boardDataResult || {};

    const { data: boardlist, count } = boardList;

    return (
        <>
        <Hero 
            title={title}
            creator={creatorName}
            lab={lab}
            includeMetadata={true}
            contributors={contributors}
            padsCount={pads?.count}
            locations={locations}
            tags={tags}
        />

        {description?.length > 0 && (
            <Infobar 
                description={description} 
                vignette={vignette} 
            />
        )}
        
        <section className='home-section py-[40px] lg:py-[80px]'>
            <div className='inner mx-auto px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px]'>
                {/* Display the section title and description */}
                <div className='section-header mb-[20px] lg:mb-[100px]'>
                    <div className='c-left col-span-9 lg:col-span-5'>
                        <h2 className='mb-[20px]'>
                            <span className='slanted-bg yellow'>
                                <span>Full Board Overview</span>
                            </span>
                        </h2>
                    </div>
                    <div className='c-right col-span-9 lg:col-span-4 lg:mt-[20px]'>
                        <p className="lead">
                            <b>Search through all the items that are part of this board.</b>
                        </p>
                    </div>
                </div>
                {/* SEARCH */}
                <Search searchParams={searchParams} title={title} description={description} id={id as number} status={status} is_contributor={is_contributor} />
                {/* Display tabs */}
                <Tabs id={id} tabs={tabs} platform={platform} />
                <div className='section-content'>
                    {/* Display Cards */}
                    <div className='grid gap-[20px] md:grid-cols-2 lg:grid-cols-3'>
                        {
                            data?.flat()
                            .map((d: any, i: number) => {
                                if (d) {
                                    if (d.base === 'blog') {
                                        return (
                                            <BlogCard
                                                id={d?.id}
                                                key={i}
                                                country={d?.country === 'NUL' || !d?.country ? 'Global' : d?.country}
                                                date={formatDate(d?.parsed_date) || ''}
                                                title={d?.title || ''}
                                                description=''
                                                tags={d?.base || ''}
                                                tagStyle='bg-light-blue'
                                                href={d?.url}
                                                openInNewTab={true}
                                                className='border-[1px] border-solid box-border'
                                                source={d?.base || 'blog'}

                                                isLogedIn={isLogedIn}
                                                boardInfo={{
                                                    boards: boardlist,
                                                    removeFromBoard: true,
                                                    boardId: id,
                                                    articleType: d?.article_type
                                                }}
                                                data={d}
                                            />
                                        )
                                    } else {
                                        let color: string = 'green';
                                        let path: string = 'see';
                                        if (d.base === 'action plan') {
                                            color = 'yellow';
                                            path = 'test';
                                        } else if (d?.base === 'experiment') {
                                            color = 'orange';
                                            path = 'test';
                                        }
                                        return (
                                            <Card 
                                                key={i}
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
                                                data={d}
                                                isLogedIn={isLogedIn}
                                                boardInfo={{
                                                    boards: boardlist,
                                                    removeFromBoard: true,
                                                    boardId: id
                                                }}
                                                
                                            />
                                        )
                                    }
                                }
                            })
                        }
                    </div>
                </div>
                <div className='pagination'>
                    <div className='w-full flex justify-center col-start-2'>
                        <Pagination
                            page={+page}
                            totalPages={pages}
                        />
                    </div>
                </div>
            </div>
        </section>
        </>
    );
}