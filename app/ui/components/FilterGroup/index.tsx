import clsx from 'clsx';
import { useState, useEffect } from 'react';

interface filtersProps {
	placeholder: string;
	list: any[];
	loading: boolean;
	activeFilters: any[];
}

export default function FilterGroup({
	placeholder,
	list,
	loading,
	activeFilters,
}: filtersProps) {
	const [focus, setFocus] = useState<boolean>(false);
	const [searchValue, setSearchValue] = useState<string>('');

	let options;
	if (loading) options = (<li>Loading filters</li>);
	else {
		options = list.map((opt: any, j: number) => {
			const inputId = `${opt.type}-${opt.id}`;
			const simplifiedName = opt?.name?.toLowerCase().trim();

			return (
				<li key={j} className={clsx(!searchValue?.length || simplifiedName.includes(searchValue.toLowerCase().trim()) ? null : 'hidden', opt.checked ? 'active' : null)}>
					<input 
						type='checkbox' 
						name={opt.type} 
						value={opt.id} 
						className='hidden' 
						id={inputId}
						checked={opt.checked || null}
						onChange={(e) => {
							(e.target?.parentNode as HTMLElement)?.classList?.toggle('active');
						}}
					/>
					<label htmlFor={inputId} className='block w-full'>{opt.name}</label>
				</li>
			);
		});
	}

	return (
		<>
		<div className='filter-group' tabIndex={0} onFocus={(e) => setFocus(true)} onBlur={(e) => setFocus(false)}>
			<input type='text' placeholder={placeholder} onKeyUp={(e) => setSearchValue((e.target as HTMLInputElement)?.value)} />
			<menu className={clsx(focus ? 'open' : '')}>
				{options}
			</menu>
			{activeFilters?.length ? (
				<div className='active-filters flex flex-row gap-1.5 p-[20px]'>
					{activeFilters?.map((d: any, i: number) => {
						return (
							<button key={i} className='chip square bg-posted-yellow'>{d}</button>
						)
					})}
				</div>
			) : null
			}
		</div>
		</>
	);
}