'use client';
import clsx from 'clsx';
import platformApi from '@/app/lib/data/platform-api';
import { useState, useEffect } from 'react';
import { Button } from '@/app/ui/components/Button';
import Link from 'next/link';
import FilterGroup from '@/app/ui/components/FilterGroup';

interface filtersProps {
	className?: string;
	searchParams: any;
}

export default function Filters({
	className,
	searchParams
}: filtersProps) {
	const { page, search, ...filterParams } = searchParams;

	const filters = ['countries', 'thematic areas', 'sdgs'];
	const platform = 'solution';
	const space = 'published';
	
	const [hits, setHits] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	// load data here
	async function fetchData(): Promise<void> {
	    setLoading(true);
	    
		const tags = await platformApi(
	        { ...searchParams, ...{ space, use_pads: true, type: ['thematic_areas', 'sdgs'] } },
	        platform,
	        'tags'
	    );
	    tags.forEach((d: any) => {
	    	d.checked = filterParams[d.type]?.includes(d.id) || filterParams[d.type] === d.id;
	    });
	    const thematic_areas = tags.filter((d: any) => d.type === 'thematic_areas');
	    const sdgs = tags.filter((d: any) => d.type === 'sdgs');

	    const countries = await platformApi(
	        // { ...searchParams, ...{ space } }, // THERE IS AN ISSUE WHEN PASSING PARAMS TO THE countries API
	        { ...{ space, use_pads: true } },
	        platform,
	        'countries'
	    );
	    countries.forEach((d: any) => {
	    	d.id = d.iso3;
	    	d.name = d.country;
	    	d.type = 'countries';
	    	d.checked = filterParams[d.type]?.includes(d.id) || filterParams[d.type] === d.id;
	    })

	    const data = [
	    	{ key: 'thematic areas', data: thematic_areas.sort((a: any, b: any) => a.name?.localeCompare(b.name)) }, 
	    	{ key: 'sdgs', data: sdgs.sort((a: any, b: any) => a.id - b.id) }, 
	    	{ key: 'countries', data: countries.sort((a: any, b: any) => a.name?.localeCompare(b.name)) }
	    ];
	    // if (!search) {

	    // } else {
	    //     console.log('look for search term', search)
	    //     data = await nlpApi(
	    //         { ... searchParams, ...{ limit: page_limit, doc_type: platform } },
	    //     );
	    // }
	    setHits(data);

	    setLoading(false);
	}

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<>
			<section className={clsx('filters lg:pl-[-20px]', className)}>
				<div className='inner'>
					<div className='section-content grid grid-cols-3 gap-[20px]'>
						{filters.map((d, i) => {
							const placeholder = `Search for ${d}`;
							
							if (loading) return('Loading')
							else {
								const list = hits?.find((h: any) => h.key === d)?.data?.filter((tag: any) => tag.name?.length) || [];

								return (
									<FilterGroup
										key={i}
										placeholder={placeholder}
										list={list}
										loading={loading}
									/>
								);
							}
						})}
					</div>
					<div className='section-footer text-right'>
						<Link href='?' className='font-bold font-space-mono underline underline-offset-2 lg:mr-[20px]'>Clear All</Link>
						<Button type='submit'>Apply filters</Button>
					</div>
				</div>
			</section>
		</>
	);
}