"use client";
import { Button } from '@/app/ui/components/Button';
import Content from '../Content';
import { useState } from 'react';

export default function Hero() {
	const [searchQuery, setSearchQuery] = useState('');
	const [updatedSearch, setUpdatedSearch] = useState('');

  return (
  	<>
  	<section className='relative home-section !border-t-0 grid-bg lg:pb-[60px]'>
	  	<img className='w-[40%] absolute right-[10%] top-[90px] z-[10] pointer-events-none' alt="Branding illustration" src="/images/hands/home_top.svg" />
	  	<img className='w-[40%] absolute right-0 bottom-[-10%] z-[0] pointer-events-none' alt="Branding illustration" src="/images/hands/home_bottom.svg" />
		<div className='inner w-[1440px] mx-auto'>
		    <div className='section-content grid grid-cols-9 gap-[20px] lg:px-[80px] lg:pt-[80px] lg:pb-[20px]'>
		        <div className='c-left lg:col-span-5 lg:mt-[80px] lg:mb-[60px]'>
	            	<h1>
	            		<span className='slanted-bg yellow'>
	            			<span>What we Learn</span>
	            		</span>
	            	</h1>
	            	<p className='lead'>Explore our curated collection of blogs and publications that foster collaboration, innovation, and continuous learning within the Accelerator Lab networks.</p>
		        </div>
		    </div>
		</div>
  	</section>
  	</>
  );
}