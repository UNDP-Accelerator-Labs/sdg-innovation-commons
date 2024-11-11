"use client";
import { useState, useEffect } from 'react';

interface heroProps {
	description: string;
}

export default function Hero({
	description
}: heroProps) {
  	return (
  	<>
  	<section className='home-section lg:py-[80px] overflow-hidden'>
	    <div className='inner w-[1440px] mx-auto'>
		    <div className='section-content grid grid-cols-9 gap-[20px] lg:px-[80px]'>
		        <div className='c-left lg:col-span-4'>
	            	<p className='lead font-bold'>{description}</p>
		        </div>
		        <div className='c-right lg:col-span-4 lg:col-start-6'>
		        	<img src='/images/Rectangle 15.png' className='gradient-img absolute min-w-[150%] min-h-[calc(100%+160px)] top-[-80px] left-0 object-contain' />
		        	<div className='absolute h-full w-[50vw] py-[80px] top-[-80px] left-0 [background:linear-gradient(173.09deg,_rgba(1,_141,_242,_1),_rgba(237,_255,_164,_1))] opacity-[.5]'></div>
		        </div>
		    </div>
		</div>
  	</section>
  	</>
  );
}