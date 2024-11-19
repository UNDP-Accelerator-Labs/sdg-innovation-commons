import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/app/ui/components/Button';
import renderComponents from '@/app/ui/components/MediaComponents';
import platformApi from '@/app/lib/data/platform-api';
import Hero from '../Hero';
import Cartouche from '../Cartouche';

interface Props {
    id: number;
    platform: string;
}

export default async function Section({
    id,
    platform,
}: Props) {
    const data = await platformApi(
        { 
            pads: id, 
            include_locations: true, 
            include_data: true, 
            pseudonymize: false, 
            include_source: true,
            include_metafields: true,
        },
        platform,
        'pads'
    );
    const [ datum ] = data;
    let { base, title, ownername, position, email, country, iso3, sections, vignette, locations, rawtags, tags, sdg, source, metadata } = datum;

    let lab: string | undefined = undefined;
    const isUNDP: boolean = email.includes('@undp.org');
    const isLabber: boolean = position.includes('Head of');
    if (isUNDP && isLabber) lab = `UNDP ${country} Accelerator Lab`;

    if (!tags?.length && source) {
        const { tags: sourceTags } = source;
        tags = sourceTags.filter((d: any) => d.type === 'thematic_areas').map((d: any) => d.name);
    }
    if (!sdg?.length && source) {
        const { tags: sourceTags } = source;
        sdg = sourceTags.filter((d: any) => d.type === 'sdgs').map((d: any) => d.key);
    }
    if (!locations?.length) {
        locations = [{ iso3, country }];
    }
    
    let datasources: string[] = rawtags?.filter((d: any) => d.type === 'datasources').map((d: any) => d.name);
    let methods: string[] = rawtags?.filter((d: any) => d.type === 'methods').map((d: any) => d.name);
    if (!datasources?.length && typeof source === 'object') {
        const { tags: sourceTags } = source;
        datasources = sourceTags?.filter((d: any) => d.type === 'datasources').map((d: any) => d.name); 
    }
    if (!methods?.length && typeof source === 'object') {
        const { tags: sourceTags } = source;
        methods = sourceTags?.filter((d: any) => d.type === 'methods').map((d: any) => d.name); 
    }

    let scaling: string[] = []
    let cost: string[] = []
    if (metadata?.length) {
        scaling = metadata.filter((d: any) => d.name === 'scaling').map((d: any) => d.value);
        cost = metadata.filter((d: any) => d.name === 'total_cost').map((d: any) => d.value);
    }


    let color: string = 'green';
    if (base === 'action plan') color = 'yellow';
    else if (base === 'experiment') color = 'orange';
   
    const imgBase = vignette?.split('/uploads/')[0];
    
    return (
        <>
        <Hero 
            id={id} 
            title={title} 
            vignette={vignette}
            owner={ownername}
            lab={lab}
            tags={tags}
            padtype={base}
            tagStyle={`bg-light-${color}`}
            tagStyleShade={`bg-light-${color}-shade`}
            color={color === 'yellow' ? 'light-yellow' : color}
        />
        <section className='home-section lg:pb-[80px] lg:pt-[120px]'>
            <div className='inner lg:mx-auto lg:px-[80px] lg:w-[1440px] grid lg:grid-cols-9 gap-[20px]'>
                <div className='section-content lg:col-span-5'>
                    {
                        sections.map((s: any, j: number) => {
                            const { title, items } = s;
                            return (
                                <>
                                {!title ? null : (
                                    <h3>{title}</h3>
                                )}
                                {items.map((item: any, i: number) => {
                                    const { type } = item;
                                    if (type === 'group') {
                                        const { items: groupItemsArr, instruction } = item;
                                        return groupItemsArr.map((itemsArr: any[], i: number) => {
                                            return (
                                                <div key={i} className='group border-[1px] border-solid mt-[-1px] box-border p-[20px] pb-0 mb-[40px]'>
                                                    {!instruction ? null : (
                                                        <p className='font-space-mono text-[14px] leading-[20px] mb-[20px]'><b>{instruction}</b></p>
                                                    )}
                                                    {
                                                        itemsArr.map((item: any, i: number) => {
                                                            return renderComponents(items, item, i, imgBase)
                                                        })
                                                    }
                                                </div>
                                            )
                                        })
                                    } else return renderComponents(items, item, i, imgBase);
                                })}
                                {j < sections.length - 1 && (
                                    <div className='divider block w-full h-0 border-t-[1px] border-solid mb-[40px]'></div>
                                )}
                                </>
                            )
                        })
                    }
                </div>
                <Cartouche 
                    locations={locations} 
                    sdgs={sdg} 
                    className='lg:col-start-7 lg:col-span-3'
                    platform={platform}
                    datasources={datasources}
                    methods={methods}
                    scaling={scaling}
                    cost={cost}
                />
                {(typeof source !== 'object') ? null : (
                    <div className='lg:col-span-5'>
                        <Button>
                            <Link href={source?.source_pad_id?.toString()}>Read more</Link>
                        </Button>
                    </div>
                )}
            </div>
        </section>
        </>
    ) 
}