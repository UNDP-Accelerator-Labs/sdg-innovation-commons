"use client";
import clsx from 'clsx';
import { Button } from '@/app/ui/components/Button';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
	className: string;
}

export default function Hero({
	className,
}: Props) {
	const [searchQuery, setSearchQuery] = useState('');
	const router = useRouter();

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (searchQuery) {
			router.push(`/search/all?search=${encodeURIComponent(searchQuery)}`);
		}
	};
  return (
  	<>
	<section className={clsx('relative home-section !border-t-0 grid-bg', className)}>
	    <img className='w-[40%] absolute right-[10%] top-[90px] z-[10]' alt='Branding illustration' src="/images/hands/home_top.svg" />
	    <img className='w-[40%] absolute right-0 bottom-[-10%] z-[10]' alt='Branding illustration' src="/images/hands/home_bottom.svg" />
	    <div className='inner px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] w-[375] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px] mx-auto'>
		    <div className='section-content grid grid-cols-9 gap-[20px] pt-[80px] pb-[100px]'>
		        <div className='c-left col-span-5 mt-[80px]'>
		            <h1>
		            	<span className='slanted-bg yellow'>
		            		<span>Discover what we are learning from the people we serve</span>
		            	</span>
		            </h1>
		            <p className='lead'>The SDG Commons is a resource hub with data, insights, solutions and next practices for the Sustainable Development Goals (SDGs) powered by the UNDP Accelerator Labs. Join us to bring these insights into action.</p>
		            {/* Search bar */}
		            <form method='GET' onSubmit={handleSubmit} className='h-[60px] flex flex-row mt-[40px] mb-[40px] group relative'>
		            	<input type='text' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} name='search' className='bg-white border-black !border-r-0 grow' id='main-search-bar' placeholder='What are you looking for?' />
		            	<Button type='submit' className='border-l-0 grow-0'>
		            		Search
		            	</Button>
		            </form>
		            <Link href={'/boards'} className='underline-offset-2 underline'>
		            	<b>Get SDG Inspired</b>
		            </Link>
		        </div>
		    </div>
		</div>
	</section>
  	</>
  );
}