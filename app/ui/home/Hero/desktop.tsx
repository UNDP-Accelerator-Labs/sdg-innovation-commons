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
	    <div className='inner w-[1440px] mx-auto'>
		    <div className='section-content grid grid-cols-9 gap-[20px] px-[80px] py-[100px]'>
		        <div className='c-left col-span-5 mt-[80px]'>
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