'use client';
import { useState } from 'react';
import { Button } from '@/app/ui/components/Button';

interface Props {
    searchParams: any;
}

export default function Section({
    searchParams,
}: Props) {
    const { search } = searchParams;
    const [filterVisibility, setFilterVisibility] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>(searchParams.search || '');

    return (
        <>
        <form id='search-form' method='GET' className='section-header relative lg:pb-[60px]'>
            <div className='col-span-4 flex flex-row group items-stretch'>
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
                {/*<Filters 
                    className={clsx(filterVisibility ? '' : 'hidden')}
                    searchParams={searchParams}
                />*/}
            </div>
        </form>
        </>
    )
}