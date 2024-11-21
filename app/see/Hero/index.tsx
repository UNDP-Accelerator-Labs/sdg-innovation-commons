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
  		<section className='relative home-section !border-t-0 grid-bg lg:pb-[80px]'>
  			<img className='md:w-[80%] lg:w-[40%] absolute right-0 md:top-[-30px] lg:top-[90px]' alt='Branding illustration' src='/images/hands/see_top.svg' />
  			<img className='md:w-[80%] lg:w-[40%] absolute md:right-0 lg:right-[5%] bottom-[-1px]' alt="Branding illustration" src='/images/hands/see_bottom.svg' />
		    
		    <div className='inner md:w-[744px] lg:w-[1440px] mx-auto'>
			    <div className='section-content grid grid-cols-9 gap-[20px] md:px-[40px] lg:px-[80px] pt-[80px]'>
			        <div className='c-left md:col-span-9 lg:col-span-5 md:mb-[80px] lg:mb-[40px] lg:mt-[80px]'>
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