import Link from 'next/link';
import { Button } from '@/app/ui/components/Button';
import platformApi from '@/app/lib/data/platform-api';
import Hero from '../Hero/skeleton';
import Cartouche from '../Cartouche/skeleton';
import Txt from '../MediaComponents/text';
import Embed from '../MediaComponents/embed';
import Img from '../MediaComponents/img';
import Checklist from '../MediaComponents/checklist';

import clsx from 'clsx';
import { shimmer } from '@/app/lib/utils';

import Attachment from '../MediaComponents/attachment';

interface Props {
    id: number;
}

export default function Section({
    id,
}: Props) {
    return (
        <>
        <Hero 
            tagStyleShade='bg-light-gray-shade'
        />
        <section className={clsx('home-section lg:pb-[80px] lg:pt-[120px]', shimmer)}>
            <div className='inner lg:mx-auto lg:px-[80px] lg:w-[1440px] grid lg:grid-cols-9 gap-[20px]'>
                <div className='section-content lg:col-span-5'>
                    <div className='w-[33%] h-5 mb-[20px] bg-gray-400 rounded-md'></div>
                    
                    <div className='w-[97%] h-4 mb-[10px] bg-gray-300 rounded-md'></div>
                    <div className='w-[95%] h-4 mb-[10px] bg-gray-300 rounded-md'></div>
                    <div className='w-[100%] h-4 mb-[10px] bg-gray-300 rounded-md'></div>
                    <div className='w-[98%] h-4 mb-[10px] bg-gray-300 rounded-md'></div>
                    <div className='w-[96%] h-4 mb-[10px] bg-gray-300 rounded-md'></div>
                    <div className='w-[94%] h-4 mb-[10px] bg-gray-300 rounded-md'></div>
                    <div className='w-[98%] h-4 mb-[10px] bg-gray-300 rounded-md'></div>
                    <div className='w-[97%] h-4 mb-[10px] bg-gray-300 rounded-md'></div>
                </div>
                <Cartouche className='lg:col-start-7 lg:col-span-3' />
            </div>
        </section>
        </>
    ) 
}

function renderContent (items: any[], item: any, i: number, imgBase: string) {
    const { type } = item;
    if (type === 'txt') return (<Txt key={i} item={item} />) 
    if (type === 'embed') return (<Embed key={i} item={item} />) 
    if (type === 'img') return (<Img key={i} item={item} base={imgBase} />) 
    if (type === 'mosaic') return (<Img key={i} item={item} base={imgBase} />) 
    if (['checklist', 'radiolist'].includes(type)) {
        let mb: string = '';
        const nextType: string | undefined = items[i + 1]?.type;
        if (nextType && !['checklist', 'radiolist'].includes(nextType)) mb = 'mb-[40px]';
        return (<Checklist key={i} item={item} className={mb} />)
    }

    if (type === 'attachment') return (<Attachment key={i} item={item} />)
    console.log(type)
}