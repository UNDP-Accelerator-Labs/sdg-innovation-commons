import clsx from 'clsx';
import Link from 'next/link';
import Card from '@/app/ui/components/Card/with-img';
import platformApi from '@/app/lib/data/platform-api';
import { pagestats, Pagination } from '@/app/ui/components/Pagination';
import { commonsPlatform, page_limit } from '@/app/lib/utils';

import Hero from '../Hero';
import Infobar from '../Infobar';
import Search from '../Search';
import Tabs from '../Tabs';

interface Props {
    id?: string;
    searchParams: any;
}

export default async function Section({
    id,
    searchParams,
}: Props) {
    const { page } = searchParams;
    // LOAD BOARD
    /*
    const boardData: any = await platformApi(
        { ...searchParams, ...{ pinboard: id, limit: page_limit } },
        'solution', // IN THIS CASE, PLATFORM IS IRRELEVANT, SINCE IT IS PULLING FROM THE GENERAL DB
        'pinboards'
    );
    const pages = Math.ceil(boardData?.total / page_limit) ?? 1;

    const platforms = boardData.counts
    .map((c: any) => {
        c.pinboard_id = boardData.pinboard_id;
        return c;
    });

    const tabs = platforms.map((d: any) => {
        return commonsPlatform.find((c: any) => c.shortkey === d.platform)?.key || d.platform;
    });
    tabs.unshift('all');

    const { title, description, counts, total: padsCount, contributors, creator }: { title: string, description: string, counts: any[], total: number, contributors: number, creator: any } = boardData;
    const { name: creatorName, isUNDP, country }: { name: string, isUNDP: boolean, country: string | undefined } = creator || {};

    // DETERMINE WHETHER THE BOARD IS ATTRIBUTABLE TO AN ACCELERATOR LAB
    let lab: string | undefined = undefined;
    // const isUNDP: boolean = email.includes('@undp.org');
    // const isLabber: boolean = position.includes('Head of');
    if (isUNDP) lab = `UNDP ${!country || country === 'NUL' ? 'Global' : country} Accelerator Lab`;

    // LOAD CONTENT
    // SET THE CORRECT PLATFORM(S)
    const data: any[] = await Promise.all(
        platforms
        .filter((d: any) => {
            // DETERMINE WHICH PLATFORM(S) TO QUERY
            if (platform === 'all') return true;
            else return commonsPlatform.find((c: any) => c.key === platform)?.shortkey === d.platform;
        }).map(async (d: any) => {
            if (d) {
                const platform: string = commonsPlatform.find((c: any) => c.shortkey === d.platform)?.key || d.platform;
                const platformPads: any[] = boardData.pads.filter((c: any) => c.platform === d.platform).map((c: any) => c.pad_id);
                const data: any[] = await platformApi(
                    { include_locations: true, pads: platformPads },
                    platform, 
                    'pads'
                );
                return data || [];
            } else return [];
        })
    );

    const vignettes = data?.flat().map(d => d.vignette);
    const vignette = vignettes[Math.floor(Math.random() * vignettes.length)];
    */

    return (
        <>
        <Hero 
            id={id} 
            platform={platform} 
            platforms={tabs} 
            searchParams={searchParams} 
            title={title}
            creator={creatorName}
            lab={lab}
            contributors={contributors}
            padsCount={padsCount}
        />

        <Infobar 
            description={[{ txt: description }]} 
            vignette={vignette} 
        />
        
        <section className='home-section lg:py-[80px]'>
            <div className='inner lg:mx-auto lg:px-[80px] lg:w-[1440px]'>
                {/* Display the section title and description */}
                <div className='section-header lg:mb-[100px]'>
                    <div className='c-left lg:col-span-5'>
                        <h2 className='slanted-bg yellow lg:mt-[5px]'>
                            <span>Full Board Overview</span>
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