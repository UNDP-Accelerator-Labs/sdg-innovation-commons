"use client";
import { useState, useEffect } from 'react';

interface heroProps {
	description: string;
	vignette: string;
}

export default function Hero({
	description,
	vignette
}: heroProps) {
  	return (
	  	<>
	  	<section className='home-section relative lg:py-[80px] overflow-hidden'>
		    <div className='inner w-[1440px] mx-auto'>
			    <div className='section-content grid grid-cols-9 gap-[20px] lg:px-[80px]'>
			        <div className='c-left lg:col-span-5'>
		            	<p className='lead font-bold'>{description}</p>
			        </div>
			    </div>
			</div>
			<div className='gradient-img c-right absolute h-full right-0 top-0 lg:w-[35%]'>
				<img src={vignette.replace(/\/sm\//, '/')} className='min-h-full w-full object-contain' />
				{/*<img src={vignette.replace(/\/sm\//, '/')} className='absolute min-w-[150%] min-h-[calc(100%+160px)] top-[-80px] left-0 object-contain' />*/}
				{/*<div className='absolute h-full w-[50vw] py-[80px] top-[-80px] left-0 [background:linear-gradient(173.09deg,_rgba(1,_141,_242,_1),_rgba(237,_255,_164,_1))] opacity-[.5]'></div>*/}
			</div>
	  	</section>
	  	</>
  	);
}