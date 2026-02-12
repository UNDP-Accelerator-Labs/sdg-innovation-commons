import platformApi from '@/app/lib/data/platform';
import metaData from '@/app/lib/data/meta-data';
import woldMap from '@/app/lib/data/world-map';

interface Props {
	boards?: number[] | number | null | undefined;
	// platforms?: string[]; // THIS IS tabs IN content
	searchParams?: any;
}

export default async function Data({
	boards,
	// platforms,
	searchParams,
}: Props) {
	// If no boards are specified, return empty metadata for external resources only collections
	if (!boards || 
	    (Array.isArray(boards) && boards.length === 0) ||
	    (typeof boards === 'number' && boards <= 0)) {
		return {
			tags: {
				count: 0,
				highlight: [],
				diff: 0,
			},
			locations: {
				values: [],
				count: 0,
				map: null,
			},
			sdgs: {
				highlight: [],
				count: 0,
			}
		};
	}

	// SET THE CORRECT PLATFORM(S)
	// if (platform === 'all') platforms = platforms.filter((d: string) => d !== 'all');
	// else platforms = platforms.filter((d: string) => d === platform);
	const platforms = ['solution', 'action plan', 'experiment']

	// GET THE METADATA
	const meta: any[] = await metaData({ 
		searchParams: { ...searchParams, ...{ pinboard: boards } }, 
		platforms: platforms,
		filters: ['thematic areas', 'sdgs', 'countries'],
	});

	const tags: any[] = meta.find((d: any) => d.key === 'thematic areas')?.data;
	const tagsCount: number = tags.length ?? 0;
	const topTags: any[] = tags.sort((a: any, b: any) => b.count - a.count).slice(0, 3);
	const remainingTagsCount: number = tagsCount - topTags.length;
	let sdgs: any[] = meta.find((d: any) => d.key === 'sdgs')?.data;

	sdgs = sdgs.filter((d: any) => d.count > 0);
	sdgs.forEach((d: any, i: number) => {
		d.key = i + 1;
	});

	const locations: any[] = meta.find((d: any) => d.key === 'countries')?.data || [];
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
	// GET THE MAP
	const { status, file: mapFile } = await woldMap({
		platform: 'experiment', // IT DOES NOT MATTER WHICH PLATFORM HERE
		projsize: 1440 * .75,
		base_color: '#000',
		layers: mapLayers,
	});

	return {
		tags: {
			count: tagsCount,
			highlight: topTags,
			diff: remainingTagsCount,
		},
		locations: {
			values: locations,
			count: mapLayers.length,
			map: mapFile,
		},
		sdgs: {
			//Highlight the SDGs that are in the middle of the distribution 
			// and have a count greater than 0
			highlight: (() => {
				const sortedSdgs = sdgs.sort((a: any, b: any) => a?.count - b?.count);
				const midIndex = Math.floor(sortedSdgs?.length / 2);
			  
				const median =
				  sortedSdgs.length % 2 === 0
					? (sortedSdgs[midIndex - 1]?.count + sortedSdgs[midIndex]?.count) / 2
					: sortedSdgs[midIndex]?.count;
			  
				const range = median * 0.5;
			  
				const relevantSdgs = sortedSdgs.filter(
				  (d: any) => d?.count >= median - range && d?.count <= median + range
				);
			  
				return relevantSdgs.map((d: any) => d.key);
			  })(),
			count: sdgs?.length,
		}
	}
}