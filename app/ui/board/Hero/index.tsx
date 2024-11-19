import clsx from 'clsx';
import platformApi from '@/app/lib/data/platform-api';
import metaData from '@/app/lib/data/meta-data';
import woldMap from '@/app/lib/data/world-map';

interface Props {
	title: string;
	creator: string;
	lab: any;
	includeMetadata: boolean;
	contributors?: number;
	padsCount?: number;
	locations?: any;
	tags?: any;
}

export default async function Hero({
	title,
	creator,
	lab,
	includeMetadata,
	contributors,
	padsCount,
	locations,
	tags,
}: Props) {
	return (
	  	<>
	  	<section className='relative home-section !border-t-0 grid-bg lg:pb-[60px]'>
			{/*<img className='w-[40%] absolute right-0 top-[90px]' alt="Branding illustration" src="/images/hands/see_top.svg" />*/}
			{/*<img className='w-[40%] absolute right-[5%] bottom-[-1px]' alt="Branding illustration" src="/images/hands/see_bottom.svg" />*/}
			<div className='inner w-[1440px] mx-auto'>
				<div className='section-content grid grid-cols-9 gap-[20px] lg:px-[80px] lg:pt-[80px]'>
					<div className='c-left lg:col-span-5 lg:mt-[80px] lg:mb-[20px]'>
						<h1 className='slanted-bg yellow'><span>{title}</span></h1>
						<p className='lead mb-[10px]'><b>Curated by {creator}</b></p>
						{lab === undefined ? null : (
							<a href={lab.link} target='_blank' rel='noopener noreferrer' className='underline'>{lab.name}</a>
						)}
						{includeMetadata && (
							<>
							<div className='flex flex-wrap flex-row gap-1.5 mb-[40px] mt-[40px]'>
								{tags.highlight.map((d: any, i: number) => (
										<button className='chip bg-posted-yellow' key={i}>{d.name}</button>
									)
								)}
								{tags.diff > 0 && (
								    <button className='chip bg-posted-yellow'>+{tags.diff}</button>
								)}
							</div>
							<div className='stats-cartouche lg:p-[20px] inline-block'>
								<span className='lg:mr-[40px]'><span className='number lg:mr-[5px]'>{padsCount}</span>Note{padsCount !== 1 ? 's' : null}</span>
								<span className='lg:mr-[40px]'><span className='number lg:mr-[5px]'>{locations.count}</span> Location{locations.count !== 1 ? 's' : null}</span>
								<span className='lg:mr-[40px]'><span className='number lg:mr-[5px]'>{tags.count}</span> Thematic area{tags.count !== 1 ? 's' : null}</span>
								<span><span className='number lg:mr-[5px]'>{contributors}</span> Contributor{contributors !== 1 ? 's' : null}</span>
							</div>
							</>
						)}
					</div>
					{includeMetadata && (
						<div className='c-right lg:col-span-4 lg:mt-[80px] lg:mb-[20px]'>
							<img src={locations.map} className='gradient-img absolute w-[calc(100%+200px)] min-h-[calc(100%+160px)] top-[-160px] right-[-80px] object-contain' />
						</div>
					)}
				</div>
			</div>
	  	</section>
	  	</>
	)
}