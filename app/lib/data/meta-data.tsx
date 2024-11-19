'use server';
import platformApi from '@/app/lib/data/platform-api';

interface Props {
    filters?: string[];
    space?: string;
    platforms?: string | string[];
    searchParams?: any;
}

export default async function metaData(_kwargs: Props) {
	let { filters, space, platforms, searchParams } = _kwargs;
	if (!filters) filters = ['countries', 'thematic areas', 'sdgs'];
	if (!platforms) platforms = ['solution'];
	else if (!Array.isArray(platforms)) platforms = [platforms];
	
	if (!searchParams) searchParams = {};
	const { page, ...filterParams } = searchParams;

	if (!space) {
		if (filterParams.pinboard) space = 'pinned';
		else space = 'published';
	}

	let tags: any[] = [];
	let countries: any[] = [];

	if (filters.some((d: string) => d !== 'countries')) {
		tags = await Promise.all(platforms.map((d: any) => {
			return platformApi(
		        { ...filterParams, ...{ space, use_pads: true, type: filters.filter((d: string) => d !== 'countries').map((d: string) => d.replace(/\s+/g, '_')) } },
		        d,
		        'tags'
		    );
		}));
		tags = tags.flat().filter((d: any) => d)
		.filter((value: any, index: number, self: any) => {
		    return self.findIndex((d: any) => d?.id === value?.id && d?.type === value?.type) === index;
		});
		tags?.forEach((d: any) => {
		    if (Array.isArray(filterParams[d.type])) d.checked = filterParams[d.type]?.includes(d.id?.toString());
		    else d.checked = filterParams[d.type] === d.id?.toString();
		});
	}

	if (filters.some((d: string) => d === 'countries')) {
		countries = await Promise.all(platforms.map((d: any) => {
			return platformApi(
		        { ...filterParams, ...{ space, use_pads: true } },
		        d,
		        'countries'
		    );
		}));
		countries = countries.flat()
		.filter((value: any, index: number, self: any) => {
		    return self.findIndex((d: any) => d?.iso3 === value?.iso3) === index;
		});
		countries?.forEach((d: any) => {
			d.id = d?.iso3;
			d.name = d.country;
			d.type = 'countries';
			d.checked = filterParams[d.type]?.includes(d.id) || filterParams[d.type] === d.id;
		});
	}

	let data: any[] = [];
	if (tags.length) {
		filters.filter((d: string) => d !== 'countries')
		.forEach((d: string) => {
			const obj: any = {};
			obj.key = d;
			obj.data = tags?.filter((c: any) => c.type === d.replace(/\s+/g, '_'));
			if (d !== 'sdgs') obj.data.sort((a: any, b: any) => a.name?.localeCompare(b.name));
			else obj.data.sort((a: any, b: any) => a.id - b.id);
			data.push(obj);
		});
	}
	if (countries.length) {
		data.push({
			key: 'countries',
			data: countries?.sort((a, b) => a.name?.localeCompare(b.name))
		});
	}
	
	return data;
}