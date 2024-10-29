import { statsApi } from '@/app/lib/data/pagination';
import { page_limit } from '@/app/lib/utils';
import Link from 'next/link';

export async function pagestats(page: number, platform: string, status: number) {
	if (!status) status = 3;
	
	async function fetchPages() {
	    const data = await statsApi(platform) || {};
	    const { breakdown } = data;
	    const totalToCount = breakdown.filter((b: any) => b.status >= status);
	    const total = totalToCount.reduce((partialSum: number, a: any) => partialSum + a.count, 0);
	    const pages = Math.ceil(total / page_limit);
	    return { total, page, pages };
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
	if (totalPages <= 3) {
		return (
			<>
				{new Array(totalPages).fill(null).map((d, i) => (
					<button key={i + 1} form='search-form' type='submit' value={i + 1} name='page' className={!page || page === i + 1 ? 'bg-[rgb(255,229,210)]' : ''}>
						{i + 1}
					</button>
				))}
			</>
		)
	} else {
		if (page <= 2) {
			return (
				<>
					{new Array(Math.min(totalPages, 3)).fill(null).map((d, i) => (
						<button key={i + 1} form='search-form' type='submit' value={i + 1} name='page' className={!page || page === i + 1 ? 'bg-[rgb(255,229,210)]' : ''}>
							{i + 1}
						</button>
					))}
					{totalPages > 3 ? (
						<span>…</span>
					) : (null)}
					{totalPages > 3 ? (
						<button key={totalPages} form='search-form' type='submit' value={totalPages} name='page' className={page === totalPages ? 'bg-[rgb(255,229,210)]' : ''}>
							{totalPages}
						</button>
					) : (null)}
				</>
			)
		} else if (page > 2 && page <= totalPages - 3) {
			return (
				<>
					<button key={1} form='search-form' type='submit' value={1} name='page' className={page === 1 ? 'bg-[rgb(255,229,210)]' : ''}>
							1
					</button>	
					<span>…</span>
					{new Array(3).fill(null).map((d, i) => (
						<button key={page - 1 + i} form='search-form' type='submit' value={page - 1 + i} name='page' className={page - 1 + i === page ? 'bg-[rgb(255,229,210)]' : ''}>
								{page - 1 + i}
						</button>
					))}
					<span>…</span>
					<button key={totalPages} form='search-form' type='submit' value={totalPages} name='page' className={page === totalPages ? 'bg-[rgb(255,229,210)]' : ''}>
						{totalPages}
					</button>
				</>
			)
		} else {
			return (
				<>
					<button key={1} form='search-form' type='submit' value={1} name='page'>
						1
					</button>	
					<span>…</span>
					{new Array(3).fill(null).map((d, i) => (
						<button key={totalPages - 2 + i} form='search-form' type='submit' value={totalPages - 2 + i} name='page' className={page === totalPages - 2 + i ? 'bg-[rgb(255,229,210)]' : ''}>
							{totalPages - 2 + i}
						</button>
					))}
				</>
			)
		}
	}
}