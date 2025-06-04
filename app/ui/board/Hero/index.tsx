import clsx from 'clsx';
import platformApi from '@/app/lib/data/platform-api';
import metaData from '@/app/lib/data/meta-data';
import woldMap from '@/app/lib/data/world-map';
import Link from 'next/link'

interface Props {
	title: string;
	creator: string;
	lab: any;
	includeMetadata: boolean;
	contributors?: number;
	padsCount?: number;
	locations?: any;
	tags?: any;
	contributor_uuid?: string;
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
	contributor_uuid,
}: Props) {
	return (
	  	<>
	  	<section className='relative home-section !border-t-0 grid-bg pt-[80px] lg:pt-0 lg:pb-[80px]'>
			<div className='inner w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px] mx-auto'>
				<div className='section-content grid grid-cols-9 gap-[20px] px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] pt-[80px]'>
					<div className='c-left col-span-9 lg:col-span-5 lg:mt-[80px] mb-[80px] lg:mb-[40px]'>
						<h1>
							<span className='slanted-bg yellow'>
								<span>{title}</span>
							</span>
						</h1>
						<Link href={`/profile/${contributor_uuid}`} className="hover:text-blue-800 underline font-bold">
						<p className='lead mb-[10px]'><b>Curated by {creator}</b></p>
						</Link>
						{lab === undefined ? null : (
							<a href={lab.link} target='_blank' rel='noopener noreferrer' className='underline'>{lab.name}</a>
						)}
						{includeMetadata && (
							<>
							<div className='lg:hidden c-right mb-[-150px] md:mb-[-320px]'>
								<img src={locations.map} className='gradient-img w-[100%] top-[-40px] md:top-[-120px] object-contain' />
							</div>
							<div className='flex flex-wrap flex-row gap-1.5 mb-[40px] mt-[40px]'>
								{tags.highlight.map((d: any, i: number) => (
										<button className='chip bg-posted-yellow' key={i}>{d.name}</button>
									)
								)}
								{tags.diff > 0 && (
								    <button className='chip bg-posted-yellow'>+{tags.diff}</button>
								)}
							</div>
							<div className='stats-cartouche flex flex-wrap justify-between p-[20px] md:inline-block lg:inline-block'>
								<span className='mr-[40px]'><span className='number mr-[5px]'>{padsCount}</span>Note{padsCount !== 1 ? 's' : null}</span>
								<span className='mr-[40px]'><span className='number mr-[5px]'>{locations.count}</span> Location{locations.count !== 1 ? 's' : null}</span>
								<span className='mr-[40px]'><span className='number mr-[5px]'>{tags.count}</span> Thematic area{tags.count !== 1 ? 's' : null}</span>
								<span><span className='number mr-[5px]'>{contributors}</span> Contributor{contributors !== 1 ? 's' : null}</span>
							</div>
							</>
						)}
					</div>
					{includeMetadata && (
						<div className='hidden lg:block c-right lg:col-span-4 lg:mt-[80px] lg:mb-[20px]'>
							<img src={locations.map} className='gradient-img absolute w-[calc(100%+200px)] min-h-[calc(100%+160px)] top-[-160px] right-[-80px] object-contain' />
						</div>
					)}
				</div>
			</div>
	  	</section>
	  	</>
	)
}