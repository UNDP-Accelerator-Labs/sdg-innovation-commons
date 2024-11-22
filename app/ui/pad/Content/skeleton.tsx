import Hero from '../Hero/skeleton';
import Cartouche from '../Cartouche/skeleton';
import clsx from 'clsx';
import { shimmer } from '@/app/lib/utils';

export default function Section() {
    return (
        <>
        <Hero />
        <section className={clsx('home-section lg:pb-[80px] lg:pt-[120px]', shimmer)}>
            <div className='inner lg:mx-auto px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] lg:w-[1440px] grid lg:grid-cols-9 gap-[20px]'>
                <div className='section-content lg:col-span-5'>
                    <div className='w-[33%] h-5 mb-[20px] bg-gray-400 rounded-md'></div>
                    
                    <div className='w-[97%] h-4 mb-[10px] bg-gray-300 rounded-md'></div>
                    <div className='w-[95%] h-4 mb-[10px] bg-gray-300 rounded-md'></div>
                    <div className='w-[100%] h-4 mb-[10px] bg-gray-300 rounded-md'></div>
                    <div className='w-[98%] h-4 mb-[10px] bg-gray-300 rounded-md'></div>
                    <div className='w-[96%] h-4 mb-[10px] bg-gray-300 rounded-md'></div>
                    <div className='w-[94%] h-4 mb-[10px] bg-gray-300 rounded-md'></div>
                    <div className='w-[98%] h-4 mb-[10px] bg-gray-300 rounded-md'></div>
                    <div className='w-[97%] h-4 mb-[10px] bg-gray-300 rounded-md'></div>
                </div>
                <Cartouche className='lg:col-start-7 lg:col-span-3' />
            </div>
        </section>
        </>
    ) 
}