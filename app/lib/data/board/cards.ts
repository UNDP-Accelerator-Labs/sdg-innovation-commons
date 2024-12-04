import platformApi from '@/app/lib/data/platform-api';
import { commonsPlatform } from '@/app/lib/utils';

interface Props {
    platform: string;
    platforms: string[];
    searchParams: any;
    pads: any[];
}

export default async function Data({
    platform,
    platforms,
    searchParams,
    pads,
}: Props) {
	// LOAD CONTENT
	// SET THE CORRECT PLATFORM(S)
	const data: any[] = platforms?.length ? await Promise.all(
	    platforms
	    ?.filter((d: any) => {
	        // DETERMINE WHICH PLATFORM(S) TO QUERY
	        if (platform === 'all') return d !== 'all';
	        else return (commonsPlatform.find((c: any) => c.key === platform)?.shortkey || platform) === d.platform;
	    }).map(async (d: any) => {
	        if (d) {
	            const platform: string = commonsPlatform.find((c: any) => c.shortkey === d.platform)?.key || d.platform;
	            const platformPads: any[] = pads.filter((c: any) => c.platform === d.platform).map((c: any) => c.pad_id);
	            if (platformPads.length) {
		            const data: any[] = await platformApi(
		                { include_locations: true, pads: platformPads },
		                platform, 
		                'pads'
		            );
					return data || [];
				} else return [];
	        } else return [];
	    })
	) : [];
	// GET THE MAIN VIGNETTE FOR THE BOARD
	const vignettes = data?.flat().map(d => d.vignette);
	const vignette = vignettes[Math.floor(Math.random() * vignettes.length)];

	return {
		data,
		vignette,
	}
}