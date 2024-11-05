"use client";
import { useState, useEffect } from 'react';

interface heroProps {
	title: string;
	counts: any[];
	total: number;
	contributors: number;
	creatorName: string;
}

export default function Hero({
	title,
	counts,
	total,
	contributors,
	creatorName,
}: heroProps) {
  	return (
  	<>
  	<section className='relative home-section !border-t-0 grid-bg lg:pb-[60px]'>
		{/*<img className='w-[40%] absolute right-0 top-[90px]' alt="Branding illustration" src="/images/hands/see_top.svg" />*/}
		{/*<img className='w-[40%] absolute right-[5%] bottom-[-1px]' alt="Branding illustration" src="/images/hands/see_bottom.svg" />*/}
	    <div className='inner w-[1440px] mx-auto'>
		    <div className='section-content grid grid-cols-9 gap-[20px] lg:px-[80px] lg:pt-[80px]'>
		        <div className='c-left lg:col-span-5 lg:mt-[80px] lg:mb-[20px]'>
	            	<h1 className='slanted-bg yellow'><span>{title}</span></h1>
	            	<p className='lead'>Curated by {creatorName}</p>

	            	<div className='stats-cartouche lg:p-[20px] flex justify-between'>
	            		<span><span className='number lg:mr-[5px]'>{total}</span> Notes</span>
	            		<span><span className='number lg:mr-[5px]'>{contributors}</span> Contributor</span>
	            	</div>
		        </div>
		    </div>
		</div>
  	</section>
  	</>
  );
}