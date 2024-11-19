import clsx from 'clsx';
import platformApi from '@/app/lib/data/platform-api';
import metaData from '@/app/lib/data/meta-data';
import woldMap from '@/app/lib/data/world-map';

interface Props {
	id?: number;
	platform: string;
	platforms: string[]; // THIS IS tabs IN content
	searchParams: any;
	title: string;
	creator: string;
	lab: string;
	contributors: string[];
	padsCount: number;
}

export default async function Hero({
	id,
	platform,
	platforms,
	searchParams,
	title,
	creator,
	lab,
	contributors,
	padsCount,
}: Props) {
	// SET THE CORRECT PLATFORM(S)
	if (platform === 'all') platforms = platforms.filter((d: string) => d !== 'all');
	else platforms = platforms.filter((d: string) => d === platform);

	// GET THE METADATA
	const meta: any[] = await metaData({ 
		searchParams: { ...searchParams, ...{ pinboard: id } }, 
		platforms: platforms,
		filters: ['thematic areas']
	});
	const tagsCount = meta.find((d: any) => d.key === 'thematic areas')?.data.length ?? 0;
	const topTags = meta.find((d: any) => d.key === 'thematic areas')?.data.sort((a: any, b: any) => b.count - a.count).slice(0, 3);
	const remainingTagsCount = meta.find((d: any) => d.key === 'thematic areas')?.data.length - topTags.length;

	// GET THE LOCATION DATA
	const locations: any[] = await Promise.all(platforms.map(async (d: any) => {
		const data: any[] = await platformApi(
			{ ...searchParams, ...{ pinboard: id, space: 'pinned', use_pads: true } },
			d, 
			'countries'
		);
		return data;
	}));
	// COMPUTE THE MAP LAYERS
	const mapLayers: any[] = [];
	locations.flat().forEach((d: any) => {
		// NEED TO HANDLE SITUATIONS WHERE pads FROM ap MAY BE e.g. IN Guatemala AND pads FROM sm ARE ALSO IN Guatemala (NEED TO ADD THE COUNTS)
		const groupby: string = d?.iso3;
		if (!mapLayers.find((c: any) => c.iso3 === groupby)) {
			mapLayers.push({ 
				iso3: groupby, 
				count: d?.count, 
				lat: d?.location.lat, 
				lng: d?.location.lng,
				type: 'point',
				color: '#d2f960',
			});
		} else {
			mapLayers.find((c: any) => c.iso3 === groupby).count += d.count;
		}
	});
	// GET THE MAP (IT MAY NEED TO BE GENERATED THE FIRST TIME WHICH COULD TAKE A FEW SECONDS)
	const locationsCount = mapLayers.length;

	// GET THE MAP
	const { status, file: mapFile } = await woldMap({
		platform: 'solution', // IT DOES NOT MATTER WHICH PLATFORM HERE
		projsize: 1440 * .75,
		base_color: '#000',
		layers: mapLayers,
	});

	let labLink: string = '';
	if (lab) {
		if (lab.includes('Global')) {
			labLink = 'https://www.undp.org/acceleratorlabs/';
		} else labLink = `https://www.undp.org/acceleratorlabs/${lab?.toLowerCase().replace(/\s/g, '-')}`; // FORMAT: undp-algeria-accelerator-lab
	}

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
							<a href={labLink} target='_blank' rel='noopener noreferrer' className='underline'>{lab}</a>
						)}
						<div className='flex flex-wrap flex-row gap-1.5 mb-[40px] mt-[40px]'>
							{topTags.map((d: any, i: number) => (
									<button className='chip bg-posted-yellow' key={i}>{d.name}</button>
								)
							)}
							{remainingTagsCount > 0 && (
							    <button className='chip bg-posted-yellow'>+{remainingTagsCount}</button>
							)}
						</div>
						<div className='stats-cartouche lg:p-[20px] inline-block'>
							<span className='lg:mr-[40px]'><span className='number lg:mr-[5px]'>{padsCount}</span>Note{padsCount !== 1 ? 's' : null}</span>
							<span className='lg:mr-[40px]'><span className='number lg:mr-[5px]'>{locationsCount}</span> Location{locationsCount !== 1 ? 's' : null}</span>
							<span className='lg:mr-[40px]'><span className='number lg:mr-[5px]'>{tagsCount}</span> Thematic area{tagsCount !== 1 ? 's' : null}</span>
							<span><span className='number lg:mr-[5px]'>{contributors}</span> Contributor{contributors !== 1 ? 's' : null}</span>
						</div>
					</div>
					<div className='c-right lg:col-span-4 lg:mt-[80px] lg:mb-[20px]'>
							<img src={mapFile} className='gradient-img absolute w-[calc(100%+200px)] min-h-[calc(100%+160px)] top-[-160px] right-[-80px] object-contain' />
					</div>
				</div>
			</div>
	  	</section>
	  	</>
	)
}