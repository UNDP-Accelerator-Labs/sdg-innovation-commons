import platformApi from '@/app/lib/data/platform-api';
import { page_limit } from '@/app/lib/utils';

interface Props {
	boards: number[];
	searchParams: any;
}

export default async function Data({
	boards,
	searchParams,
}: Props) {
	const { data, count } = await platformApi(
	    { ...searchParams, ...{ limit: page_limit, pinboard: boards } },
	    'solution', // IN THIS CASE, PLATFORM IS IRRELEVANT, SINCE IT IS PULLING FROM THE GENERAL DB
	    'pinboards'
	);
	const pages = Math.ceil(count / page_limit);

	return {
		data,
		pages
	}
}