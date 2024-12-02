'use client';
import clsx from 'clsx';
import metaData from '@/app/lib/data/meta-data';
import { useState, useEffect } from 'react';
import { Button } from '@/app/ui/components/Button';
import Link from 'next/link';
import FilterGroup from '@/app/ui/components/FilterGroup';

interface filtersProps {
	className?: string;
	searchParams: any;
	platform: string;
	tabs: string[];
}

export default function Filters({
	className,
	searchParams,
	platform,
	tabs
}: filtersProps) {
	const { page, search, ...filterParams } = searchParams;

	let filters: string[] = []
	if (platform === 'all') filters = ['countries']
	else filters = ['countries', 'thematic areas', 'sdgs', 'methods', 'datasources'];
	const space = 'published';
	
	const [hits, setHits] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	// load data here
	async function fetchData(): Promise<void> {
	    setLoading(true);

	    const checkPlatform = platform === tabs[0] ? tabs.slice(1) : platform;

	    // GET THE METADATA
	    const meta: any[] = await metaData({ 
	        searchParams, 
	        platforms: checkPlatform, 
	        filters
	    });
	    setHits(meta);
	    setLoading(false);
	}

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<>
		<section className={clsx('filters lg:pl-[-20px]', className)}>
			<div className='inner'>
				<div className={clsx('section-content grid gap-[20px]', filters.length < 3 ? `lg:grid-cols-${filters.length}` : 'lg:grid-cols-3')}>
					{filters.map((d, i) => {
						const placeholder = `Search for ${d === 'sdgs' ? 'SDGs' : d}`;
						let activeFilters: any[] = []
						const key: string = d.replace(/\s+/g, '_');
						if (searchParams[key]) {
							if (Array.isArray(searchParams[key])) activeFilters = searchParams[key];
							else activeFilters = [searchParams[key]];
						}
						
						if (loading) return('Loading')
						else {
							const list = hits?.find((h: any) => h.key === d)?.data?.filter((tag: any) => tag.name?.length) || [];
							
							return (
								<FilterGroup
									key={i}
									placeholder={placeholder}
									list={list}
									loading={loading}
									activeFilters={activeFilters}
								/>
							);
						}
					})}
				</div>
				<div className='section-footer text-right'>
					<Link href='?' className='font-bold font-space-mono underline underline-offset-2 mr-[20px]'>Clear All</Link>
					<Button type='submit' className='mt-[20px] md:mt-0 lg:mt-0'>Apply filters</Button>
				</div>
			</div>
		</section>
		</>
	);
}