import clsx from 'clsx';
import statsApi from '@/app/lib/data/platform-pagination';
import nlpStatsApi from '@/app/lib/data/nlp-pagination';
import { page_limit } from '@/app/lib/utils';

export async function pagestats(page: number, platform: string | string[], _kwargs: any) {
	let status: number = 3;
	let { limit, offset, search, language, iso3 } = _kwargs;
	async function fetchPages() {
	    if (Array.isArray(platform)) {
	    	const {doc_count: total } = await nlpStatsApi({ doc_type: platform, iso3, language, }) || {};
	    	const pages = Math.ceil(total / page_limit);
	    	return { total, page, pages };
	    } else {
		   	const data = await statsApi(platform, _kwargs) || {};
		    const { filtered: total, breakdown } = data;
		    // const totalToCount = breakdown.filter((b: any) => b.status >= status);
		    // const total = totalToCount.reduce((partialSum: number, a: any) => partialSum + a.count, 0);
		    const pages = Math.ceil(total / page_limit);
		    return { total, page, pages };
		}
	}

	return fetchPages();
}

interface paginationProps {
	page: number;
	totalPages: number;
}

export function Pagination({
	page,
	totalPages
}: paginationProps) {
	if(!page || !totalPages) return null
	if (totalPages <= 3) {
		return (
			<>
			{+page > 1 ? (
				<button form='search-form' type='submit' value={+page - 1} name='page' className='relative bg-[#d2f960]'>
					<img src='/images/arrow-l.svg' className='w-[40px] absolute left-[3px] top-0' />
				</button>
			) : null}
			{new Array(totalPages).fill(null).map((d, i) => (
				<button key={i + 1} form='search-form' type='submit' value={i + 1} name='page' className={clsx(!page || +page === i + 1 ? 'bg-[rgb(255,229,210)]' : '')}>
					{i + 1}
				</button>
			))}
			{+page !== totalPages ? (
				<button form='search-form' type='submit' value={+page + 1} name='page' className='relative bg-[#d2f960]'>
					<img src='/images/arrow-r.svg' className='w-[40px] absolute right-[3px] top-0' />
				</button>
			) : null}
			</>
		)
	} else {
		if (+page <= 2) {
			return (
				<>
				{+page > 1 ? (
					<button form='search-form' type='submit' value={+page - 1} name='page' className='relative bg-[#d2f960]'>
						<img src='/images/arrow-l.svg' className='w-[40px] absolute left-[3px] top-0' />
					</button>
				) : null}
				{totalPages && new Array(Math.min(totalPages, 3)).fill(null).map((d, i) => (
					<button key={i + 1} form='search-form' type='submit' value={i + 1} name='page' className={!page || +page === i + 1 ? 'bg-[rgb(255,229,210)]' : ''}>
						{i + 1}
					</button>
				))}
				{totalPages > 3 ? (
					<span>…</span>
				) : (null)}
				{totalPages > 3 ? (
					<button key={totalPages} form='search-form' type='submit' value={totalPages} name='page' className={+page === totalPages ? 'bg-[rgb(255,229,210)]' : ''}>
						{totalPages}
					</button>
				) : (null)}
				{+page !== totalPages ? (
					<button form='search-form' type='submit' value={+page + 1} name='page' className='relative bg-[#d2f960]'>
						<img src='/images/arrow-r.svg' className='w-[40px] absolute right-[3px] top-0' />
					</button>
				) : null}
				</>
			)
		} else if (+page > 2 && +page <= totalPages - 3) {
			return (
				<>
				{+page > 1 ? (
					<button form='search-form' type='submit' value={+page - 1} name='page' className='relative bg-[#d2f960]'>
						<img src='/images/arrow-l.svg' className='w-[40px] absolute left-[3px] top-0' />
					</button>
				) : null}
				<button key={1} form='search-form' type='submit' value={1} name='page' className={+page === 1 ? 'bg-[rgb(255,229,210)]' : ''}>
						1
				</button>	
				<span>…</span>
				{new Array(3).fill(null).map((d, i) => (
					<button key={+page - 1 + i} form='search-form' type='submit' value={+page - 1 + i} name='page' className={clsx((+page - 1 + i)  === +page ? 'bg-[rgb(255,229,210)]' : '')}>
						{+page - 1 + i}
					</button>
				))}
				<span>…</span>
				<button key={totalPages} form='search-form' type='submit' value={totalPages} name='page' className={+page === +totalPages ? 'bg-[rgb(255,229,210)]' : ''}>
					{totalPages}
				</button>
				{page !== totalPages ? (
					<button form='search-form' type='submit' value={+page + 1} name='page' className='relative bg-[#d2f960]'>
						<img src='/images/arrow-r.svg' className='w-[40px] absolute right-[3px] top-0' />
					</button>
				) : null}
				</>
			)
		} else {
			return (
				<>
				{+page > 1 ? (
					<button form='search-form' type='submit' value={+page - 1} name='page' className='relative bg-[#d2f960]'>
						<img src='/images/arrow-l.svg' className='w-[40px] absolute left-[3px] top-0' />
					</button>
				) : null}
				<button key={1} form='search-form' type='submit' value={1} name='page'>
					1
				</button>	
				<span>…</span>
				{new Array(3).fill(null).map((d, i) => (
					<button key={totalPages - 2 + i} form='search-form' type='submit' value={totalPages - 2 + i} name='page' className={+page === totalPages - 2 + i ? 'bg-[rgb(255,229,210)]' : ''}>
						{totalPages - 2 + i}
					</button>
				))}
				{+page !== totalPages ? (
					<button form='search-form' type='submit' value={+page + 1} name='page' className='relative bg-[#d2f960]'>
						<img src='/images/arrow-r.svg' className='w-[40px] absolute right-[3px] top-0' />
					</button>
				) : null}
				</>
			)
		}
	}
}