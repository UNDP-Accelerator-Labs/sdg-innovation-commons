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
			router.push(`/search/${encodeURIComponent(searchQuery)}`);
		}
	};
  return (
  	<>
	<section className={clsx('relative home-section pb-[80px] !border-t-0 grid-bg', className)}>
	    	<div className='w-full pt-[140px] h-[50vh] relative'>
	    		<img className='absolute left-[30%] md:left-[5%]' alt='Branding illustration' src='/images/hands/home_top.svg' />
	    		<img className='absolute right-[-22%] md:right-[-80px] bottom-[-5%] md:bottom-[-15%]' alt='Branding illustration' src='/images/hands/home_bottom.svg' />
	    	</div>
	    <div className='inner w-[375] md:w-[744px] mx-auto'>
		    <div className='section-content px-[40px]'>
		        <div className='c-left mt-[40px]'>
		            <h1>
		            	<span className='slanted-bg yellow'>
		            		<span>SDG Commons<br/>
		            		powered by UNDP</span>
		            	</span>
		            </h1>
		            <p className='lead'>Building a 21st-century architecture for global public goods, requires sharing openly and scaling data, insights, solutions and next practices for the Sustainable Development Goals (SDGs). Join the Accelerator Labs on this journey as we open up our body of work, and come shape the SDG Commons with us.</p>
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