"use client";
import { Button } from '@/app/ui/components/Button';
import { useState, useEffect } from 'react';
import Filters from '../Filters';
import clsx from 'clsx';

interface heroProps {
	apiParams: any;
	handleSearch: Function;
	platform: string;
}

export default function Hero({
	apiParams,
	handleSearch,
	platform
}: heroProps) {
	const [searchQuery, setSearchQuery] = useState(apiParams.search || '');
	const [filterVisibility, setFilterVisibility] = useState<boolean>(false);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();

		const data = new FormData(event.nativeEvent.target as HTMLFormElement);
		const searchdata: { [key: string]: any } = {};
		for (const [k, v] of data) {
			if (typeof v === 'number' || (typeof v === 'string' && v?.length)) {
				const key = k as keyof typeof searchdata;
				if (searchdata[key]) {
					if (!Array.isArray(searchdata[key])) {
						searchdata[key] = [searchdata[key]];
					}
					searchdata[key].push(v);
				} else searchdata[key] = v;
			}
		}

		if (Object.keys(searchdata)?.length) handleSearch(searchdata);
	};

  return (
  	<>
  		<section className='relative lg:home-section !border-t-0 grid-bg'>
  			<img className='w-[40%] absolute right-0 top-[120px]' alt="Branding illustration" src="/images/hands/test_top.svg" />
  			<img className='w-[30%] absolute right-[10%] bottom-0' alt="Branding illustration" src="/images/hands/test_bottom.svg" />
		    <div className='section-content grid grid-cols-9 gap-[20px] lg:px-[80px] lg:pt-[100px]'>
	        <div className='c-left lg:col-span-5 lg:mt-[80px] lg:mb-[60px]'>
            <h1 className='slanted-bg orange'><span>What we Test</span></h1>
            <p className='lead'>Discover wicked development challenges we are curious about and the experiments conducted to learn what works and what doesn't in sustainable development.</p>
	        </div>
	      </div>
  	    <div className='section-content lg:px-[80px] lg:pb-[100px]'>
        	{/* Search bar */}
        	<form method='GET' onSubmit={handleSubmit} className='grid grid-cols-9 gap-[20px] relative'>
        		<div className='col-span-4 flex flex-row group items-stretch'>
	        		<input type='text' name='search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}  className='bg-white border-black !border-r-0 grow' id='main-search-bar' placeholder='What are you looking for?' />
	        		<Button type='submit' className='border-l-0 grow-0'>
	        			Search
	        		</Button>
	        	</div>
	        	<div className='lg:col-end-10'>
	        		<button type='button' className='w-full h-[60px] text-[18px] bg-white border-black border-[1px] flex justify-center items-center' onClick={(e) => setFilterVisibility(!filterVisibility)}>
	        			<img src='images/icon-filter.svg' alt='Filter icon' className='mr-[10px]' />
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
		        		apiParams={apiParams}
		        		platform={platform}
		        	/>
		        </div>
        	</form>
  	    </div>
  		</section>
  	</>
  );
}