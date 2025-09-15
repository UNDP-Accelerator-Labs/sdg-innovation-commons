'use client';
import clsx from 'clsx';
import metaData from '@/app/lib/data/meta-data';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import FilterGroup from '@/app/ui/components/FilterGroup';

interface filtersProps {
    className?: string;
    searchParams: any;
    platform: string;
    tabs: string[];
    useNlp?: boolean;
}

export default function Filters({
    className,
    searchParams,
    platform,
    tabs,
    useNlp = false,
}: filtersProps) {
    const { page, search, ...filterParams } = searchParams;

    // base filter list for this page
    let _filters: string[] = [];
    if (platform === 'all') _filters = ['countries'];
    else _filters = ['countries', 'regions', 'thematic areas', 'sdgs', 'methods', 'datasources'];

    const [filters, setFilters] = useState<string[]>(_filters);
    const [hits, setHits] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const contentTypeOptions = ['solution', 'experiment', 'action plan', 'blog', 'publications', 'DRA', 'AILA'] as const;
    type TabId = 'all' | 'what-we-see' | 'what-we-test' | 'what-we-learn';
    type TabDefinition = { label: string; docTypes: string[] };
    const tabDefinitions: Record<TabId, TabDefinition> = {
        'all': { label: 'All', docTypes: [...contentTypeOptions] },
        'what-we-see': { label: 'What we see', docTypes: ['solution'] },
        'what-we-test': { label: 'What we test', docTypes: ['experiment', 'action plan'] },
        'what-we-learn': { label: 'What we learn', docTypes: ['blog', 'publications', 'DRA', 'AILA'] },
    };

    // load data here
    async function fetchData(): Promise<void> {
        setLoading(true);
        const checkPlatform = tabs.includes('what-we-see') ? 'solution' : platform === tabs[0] ? tabs.slice(1) : platform;

        // GET THE METADATA
        let meta: any[] = await metaData({
            searchParams,
            platforms: checkPlatform,
            filters: _filters,
            useNlp,
        });

        // If the current page uses top-level tabs (passed in props),
        // expose a doc_type filter group (page-local) so users can filter by content type.
        // We add the group under the key 'doc_type' (so URL uses ?doc_type=...)
        const hasTabControls =
            tabs.includes('what-we-see') || tabs.includes('what-we-test') || tabs.includes('what-we-learn');

        if (hasTabControls) {
            const activeTab = (searchParams?.tab as TabId) || 'all';
            const docTypes = tabDefinitions[activeTab]?.docTypes || tabDefinitions['all'].docTypes;

            // Build the list shape expected by FilterGroup/meta pipeline
            meta.push({
                key: 'doc_type',
                data: docTypes.map((d: string) => ({ name: d, count: 0, id: d, type: 'doc_type' })),
            });

            // add doc_type to available filters for this page (non-destructive to other pages)
            setFilters([..._filters, 'doc_type']);
        } else {
            // ensure we don't accidentally persist doc_type in filters when not needed
            setFilters(_filters);
        }

        setHits(meta);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(searchParams)]);

    return (
        <>
            <section className={clsx('filters lg:pl-[-20px]', className)}>
                <div className='inner'>
                    <div className={clsx('section-content grid gap-[20px]', filters.length < 3 ? `lg:grid-cols-${filters.length}` : 'lg:grid-cols-3')}>
                        {loading ? (
                            <div className="col-span-full text-center">Loading</div>
                        ) : (
                            filters.map((d, i) => {
                                const placeholder = `Search for ${d === 'sdgs' ? 'SDGs' : d}`;
                                let activeFilters: any[] = [];
                                const key: string = d.replace(/\s+/g, '_');

                                if (searchParams[key]) {
                                    if (Array.isArray(searchParams[key])) activeFilters = searchParams[key];
                                    else activeFilters = [searchParams[key]];
                                }

                                const list = hits?.find((h: any) => h.key === d || h.key === key)?.data?.filter((tag: any) => tag.name?.length) || [];

                                return (
                                    <FilterGroup
                                        key={i}
                                        placeholder={placeholder}
                                        list={list}
                                        loading={loading}
                                        activeFilters={activeFilters}
                                        searchParams={searchParams}
                                    />
                                );
                            })
                        )}
                    </div>
                    <div className='section-footer text-right'>
                        <Link href='?' className='font-bold font-space-mono underline underline-offset-2 mr-[20px]'>Clear All</Link>
                        {/* <Button type='submit' className='mt-[20px] md:mt-0 lg:mt-0'>Apply filters</Button> */}
                    </div>
                </div>
            </section>
        </>
    );
}