"use client";
import { useState, useEffect } from 'react';

interface heroProps {
	searchParams: any;
}

export default function Hero({
	searchParams
}: heroProps) {
  	return (
  	<>
  		<section className='relative home-section !border-t-0 grid-bg pt-[120px] lg:pt-0 lg:pb-[80px]'>
  			<img className='w-[80%] lg:w-[40%] absolute right-0 top-[140px] md:top-[-30px] lg:top-[90px]' alt='Branding illustration' src='/images/hands/see_top.svg' />
  			<img className='w-[80%] lg:w-[40%] absolute right-[15%] md:right-0 lg:right-[5%] bottom-[-1px]' alt="Branding illustration" src='/images/hands/see_bottom.svg' />
		    
		    <div className='inner w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px] mx-auto'>
			    <div className='section-content grid grid-cols-9 gap-[20px] px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] pt-[80px]'>
			        <div className='c-left col-span-9 lg:col-span-5 mb-[80px] lg:mb-[40px] lg:mt-[80px]'>
		            	<h1>
		            		<span className='slanted-bg yellow'>
		            			<span>What we See</span>
		            		</span>
		            	</h1>
		            	<p className='lead'>Explore our notes on solutions to SDG priorities and problems mapped around the world.</p>
			        </div>
			    </div>
			</div>
  		</section>
  	</>
  );
}