import { statsApi } from '@/app/lib/data/pagination';
import { page_limit } from '@/app/lib/utils';
import Link from 'next/link';

export async function pagestats(page: number, platform: string) {
	async function fetchPages() {
	    const { total } = await statsApi(platform);
	    const pages = Math.ceil(total / page_limit);
	    return { total, page, pages };
	}

	return fetchPages();
}

interface paginationProps {
	page: number;
	totalPages: number;
	handleClick: Function;
}

export function Pagination({
	page,
	totalPages,
	handleClick
}: paginationProps) {
	if (totalPages <= 3) {
		return (
			<>
				{new Array(totalPages).fill(null).map((d, i) => (
					<button key={i + 1} onClick={() => handleClick(i + 1)} className={!page || page === i + 1 ? 'bg-[rgb(255,229,210)]' : ''}>
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
						<button key={i + 1} onClick={() => handleClick(i + 1)} className={!page || page === i + 1 ? 'bg-[rgb(255,229,210)]' : ''}>
							{i + 1}
						</button>
					))}
					{totalPages > 3 ? (
						<span>…</span>
					) : (null)}
					{totalPages > 3 ? (
						<button key={totalPages} onClick={() => handleClick(totalPages)} className={page === totalPages ? 'bg-[rgb(255,229,210)]' : ''}>
							{totalPages}
						</button>
					) : (null)}
				</>
			)
		} else if (page > 2 && page <= totalPages - 3) {
			return (
				<>
					<button key={1} onClick={() => handleClick(1)} className={page === 1 ? 'bg-[rgb(255,229,210)]' : ''}>
							1
					</button>	
					<span>…</span>
					{new Array(3).fill(null).map((d, i) => (
						<button key={page - 1 + i} onClick={() => handleClick(page - 1 + i)} className={page - 1 + i === page ? 'bg-[rgb(255,229,210)]' : ''}>
								{page - 1 + i}
						</button>
					))}
					<span>…</span>
					<button key={totalPages} onClick={() => handleClick(totalPages)} className={page === totalPages ? 'bg-[rgb(255,229,210)]' : ''}>
						{totalPages}
					</button>
				</>
			)
		} else {
			return (
				<>
					<button key={1} onClick={() => handleClick(1)}>
						1
					</button>	
					<span>…</span>
					{new Array(3).fill(null).map((d, i) => (
						<button key={totalPages - 2 + i} onClick={() => handleClick(totalPages - 2 + i)} className={page === totalPages - 2 + i ? 'bg-[rgb(255,229,210)]' : ''}>
							{totalPages - 2 + i}
						</button>
					))}
				</>
			)
		}
	}
}