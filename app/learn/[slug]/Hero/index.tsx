"use client";
import { Button } from '@/app/ui/components/Button';
import Content from '../Content';
import { useState } from 'react';

export default function Hero() {
	const [searchQuery, setSearchQuery] = useState('');
	const [updatedSearch, setUpdatedSearch] = useState('');

  return (
  	<>
  	<section className='relative home-section !border-t-0 lg:pb-[60px]'>
	  	<img className='md:w-[80%] lg:w-[40%] absolute md:right-[5%] lg:right-[10%] md:top-0 top-[90px] z-0 pointer-events-none' alt='Branding illustration' src='/images/hands/home_top.svg' />
	  	<img className='md:w-[60%] lg:w-[40%] absolute right-0 md:bottom-[-20%] lg:bottom-[-10%] z-0 pointer-events-none' alt="Branding illustration" src="/images/hands/home_bottom.svg" />
		
		<div className='inner md:w-[744px] lg:w-[1440px] mx-auto'>
		    <div className='section-content grid grid-cols-9 gap-[20px] md:px-[40px] lg:px-[80px] pt-[80px]'>
		        <div className='c-left md:col-span-9 lg:col-span-5 md:mb-[80px] lg:mb-[40px] lg:mt-[80px]'>
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