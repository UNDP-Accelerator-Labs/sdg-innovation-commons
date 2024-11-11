"use client";
import { Button } from '@/app/ui/components/Button';
import { useState, useEffect } from 'react';
import Filters from '../Filters';
import clsx from 'clsx';

export default function Hero() {
  return (
  	<>
  		<section className='relative home-section !border-t-0 grid-bg lg:pb-[60px]'>
  			<img className='w-[40%] absolute right-0 top-[120px]' alt="Branding illustration" src="/images/hands/test_top.svg" />
  			<img className='w-[30%] absolute right-[10%] bottom-0' alt="Branding illustration" src="/images/hands/test_bottom.svg" />
		    <div className='inner w-[1440px] mx-auto'>
			    <div className='section-content grid grid-cols-9 gap-[20px] lg:px-[80px] lg:pt-[80px]'>
			        <div className='c-left lg:col-span-5 lg:mt-[80px] lg:mb-[60px]'>
		            	<h1 className='slanted-bg yellow'><span>What we Test</span></h1>
		            	<p className='lead'>Discover wicked development challenges we are curious about and the experiments conducted to learn what works and what doesn't in sustainable development.</p>
			        </div>
		    	</div>
	      	</div>
  		</section>
  	</>
  );
}