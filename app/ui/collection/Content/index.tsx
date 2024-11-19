import clsx from 'clsx';
import collectionData from '@/app/lib/data/collection';
import Card from '@/app/ui/components/Card/featured-card';
import { pagestats, Pagination } from '@/app/ui/components/Pagination';
import { Button } from '@/app/ui/components/Button';

import Hero from '@/app/ui/board/Hero';
import Infobar from '../Infobar';
// import Search from '../Search';
// import Tabs from '../Tabs';

export interface PageStatsResponse {
    total: number;
    pages: number;
}

interface SectionProps {
    id: string;
    searchParams: any;
}

export default async function Section({
    id,
    searchParams,
}: SectionProps) {
    const { page, search } = searchParams;

    // const [searchQuery, setSearchQuery] = useState<string>(searchParams.search || '');
    // const [filterVisibility, setFilterVisibility] = useState<boolean>(false);

    const { 
        title, 
        creatorName, 
        sections, 
        data, 
        pages,
    } = await collectionData({ id, searchParams });


    return (
        <>
        <Hero 
            title={title}
            creator={creatorName}
            // lab={lab}
            lab={{}}
            includeMetadata={false}
        />

        <Infobar 
            sections={sections} 
            // vignette={vignette} 
        />

        <section className='home-section lg:py-[80px]'>
            <div className='inner lg:mx-auto lg:px-[80px] lg:w-[1440px]'>
                {/* SEARCH */}
                <form id='search-form' method='GET' className='section-header relative lg:pb-[60px]'>
                    {/*<div className='col-span-4 flex flex-row group items-stretch'>
                        <input type='text' name='search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}  className='bg-white border-black !border-r-0 grow' id='main-search-bar' placeholder='What are you looking for?' />
                        <Button type='submit' className='border-l-0 grow-0'>
                            Search
                        </Button>
                    </div>
                    <div className='lg:col-end-10'>
                        <button type='button' className='w-full h-[60px] text-[18px] bg-white border-black border-[1px] flex justify-center items-center' onClick={(e) => setFilterVisibility(!filterVisibility)}>
                            <img src='/images/icon-filter.svg' alt='Filter icon' className='mr-[10px]' />
                            {!filterVisibility ? (
                                'Filters'
                            ) : (
                                'Close'
                            )}
                        </button>
                    </div>
                    <div className='col-span-9'>
                        <Filters 
                            className={clsx(filterVisibility ? '' : 'hidden')}
                            searchParams={searchParams}
                        />
                    </div>*/}
                </form>

                <div className='section-content'>
                    {/* Display Cards */}
                    <div className='grid gap-[20px] lg:grid-cols-3'>
                        {
                            data?.map((post: any) => (
                                <Card
                                    key={post?.pinboard_id}
                                    id={post?.pinboard_id}
                                    country={post?.country === 'NUL' || !post?.country ? 'Global' : post?.country}
                                    title={post?.title || ''}
                                    description={post?.description?.length > 200 ? `${post?.description.slice(0, 200)}…` : post?.description}
                                    source={post?.base || 'solution'}
                                    tagStyle="bg-light-green"
                                    tagStyleShade="bg-light-green-shade"
                                    href={`/boards/all/${post?.pinboard_id}`}
                                    backgroundImage={post?.vignette}
                                    date={post?.date}

                                    viewCount={post.total}
                                />
                            ))
                        }
                    </div>
                </div>
                {pages > 1 && (
                    <div className='pagination'>
                        <div className='w-full flex justify-center col-start-2'>
                            <Pagination
                                page={+page ?? 1}
                                totalPages={pages}
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
        </>
    );
}