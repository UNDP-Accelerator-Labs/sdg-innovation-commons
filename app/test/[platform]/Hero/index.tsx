"use client";
import { Button } from '@/app/ui/components/Button';
import { useState, useEffect } from 'react';
import Filters from '../Filters';
import clsx from 'clsx';

export default function Hero() {
  return (
  	<>
  		<section className='relative home-section !border-t-0 grid-bg lg:pb-[80px]'>
  			<img className='md:w-[80%] lg:w-[40%] absolute right-0 md:top-[30px] lg:top-[120px]' alt="Branding illustration" src="/images/hands/test_top.svg" />
  			<img className='md:w-[60%] lg:w-[30%] absolute md:right-[60%] lg:right-[10%] bottom-0' alt="Branding illustration" src="/images/hands/test_bottom.svg" />
		    <div className='inner md:w-[744px] lg:w-[1440px] mx-auto'>
			    <div className='section-content grid grid-cols-9 gap-[20px] md:px-[40px] lg:px-[80px] pt-[80px]'>
			        <div className='c-left md:col-span-9 lg:col-span-5 md:mb-[80px] lg:mb-[40px] lg:mt-[80px]'>
		            	<h1>
		            		<span className='slanted-bg yellow'>
		            			<span>What we Test</span>
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