import clsx from 'clsx';
import woldMap from '@/app/lib/data/world-map';
import { sdgLabels } from '@/app/lib/utils';

interface Props {
	locations: any[];
	sdgs: number[];
	className: string;
	platform: string;
	datasources: string[];
	methods: string[];
	scaling: string[];
	cost: string[];
}

export default async function Cartouche({
	locations,
	sdgs,
	className,
	platform,
	datasources,
	methods,
	scaling,
	cost,
}: Props) {
	const mapLayers = locations.map((d: any) => {
		return { ...d, ...{ type: 'point', color: '#d2f960', count: 1 } };
	});
	const { status, file: mapFile } = await woldMap({
		platform,
		projsize: 1440 / 3,
		base_color: '#000',
		layers: mapLayers,
	});

	return (
		// <div className={clsx('cartouche border-[1px] border-solid self-start sticky top-[89px]', className)}>
		<div className={clsx('cartouche border-[1px] border-solid self-start', className)}>
			<div>
				{status === 200 ? (
					<img src={mapFile} className='w-full mt-[-20%] mb-[-30%]' />
				) : (
					<p>Failed to generate map</p>
				)}
			</div>
			<div className='flex flex-row flex-wrap gap-1.5 border-b-[1px] border-solid pb-[20px] pl-[20px] pr-[20px] justify-center'>
				{/*<p className='font-space-mono text-[14px] mb-0 basis-full'><b>Location(s)</b></p>*/}
				{locations.map((d: any, i: number) => (
					<button key={`chip-${i}`} className='chip bg-black text-white'>{d.country}</button>
				))}
			</div>
			{!methods?.length ? null : (
				<div className='border-b-[1px] border-solid p-[20px]'>
					<p className='font-space-mono text-[14px] mb-0'><b>Innovation methods</b></p>
					{/*<p className='text-[14px] leading-[20px] mb-[10px]'>{methods.map((d: string) => `${d.slice(0, 1).toUpperCase()}${d.substring(1)}`).join(', ')}</p>*/}
					<div className='flex flex-row gap-1.5 flex-wrap'>
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
					<p className='font-space-mono text-[14px] mb-0'><b>Data sources</b></p>
					{/*<p className='text-[14px] leading-[20px] mb-[10px]'>{datasources.map((d: string) => `${d.slice(0, 1).toUpperCase()}${d.substring(1)}`).join(', ')}</p>*/}
					<div className='flex flex-row gap-1.5 flex-wrap'>
						{datasources.map((d: string, i: number) => {
							return (
								<button key={i} className='text-[14px] leading-[20px] chip border-[1px] border-solid bg-white !h-auto min-h-[30px] text-left normal-case py-[5px]'>{`${d.slice(0, 1).toUpperCase()}${d.substring(1)}`}</button>
							)
						})}
					</div>
				</div>
			)}
			{!scaling?.length ? null : (
				<div className='border-b-[1px] border-solid p-[20px]'>
					<p className='font-space-mono text-[14px] mb-0'><b>Scaling</b></p>
					{/*<p className='text-[14px] leading-[20px] mb-[10px]'>{scaling.map((d: string) => `${d.slice(0, 1).toUpperCase()}${d.substring(1)}`).join(', ')}</p>*/}
					<div className='flex flex-row gap-1.5 flex-wrap'>
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
					<p className='font-space-mono text-[14px] mb-0'><b>Cost</b></p>
					{/*<p className='text-[14px] leading-[20px] mb-[10px]'>{cost.map((d: string) => `${d.slice(0, 1).toUpperCase()}${d.substring(1)}`).join(', ')}</p>*/}
					<div className='flex flex-row gap-1.5 flex-wrap'>
						{cost.map((d: string, i: number) => {
							return (
								<button key={i} className='text-[14px] chip border-[1px] border-solid bg-white !h-auto min-h-[30px] text-left normal-case py-[5px'>{`${d.slice(0, 1).toUpperCase()}${d.substring(1)}`}</button>
							)
						})}
					</div>
				</div>
			)}
			<div className='sdgs flex flex-col p-[20px]'>
				<p className='font-space-mono text-[14px] mb-0'><b>SDG(s)</b></p>
				<p className='text-[14px] mb-[10px]'>Sustainable Development Goal(s)</p>
				{sdgs.map((d: any, i: number) => {
					const color = `sdg${d}`;
					return (
						<div key={`sdg-${i}`} className={clsx(color, 'grid lg:grid-cols-5 gap-[20px] items-center')}>
							<img key={`img-${i}`} src={`/images/sdgs/G${d}-ci.svg`} className='w-[50px]' />
							<span key={`id-${i}`} className='text-[42px] font-space-mono text-center'>{d}</span>
							<b className={clsx(color, 'border-l-[2px] border-solid pl-[10px] text-[14px] capitalize lg:max-w-[100px] col-span-3')}>{sdgLabels[d - 1]}</b>
						</div>
					)
				})}
			</div>
		</div>
	)
}