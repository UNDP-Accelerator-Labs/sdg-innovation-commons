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

	const filters = ['countries', 'thematic areas', 'sdgs'];
	const space = 'published';
	
	const [hits, setHits] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	// load data here
	async function fetchData(): Promise<void> {
	    setLoading(true);

	    const checkPlatform = platform === tabs[0] ? tabs.slice(1) : platform;

	    let tags: any[];
	    let countries: any[];
	    
	    if (Array.isArray(checkPlatform)) {
	    	tags = await Promise.all(checkPlatform.map((d: any) => {
	    		return platformApi(
    		        { ...searchParams, ...{ space, use_pads: true } },
    		        d,
    		        'tags'
    		    );
	    	}));
	    	tags = tags.flat()
	    	.filter((value: any, index: number, self: any) => {
	    	    return self.findIndex((d: any) => d.id === value.id && d.type === value.type) === index;
	    	});

	    	countries = await Promise.all(checkPlatform.map((d: any) => {
	    		return platformApi(
			        { ...{ space, use_pads: true } },
			        d,
			        'countries'
			    );
	    	}));
	    	countries = countries.flat()
	    	.filter((value: any, index: number, self: any) => {
	    	    return self.findIndex((d: any) => d.iso3 === value.iso3) === index;
	    	});
	    } else {
			tags = await platformApi(
		        { ...searchParams, ...{ space, use_pads: true } },
		        checkPlatform,
		        'tags'
		    );
		    countries = await platformApi(
		        // { ...searchParams, ...{ space } }, // THERE IS AN ISSUE WHEN PASSING PARAMS TO THE countries API
		        { ...{ space, use_pads: true } },
		        platform,
		        'countries'
		    );
		}
	    
	    tags.forEach((d: any) => {
		    if (Array.isArray(filterParams[d.type])) d.checked = filterParams[d.type]?.includes(d.id?.toString());
		    else d.checked = filterParams[d.type] === d.id?.toString();
	    });
	    countries.forEach((d: any) => {
	    	d.id = d.iso3;
	    	d.name = d.country;
	    	d.type = 'countries';
	    	d.checked = filterParams[d.type]?.includes(d.id) || filterParams[d.type] === d.id;
	    });
	    

	    const data = [
	    	{ key: 'tags', data: tags.sort((a, b) => a.name.localeCompare(b.name)) }, 
	    	{ key: 'countries', data: countries.sort((a, b) => a.name.localeCompare(b.name)) }
	    ];
	    // if (!search) {

	    // } else {
	    //     console.log('look for search term', search)
	    //     data = await nlpApi(
	    //         { ... searchParams, ...{ limit: page_limit, doc_type: platform } },
	    //         platform
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
								let list = [];
								if (d === 'countries') {
									list = hits?.find((h: any) => h.key === d)?.data?.filter((tag: any) => tag.name?.length) || [];
								} else {
									list = hits?.find((h: any) => h.key === 'tags')?.data?.filter((tag: any) => tag.name?.length) || [];
								}

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