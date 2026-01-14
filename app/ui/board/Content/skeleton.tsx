import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';

import Hero from '../Hero/skeleton';
import Infobar from '../Infobar/skeleton';
import Search from '../Search';
import Tabs from '../Tabs';

import clsx from 'clsx';
import { shimmer } from '@/app/lib/helpers/utils';

export default async function Section() {
    return (
        <>
        <Hero />

        <Infobar />
        
        <section className={clsx('home-section lg:py-[80px]', shimmer)}>
            <div className='inner lg:mx-auto px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] lg:w-[1440px]'>
                {/* Display the section title and description */}
                <div className='section-header lg:mb-[100px]'>
                    <div className='c-left lg:col-span-5'>
                        <h2 className='w-[50%] h-10 bg-gray-600 rounded-md'></h2>
                    </div>
                    <div className='c-right lg:col-span-4 lg:mt-[20px]'>
                        <p className='w-[100%] h-5 mt-[15px] bg-gray-400 rounded-md'></p>
                    </div>
                </div>
                {/* SEARCH */}
                {/*<Search searchParams={searchParams} />*/}
                {/* Display tabs */}
                {/*<Tabs id={id} tabs={tabs} platform={platform} />*/}
                <div className='section-content'>
                    {/* Display Cards */}
                    <div className='grid gap-[20px] lg:grid-cols-3'>
                        <ImgCardsSkeleton />
                    </div>
                </div>
                <div className='pagination'>
                    <div className='w-full flex justify-center col-start-2'>
                        Loading pagination.
                    </div>
                </div>
            </div>
        </section>
        </>
    );
}