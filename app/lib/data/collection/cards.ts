import { fetchPinboards } from '@/app/lib/data/platform';
import { page_limit } from '@/app/lib/helpers/utils';

interface Props {
	boards: number[];
	searchParams: any;
}

export default async function Data({
	boards,
	searchParams,
}: Props) {
	let result = await fetchPinboards(
	    { ...searchParams, ...{ limit: page_limit, pinboard: boards } },
	    'experiment' // IN THIS CASE, PLATFORM IS IRRELEVANT, SINCE IT IS PULLING FROM THE GENERAL DB
	);
	let data: any[] = [];
	let count: number = 1;
	if (result?.data) {
		data = result.data;
		count = result.count;
	} else data = [result];

	if (!data) data = [];
	const pages = Math.ceil(count / page_limit);

	return {
		data,
		pages
	}
}