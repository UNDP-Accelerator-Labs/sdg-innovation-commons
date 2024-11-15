'use server';
import { commonsPlatform } from '@/app/lib/utils';
import get from './get'

interface layerProps {
	iso3: string;
	count: number;
	lat: number;
	lng: number;
	type: string;
	color?: string;
}

interface Props {
	platform: string;
	projsize?: number;
	base_color?: string;
	layers?: layerProps[];
}

export default async function worldMap({
	platform,
	projsize,
	base_color,
	layers,
}: Props) {
	const base_url: string | undefined = commonsPlatform.find(p => p.key === platform)?.url;
	if (!base_url) return { status: 500, message: 'cannot find API url' };

	const { file }: any = await get({
	    url: `${base_url}/apis/fetch/map`,
	    method: 'POST',
	    body: {
			projsize: projsize ?? 1440 * .75,
			base_color: base_color || '#000',
			layers: layers || [],
		}
	});
	return { status: 200, file };
}