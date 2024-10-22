"use client";
import { Button } from '@/app/ui/components/Button';
import Link from 'next/link';

export default function Hero() {
  return (
  	<>
  		<section className='relative lg:home-section !border-t-0 grid-bg'>
  			<img className='w-[40%] absolute left-0 bottom-[-15%]' alt="Branding illustration" src="/images/hero_learn_hand_01.png" />
		    <div className='section-content grid grid-cols-9 gap-[20px] lg:px-[80px] lg:py-[100px]'>
	        <div className='c-left lg:col-span-5 lg:mt-[80px] lg:mb-[60px]'>
            <h1 className='slanted-bg green'><span>What we See</span></h1>
            <p className='lead'>Explore our notes on solutions to SDG priorities and problems mapped around the world.</p>
	        </div>
	        <div className='c-right lg:col-span-4'></div>
	        <div className='lg:col-span-4'>
	        	{/* Search bar */}
	        	<form method='GET' className='h-[60px] flex flex-row mb-[30px] group relative'>
	        		{/* TO DO: FINISH FORM */}
	        		<input type='text' name='search' className='bg-white border-black !border-r-0 grow' id='main-search-bar' placeholder='What are you looking for?' />
	        		<Button type='submit' className='border-l-0 grow-0'>
	        			Search
	        		</Button>
	        	</form>
	        </div>
	        <div className='lg:col-span-2'>
	        	TO DO: Select
	        </div>
	        <div className='lg:col-span-2'>
	        	TO DO: Select
	        </div>
		    </div>
  		</section>
  	</>
  );
}