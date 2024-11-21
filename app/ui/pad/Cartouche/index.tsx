import clsx from 'clsx';
import { sdgLabels } from '@/app/lib/utils';

interface Props {
	locations: any[];
	sdgs: number[];
	className: string;
	datasources?: string[];
	methods?: string[];
	scaling?: string[];
	cost?: string[];
	mapFile?: string;
}

export default async function Cartouche({
	locations,
	sdgs,
	className,
	datasources,
	methods,
	scaling,
	cost,
	mapFile,
}: Props) {
	return (
		// <div className={clsx('cartouche border-[1px] border-solid self-start sticky top-[89px]', className)}>
		<div className={clsx('cartouche border-[1px] border-solid self-start', className)}>
			<div className='border-b-[1px] border-solid lg:border-b-0'>
				<img src={mapFile || ''} className='w-full mt-[-10%] lg:mt-[-20%] mb-[-30%]' />
			</div>
			<div className='flex flex-row flex-wrap gap-1.5 border-b-[1px] border-solid pb-[20px] pl-[20px] pr-[20px] pt-[20px] lg:pt-0 justify-center items-center'>
				{/*<p className='font-space-mono text-[14px] mb-0 basis-full'><b>Location(s)</b></p>*/}
				{locations.map((d: any, i: number) => (
					<button key={`chip-${i}`} className='chip bg-black text-white'>{d.country}</button>
				))}
			</div>
			{!methods?.length ? null : (
				<div className='border-b-[1px] border-r-[1px] lg:border-r-0 border-solid p-[20px]'>
					<p className='font-space-mono text-[14px] mb-[10px]'><b>Innovation methods</b></p>
					<div className='flex flex-row gap-1.5 flex-wrap justify-center lg:justify-start'>
						{methods.map((d: string, i: number) => {
							return (
								<button key={i} className='text-[14px] leading-[20px] chip border-[1px] border-solid bg-white !h-auto min-h-[30px] text-left normal-case py-[5px]'>{`${d.slice(0, 1).toUpperCase()}${d.substring(1)}`}</button>
							)
						})}
					</div>
				</div>
			)}
			{!datasources?.length ? null : (
				<div className='border-b-[1px] border-solid p-[20px]'>
					<p className='font-space-mono text-[14px] mb-[10px]'><b>Data sources</b></p>
					{/*<p className='text-[14px] leading-[20px] mb-[10px]'>{datasources.map((d: string) => `${d.slice(0, 1).toUpperCase()}${d.substring(1)}`).join(', ')}</p>*/}
					<div className='flex flex-row gap-1.5 flex-wrap justify-center lg:justify-start'>
						{datasources.map((d: string, i: number) => {
							return (
								<button key={i} className='text-[14px] leading-[20px] chip border-[1px] border-solid bg-white !h-auto min-h-[30px] text-left normal-case py-[5px]'>{`${d.slice(0, 1).toUpperCase()}${d.substring(1)}`}</button>
							)
						})}
					</div>
				</div>
			)}
			{!scaling?.length ? null : (
				<div className='border-b-[1px] border-r-[1px] lg:border-r-0 border-solid p-[20px]'>
					<p className='font-space-mono text-[14px] mb-[10px]'><b>Scaling</b></p>
					{/*<p className='text-[14px] leading-[20px] mb-[10px]'>{scaling.map((d: string) => `${d.slice(0, 1).toUpperCase()}${d.substring(1)}`).join(', ')}</p>*/}
					<div className='flex flex-row gap-1.5 flex-wrap justify-center lg:justify-start'>
						{scaling.map((d: string, i: number) => {
							return (
								<button key={i} className='text-[14px] leading-[20px] chip border-[1px] border-solid bg-white !h-auto min-h-[30px] text-left normal-case py-[5px]'>{`${d.slice(0, 1).toUpperCase()}${d.substring(1)}`}</button>
							)
						})}
					</div>
				</div>
			)}
			{!cost?.length ? null : (
				<div className='border-b-[1px] border-solid p-[20px]'>
					<p className='font-space-mono text-[14px] mb-[10px]'><b>Cost</b></p>
					{/*<p className='text-[14px] leading-[20px] mb-[10px]'>{cost.map((d: string) => `${d.slice(0, 1).toUpperCase()}${d.substring(1)}`).join(', ')}</p>*/}
					<div className='flex flex-row gap-1.5 flex-wrap justify-center lg:justify-start'>
						{cost.map((d: string, i: number) => {
							return (
								<button key={i} className='text-[14px] chip border-[1px] border-solid bg-white !h-auto min-h-[30px] text-left normal-case py-[5px'>{`${d.slice(0, 1).toUpperCase()}${d.substring(1)}`}</button>
							)
						})}
					</div>
				</div>
			)}
			<div className='sdgs grid grid-cols-2 lg:flex lg:flex-col p-[20px] col-span-2 lg:col-span-1'>
				<p className='font-space-mono col-span-2 text-[14px] mb-0'><b>SDG(s)</b></p>
				<p className='col-span-2 text-[14px] mb-[10px]'>Sustainable Development Goal(s)</p>
				{sdgs.map((d: any, i: number) => {
					const color = `sdg${d}`;
					return (
						<div key={`sdg-${i}`} className={clsx(color, 'grid col-span-2 md:col-span-1 lg:col-span-1 grid-cols-5 gap-[20px] items-center')}>
							<img key={`img-${i}`} src={`/images/sdgs/G${d}-ci.svg`} className='w-[50px]' />
							<span key={`id-${i}`} className='text-[42px] font-space-mono text-center'>{d}</span>
							<b className={clsx(color, 'border-l-[2px] border-solid pl-[10px] text-[14px] capitalize max-w-[100px] col-span-3')}>{sdgLabels[d - 1]}</b>
						</div>
					)
				})}
			</div>
		</div>
	)
}