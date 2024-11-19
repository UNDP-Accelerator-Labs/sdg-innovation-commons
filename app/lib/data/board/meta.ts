import platformApi from '@/app/lib/data/platform-api';
import metaData from '@/app/lib/data/meta-data';
import woldMap from '@/app/lib/data/world-map';

interface Props {
	id?: number;
	platform: string;
	platforms: string[]; // THIS IS tabs IN content
	searchParams: any;
}

export default async function Data({
	id,
	platform,
	platforms,
	searchParams,
}: Props) {
	// SET THE CORRECT PLATFORM(S)
	if (platform === 'all') platforms = platforms.filter((d: string) => d !== 'all');
	else platforms = platforms.filter((d: string) => d === platform);

	// GET THE METADATA
	const meta: any[] = await metaData({ 
		searchParams: { ...searchParams, ...{ pinboard: id } }, 
		platforms: platforms,
		filters: ['thematic areas', 'countries'],
	});
	const tagsCount: number = meta.find((d: any) => d.key === 'thematic areas')?.data.length ?? 0;
	const topTags: any[] = meta.find((d: any) => d.key === 'thematic areas')?.data.sort((a: any, b: any) => b.count - a.count).slice(0, 3);
	const remainingTagsCount: number = tagsCount - topTags.length;

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
	const locationsCount = mapLayers.length;

	// GET THE MAP
	const { status, file: mapFile } = await woldMap({
		platform: 'solution', // IT DOES NOT MATTER WHICH PLATFORM HERE
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
			count: locationsCount,
			map: mapFile,
		},
	}
}