"use client";
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { MenuItem } from '@headlessui/react'
import clsx from 'clsx';
import { Button } from '@/app/ui/components/Button';
import Filters from '@/app/test/[platform]/Filters';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import Notification from '@/app/ui/components/Notification';
import AddToBoard from '@/app/ui/components/Modal/add-to-board';
import DropDown from '@/app/ui/components/DropDown';

interface Props {
	searchParams: any;
};

export default function Hero({
	searchParams,
}: Props) {
	const { page, search } = searchParams;
	const windowParams = new URLSearchParams(useSearchParams());
	windowParams.set('page', '1');

	return (
		<>
		<section className='relative lg:home-section !border-t-0'>
			<div className='inner mx-auto px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px]'>
				<div className='section-content grid grid-cols-9 gap-[20px] lg:pt-[80px]'>
					<div className='c-left col-span-9 lg:col-span-5 mb-[80px] lg:mb-[40px] lg:mt-[80px]'>
						<h1><span className='slanted-bg yellow'>
							<span>Community Curated Boards</span>
						</span></h1>
						<p className='lead'>Browse through community curated boards of what we see, what we test, and what we learn about specific frontier sustainable development challenges.</p>
					</div>
				</div>
			</div>
		</section>
		<section className='home-section !border-t-0 py-0'>
			<div className='inner mx-auto px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px]'>
				{/* Search bar */}
				<form id='search-form' method='GET' className='section-header relative pb-[40px] lg:pb-[80px]'>
					{/* SEARCH BAR */}
					{/*<div className='col-span-9 lg:col-span-4 flex flex-row group items-stretch'>
						<input type='text' name='search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='bg-white border-black !border-r-0 grow' id='main-search-bar' placeholder='Looking for something?' />
						<Button type='submit' className='border-l-0 grow-0'>
							Search
						</Button>
					</div>*/}
					{/* FILTER DROP DOWN */}
					{/*<div className='col-span-5 col-start-5 md:col-span-2 md:col-start-8 lg:col-end-10 lg:col-span-1 flex flex-row gap-x-5'>
						<button type='button' className='w-full h-[60px] text-[18px] bg-white border-black border-[1px] flex justify-center items-center cursor-pointer' onClick={(e) => setFilterVisibility(!filterVisibility)}>
							<img src='/images/icon-filter.svg' alt='Filter icon' className='mr-[10px]' />
							{!filterVisibility ? (
								'Filters'
							) : (
								'Close'
							)}
						</button>
					</div>
					<div className='col-span-9'>
						<Filters
							className={clsx(filterVisibility ? '' : 'hidden')}
							searchParams={searchParams}
							platform={'all'}
							tabs={tabs}
						/>
					</div>*/}
				</form>
			</div>
		</section>
		</>
	);
}
