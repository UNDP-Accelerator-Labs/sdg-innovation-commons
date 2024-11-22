"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/ui/components/Button';
import { ContentProps } from '../Content/index'

export default function ({ slug }: { slug: string }) {
	const [searchQuery, setSearchQuery] = useState(decodeURIComponent(slug));
	const router = useRouter();

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (searchQuery) {
			router.push(`/search/${encodeURIComponent(searchQuery)}`);
		}
	};
	return (
		<>
			<section className='relative lg:home-section !border-t-0 grid-bg'>
				{/*<img className='w-[40%] absolute left-0 bottom-[-15%]' alt="Branding illustration" src="/images/hero_learn_hand_01.png" />*/}
				<div className='section-content grid grid-cols-9 gap-[20px] px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] lg:py-[100px]'>
					<div className='c-left lg:col-span-5 lg:mt-[80px] lg:mb-[60px]'>
						<h1>
							<span className='slanted-bg yellow'>
								<span>Search Results for
								<br/>{searchQuery}</span>
							</span>
						</h1>
					</div>
					<div className='c-right lg:col-span-4'></div>
					<div className='lg:col-span-4'>
						{/* Search bar */}
						<form id='search-form' method='GET' onSubmit={handleSubmit} className='h-[60px] flex flex-row mb-[30px] group relative'>
							<input type='text' name='search' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='bg-white border-black !border-r-0 grow' id='main-search-bar' placeholder='Looking for something?' />
							<Button type='submit' className='border-l-0 grow-0'>
								Search
							</Button>
						</form>
					</div>
				</div>
			</section>
		</>
	);
}

// export default Hero