import clsx from 'clsx';
import { sdgLabels } from '@/app/lib/helpers/utils';

interface Props {
	className: string;
}

export default async function Cartouche({ className }: Props) {
	return (
		<div className={clsx('cartouche border-[1px] border-solid self-start', className)}>
			<div>
				<div className='h-[200px] bg-gray-200'></div>
			</div>
			<div className='flex flex-row flex-wrap gap-1.5 border-y-[1px] border-solid p-[20px]'>
				<p className='font-space-mono text-[14px] mb-0 basis-full'><b>Location(s)</b></p>
				{(new Array(1)).fill(0).map((d: any, i: number) => (
					<button key={`chip-${i}`} className='chip bg-black text-white'>
						Country
					</button>
				))}
			</div>
			
			<div className='border-b-[1px] border-solid p-[20px]'>
				<p className='font-space-mono text-[14px] mb-0'><b>Tags</b></p>
				<div className='flex flex-row gap-1.5 flex-wrap'>
					{(new Array(3)).fill(0).map((d: string, i: number) => (
						<button key={i} className='text-[14px] leading-[20px] chip square bg-white !h-auto min-h-[30px] text-left normal-case py-[5px]'>
							Tag
						</button>
					))}
				</div>
			</div>
			<div className='sdgs flex flex-col p-[20px]'>
				<p className='font-space-mono text-[14px] mb-0'><b>SDG(s)</b></p>
				<p className='text-[14px] mb-[10px]'>Sustainable Development Goal(s)</p>
				{/*{sdgs.map((d: any, i: number) => {
					const color = `sdg${d}`;
					return (
						<div key={`sdg-${i}`} className={clsx(color, 'grid lg:grid-cols-5 gap-[20px] items-center')}>
							<img key={`img-${i}`} src={`/images/sdgs/G${d}-ci.svg`} className='w-[50px]' />
							<span key={`id-${i}`} className='text-[42px] font-space-mono text-center'>{d}</span>
							<b className={clsx(color, 'border-l-[2px] border-solid pl-[10px] text-[14px] capitalize lg:max-w-[100px] col-span-3')}>{sdgLabels[d - 1]}</b>
						</div>
					)
				})}*/}
			</div>
		</div>
	)
}