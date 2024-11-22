"use client";
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { SectionProps } from '@/app/test/[platform]/Content';
import { Button } from '@/app/ui/components/Button';
import Filters from '@/app/test/[platform]/Filters';

export default function Hero({
	searchParams,
	platform,
	tabs
}: SectionProps) {
	const { page, search } = searchParams;
	const windowParams = new URLSearchParams(useSearchParams());
	windowParams.set('page', '1');

	const [searchQuery, setSearchQuery] = useState(search || '');
	const [filterVisibility, setFilterVisibility] = useState<boolean>(false);

	return (
		<>
			<section className='relative lg:home-section !border-t-0 grid-bg'>
				{/*<img className='w-[40%] absolute left-0 bottom-[-15%]' alt="Branding illustration" src="/images/hero_learn_hand_01.png" />*/}
				<div className='section-content grid grid-cols-9 gap-[20px] lg:px-[80px] lg:py-[100px]'>
					<div className='c-left lg:col-span-5 lg:mt-[80px] lg:mb-[60px]'>
						<h1 className='slanted-bg yellow'><span>Search Results for</span><br />{search}</h1>
					</div>
					<div className='c-right lg:col-span-4'></div>
					<div className='inner lg:mx-auto lg:w-[1440px]'>
						{/* Search bar */}
						<form id='search-form' method='GET' className='section-header relative mb-[30px]'>
							<div className='col-span-4 flex flex-row group items-stretch'>
								<input type='text' name='search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='bg-white border-black !border-r-0 grow' id='main-search-bar' placeholder='Looking for something?' />
								<Button type='submit' className='border-l-0 grow-0'>
									Search
								</Button>
							</div>

							<div className='lg:col-end-10'>
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
									tabs={['solution']}
								/>
							</div>
						</form>
					</div>
				</div>
			</section>
		</>
	);
}
