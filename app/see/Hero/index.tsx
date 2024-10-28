"use client";
import { Button } from '@/app/ui/components/Button';
import { useState, useEffect } from 'react';
import Filters from '../Filters';
import clsx from 'clsx';

interface heroProps {
	searchParams: any;
}

export default function Hero({
	searchParams
}: heroProps) {
	const [searchQuery, setSearchQuery] = useState<string>(searchParams.search || '');
	const [filterVisibility, setFilterVisibility] = useState<boolean>(false);

  	return (
  	<>
  		<section className='relative lg:home-section !border-t-0 grid-bg'>
  			<img className='w-[40%] absolute right-0 top-[90px]' alt="Branding illustration" src="/images/hands/see_top.svg" />
  			<img className='w-[40%] absolute right-[5%] bottom-[-1px]' alt="Branding illustration" src="/images/hands/see_bottom.svg" />
		    <div className='section-content grid grid-cols-9 gap-[20px] lg:px-[80px] lg:pt-[100px]'>
		        <div className='c-left lg:col-span-5 lg:mt-[80px] lg:mb-[60px]'>
	            	<h1 className='slanted-bg green'><span>What we See</span></h1>
	            	<p className='lead'>Explore our notes on solutions to SDG priorities and problems mapped around the world.</p>
		        </div>
		    </div>
		    <div className='section-content lg:px-[80px] lg:pb-[100px]'>
	        	{/* Search bar */}
	        	<form id='search-form' method='GET' className='grid grid-cols-9 gap-[20px] relative'>
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
			        	<Filters 
			        		className={clsx(filterVisibility ? '' : 'hidden')}
			        		searchParams={searchParams}
			        	/>
			        </div>

	        	</form>
		    </div>
  		</section>
  	</>
  );
}