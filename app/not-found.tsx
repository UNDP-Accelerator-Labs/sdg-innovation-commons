"use client";
import Navbar from '@/app/ui/components/Navbar';
import { useState } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/ui/components/Button';
import Filters from '@/app/test/[platform]/Filters';

export default function NotFound() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterVisibility, setFilterVisibility] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const formValues: Record<string, any> = {};

        for (const [key, value] of formData.entries()) {
            if (formValues[key]) {
                formValues[key] = Array.isArray(formValues[key])
                    ? [...formValues[key], value]
                    : [formValues[key], value];
            } else {
                formValues[key] = value;
            }
        }

        if (formValues?.search || formValues?.countries?.length) {
            const searchQuery = formValues.search ? `search=${encodeURIComponent(formValues.search)}` : '';
            const countryQuery = formValues.countries
                ? Array.isArray(formValues.countries)
                    ? formValues.countries.map((country) => `countries=${encodeURIComponent(country)}`).join('&')
                    : `countries=${encodeURIComponent(formValues.countries)}`
                : '';

            const queryString = [searchQuery, countryQuery].filter(Boolean).join('&');

            router.replace(`/search/all?${queryString}`);
        }

    };


    const tabs = ['all', 'solution',];
    return (
        <>
            <Navbar />
            <div className="w-full  min-h-screen relative grid-bg overflow-hidden text-center text-base text-black ">
                {/* <img className="w-[545.8px] absolute !m-[0] top-[178.96px] left-[1062.6px] rounded-101xl h-[804.9px] object-contain z-[1]" alt="" src="images/Vector 37.svg" /> */}
                <div className="self-stretch  flex flex-row items-center justify-center pt-40 px-20 pb-[100px] relative gap-[23px] z-[2] text-43xl ">
                    <div className="flex-1 flex flex-col items-center justify-start relative gap-[23px] z-[1]">
                        <div className="flex flex-col items-center justify-start relative gap-[30px] z-[3]">
                            <div className='flex flex-col w-[160px]'>
                                <div className="self-stretch relative leading-[69px] z-[1] slanted-bg yellow "><span>404</span></div>
                            </div>
                            <b className="w-[632.7px] relative text-17xl leading-[46px] inline-block z-[2]">Something went wrong</b>
                            <div className="w-[632.7px] relative text-xl leading-[28px] font-medium inline-block z-[3]">Explore our curated collection of blogs and publications that foster collaboration, innovation, and continuous learning within the Accelerator Lab networks.</div>
                        </div>
                        <img className="w-[721px] absolute !m-[0] top-[-208px] left-[-170.5px] rounded-101xl h-[729px] z-[1]" alt="" src="/images/Vector 36.svg" />
                        <div className="w-[682px] flex flex-col items-start justify-start z-[3] text-left text-base">

                            <div className='inner lg:mx-auto lg:w-[1440px]'>
                                {/* Search bar */}
                                <form id='search-form' method='GET' onSubmit={handleSubmit} className='section-header relative mb-[30px]'>
                                    <div className='col-span-4 flex flex-row group items-stretch'>
                                        <input type='text' name='search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='bg-white border-black !border-r-0 grow' id='main-search-bar' placeholder='Looking for something?' />
                                        <Button type='submit' className='border-l-0 grow-0'>
                                            Search
                                        </Button>
                                    </div>

                                    <div className=''>
                                        <button type='button' className='w-full h-[60px] text-[18px] bg-white border-black border-[1px] flex justify-center items-center cursor-pointer' onClick={(e) => setFilterVisibility(!filterVisibility)}>
                                            <img src='/images/icon-filter.svg' alt='Filter icon' className='mr-[10px]' />
                                            {!filterVisibility ? (
                                                'Filters'
                                            ) : (
                                                'Close'
                                            )}
                                        </button>
                                    </div>
                                    <div className='col-span-12 w-[50%]'>
                                        <Filters
                                            className={clsx(filterVisibility ? '' : 'hidden')}
                                            searchParams={{ page: 1, search: searchQuery }}
                                            platform={'all'}
                                            tabs={tabs}
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}