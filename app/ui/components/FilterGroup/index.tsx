'use client';
import { useCallback } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useState } from 'react';

interface filtersProps {
  placeholder: string;
  list: any[];
  loading: boolean;
  activeFilters: any[];
  searchParams?: any;
}

export default function FilterGroup({
  placeholder,
  list,
  loading,
  activeFilters,
}: filtersProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [focus, setFocus] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const searchParams = useSearchParams();

  const removeQueryStringValue = useCallback(
    (value: string) => {
      const params = new URLSearchParams();
      for (const [key, val] of searchParams.entries()) {
        if (val !== value) {
          params.append(key, val);
        }
      }
      return params.toString();
    },
    [searchParams]
  );

  let options;
  if (loading) options = <li>Loading filters</li>;
  else {
    options = list.map((opt: any, j: number) => {
      const inputId = `${opt.type}-${opt.id}`;
      const simplifiedName = opt?.name?.toLowerCase().trim();

      return (
        <li
          key={j}
          className={clsx(
            !searchValue?.length ||
              simplifiedName.includes(searchValue.toLowerCase().trim())
              ? null
              : 'hidden',
            opt.checked ? 'active' : null
          )}
        >
          <input
            type="checkbox"
            name={opt.type}
            value={opt.id}
            className="hidden"
            id={inputId}
            checked={opt.checked || null}
            onChange={(e) => {
              (e.target?.parentNode as HTMLElement)?.classList?.toggle(
                'active'
              );
            }}
          />
          <label htmlFor={inputId} className="block w-full">
            {opt.name}
          </label>
        </li>
      );
    });
  }

  return (
    <>
      <div className="filter-group" tabIndex={0}>
        <div onFocus={(e) => setFocus(true)} onBlur={(e) => setFocus(false)}>
          <input
            type="text"
            placeholder={placeholder}
            onKeyUp={(e) =>
              setSearchValue((e.target as HTMLInputElement)?.value)
            }
          />
          <menu className={clsx(focus ? 'open' : '')}>{options}</menu>
        </div>
        {activeFilters?.length ? (
          <div
            className="active-filters flex flex-row gap-1.5 p-[20px]"
            onFocus={(e) => setFocus(false)}
          >
            {activeFilters?.map((d: any, i: number) => {
              return (
                <button
                  key={i}
                  className="chip square mr-2 flex items-center bg-posted-yellow"
                  onFocus={(e) => setFocus(false)}
                >
                  <span className="flex-grow">{d}</span>
                  <span
                    className="ml-2 cursor-pointer rounded bg-black px-2 text-white"
                    onClick={(e: any) => {
                      setFocus(false);
                      e.stopPropagation();
                      e.preventDefault();
                      const form = e.target.closest('form');
                      const input = form.querySelector(`input[value="${d}"]`);
                      if (input) {
                        input.checked = false;
                      }
                      router.replace(
                        pathname + '?' + removeQueryStringValue(d)
                      );
                      form.submit();
                    }}
                  >
                    x
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </>
  );
}
