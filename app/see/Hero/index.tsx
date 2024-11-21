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
  		<section className='relative home-section !border-t-0 grid-bg lg:pb-[60px]'>
  			<img className='w-[40%] absolute right-0 top-[90px]' alt="Branding illustration" src="/images/hands/see_top.svg" />
  			<img className='w-[40%] absolute right-[5%] bottom-[-1px]' alt="Branding illustration" src="/images/hands/see_bottom.svg" />
		    <div className='inner w-[1440px] mx-auto'>
			    <div className='section-content grid grid-cols-9 gap-[20px] lg:px-[80px] lg:pt-[80px]'>
			        <div className='c-left lg:col-span-5 lg:mt-[80px] lg:mb-[60px]'>
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