"use client";
import { Button } from '@/app/ui/components/Button';
import Content from '../Content';
import { useState } from 'react';

export default function Hero() {
	const [searchQuery, setSearchQuery] = useState('');
	const [updatedSearch, setUpdatedSearch] = useState('');

  return (
  	<>
  	<section className='relative home-section !border-t-0 pt-[120px] lg:pt-0 lg:pb-[80px]'>
	  	<img className='w-[80%] lg:w-[40%] absolute right-[5%] lg:right-[10%] top-[140px] lg:top-[90px] z-0 pointer-events-none' alt='Branding illustration' src='/images/hands/home_top.svg' />
	  	<img className='w-[60%] lg:w-[40%] absolute right-0 bottom-0 md:bottom-[-20%] lg:bottom-[-10%] z-0 pointer-events-none' alt="Branding illustration" src="/images/hands/home_bottom.svg" />
		
		<div className='inner w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px] mx-auto'>
		    <div className='section-content grid grid-cols-9 gap-[20px] px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] pt-[80px]'>
		        <div className='c-left col-span-9 lg:col-span-5 mb-[80px] lg:mb-[40px] lg:mt-[80px]'>
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