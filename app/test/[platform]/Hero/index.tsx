"use client";
import { Button } from '@/app/ui/components/Button';
import { useState, useEffect } from 'react';
import Filters from '../Filters';
import clsx from 'clsx';

export default function Hero() {
  return (
  	<>
  		<section className='relative home-section !border-t-0 grid-bg pt-[120px] lg:pt-0 lg:pb-[80px]'>
  			<img className='w-[80%] lg:w-[40%] absolute right-0 top-[170px] lg:top-[120px]' alt="Branding illustration" src="/images/hands/test_top.svg" />
  			<img className='w-[60%] lg:w-[30%] absolute right-[30%] md:right-[60%] lg:right-[10%] bottom-0' alt="Branding illustration" src="/images/hands/test_bottom.svg" />
		    <div className='inner w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px] mx-auto'>
			    <div className='section-content grid grid-cols-9 gap-[20px] px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] pt-[80px]'>
			        <div className='c-left col-span-9 lg:col-span-5 mb-[80px] lg:mb-[40px] lg:mt-[80px]'>
		            	<h1>
		            		<span className='slanted-bg yellow'>
		            			<span>What We Test</span>
		            		</span>
		            	</h1>
		            	<p className='lead'>Discover wicked development challenges we are curious about and the experiments conducted to learn what works and what doesn't in sustainable development.</p>
			        </div>
		    	</div>
	      </div>
  		</section>
  	</>
  );
}