'use client';
import { useCallback, useEffect } from 'react';
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

  // helper: collect all identifiers for an option (iso3, sub_iso3, equivalents, id)
  const getIdentifiers = useCallback((opt: any) => {
    const ids = new Set<string>();
    if (opt?.iso3) ids.add(String(opt.iso3));
    if (opt?.sub_iso3) ids.add(String(opt.sub_iso3));
    if (opt?.equivalents?.length) {
      opt.equivalents.forEach((s: string) => s && ids.add(String(s)));
    }
    if (opt?.id !== undefined && opt?.id !== null) ids.add(String(opt.id));
    return Array.from(ids);
  }, []);

  const paramValuesFor = useCallback(
    (key: string) => {
      try {
        // ReadonlyURLSearchParams supports getAll in Next; fallback to manual
        // convert to URLSearchParams and use getAll
        const params = new URLSearchParams(searchParams?.toString?.() ?? '');
        return params.getAll(key);
      } catch {
        return [];
      }
    },
    [searchParams]
  );

  const isOptionChecked = useCallback(
    (opt: any) => {
      if (!searchParams) return false;
      const values = paramValuesFor(opt.type);
      if (!values?.length) return false;
      const ids = getIdentifiers(opt);
      return values.some((v) => ids.includes(v));
    },
    [searchParams, getIdentifiers, paramValuesFor]
  );

  // local visual selected labels that update immediately as user toggles
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  // initialize selectedLabels from current query on mount / when list/searchParams change
  useEffect(() => {
    if (!list?.length || !searchParams) {
      setSelectedLabels([]);
      return;
    }
    const selected: string[] = [];
    for (const opt of list) {
      if (isOptionChecked(opt)) {
        const label = opt.country ?? opt.name ?? opt.label ?? opt.id;
        if (label && !selected.includes(label)) selected.push(label);
      }
    }
    setSelectedLabels(selected);
  }, [list, searchParams, isOptionChecked]);


  const handleToggle = useCallback(
    (opt: any, checked: boolean) => {
      // use a copy of current params
      const current = new URLSearchParams(searchParams?.toString?.() ?? '');
      const ids = getIdentifiers(opt);
      const label = opt.country ?? opt.name ?? opt.label ?? opt.id;

      if (checked) {
        // append all identifiers for this option (iso3 + equivalents + id)
        ids.forEach((id) => {
          // avoid duplicating exact value entries
          const existing = current.getAll(opt.type);
          if (!existing.includes(id)) current.append(opt.type, id);
        });
        // update local selected labels immediately (do NOT replace the search input)
        setSelectedLabels((prev) => {
          const next = prev.includes(label) ? prev : [...prev, label];
          return next;
        });
      } else {
        // remove any param entries that match any identifier for this option
        const entries = Array.from(current.entries()).filter(
          ([k, v]) => !(k === opt.type && ids.includes(v))
        );
        const newParams = new URLSearchParams();
        entries.forEach(([k, v]) => newParams.append(k, v));
        const finalQuery = newParams.toString();
        setSelectedLabels((prev) => prev.filter((x) => x !== label));
        // update URL without navigating (prevents jump)
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', pathname + (finalQuery ? '?' + finalQuery : ''));
        }
        return;
      }

      // update URL without navigating (prevents jump)
      const final = current.toString();
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', pathname + (final ? '?' + final : ''));
      }
    },
    [searchParams, getIdentifiers, pathname]
  );


  // deselect by label (used by chip remove button) - removes all identifiers for that option
 const handleRemoveLabel = useCallback(
    (label: string) => {
      // find corresponding option in the list
      const opt = list?.find((o: any) => {
        const lab = o.country ?? o.name ?? o.label ?? o.id;
        return lab === label;
      });
      if (!opt || !searchParams) return;

      const ids = getIdentifiers(opt);
      const params = new URLSearchParams(searchParams.toString());

      // build new params without any matching identifiers for this option
      const entries = Array.from(params.entries()).filter(
        ([k, v]) => !(k === opt.type && ids.includes(v))
      );
      const newParams = new URLSearchParams();
      entries.forEach(([k, v]) => newParams.append(k, v));

      // update URL without navigation/scroll
      const finalQuery = newParams.toString();
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', pathname + (finalQuery ? '?' + finalQuery : ''));
      }

      // update local selection state (do NOT change searchValue)
      setSelectedLabels((prev) => prev.filter((x) => x !== label));
    },
    [list, searchParams, getIdentifiers, pathname]
  );

  let options;
  if (loading) options = <li>Loading filters</li>;
  else {
    options = list.map((opt: any, j: number) => {
      const inputId = `${opt.type}-${opt.id}`;
      const simplifiedName = opt?.name?.toLowerCase().trim();
      const label = opt.country ?? opt.name ?? opt.label ?? opt.id;
      // consider immediate local selection (selectedLabels) as well as params
      const checked = isOptionChecked(opt) || selectedLabels.includes(label);
      const ids = getIdentifiers(opt);

      return (
        <li
          key={j}
          className={clsx(
            !searchValue?.length ||
              simplifiedName.includes(searchValue.toLowerCase().trim())
              ? null
              : 'hidden',
            checked ? 'active' : null
          )}
        >
          {/* keep this checkbox for accessibility / toggling but omit name so form submission uses the hidden inputs below */}
          <input
            type="checkbox"
            // name={opt.type}  <-- removed so we don't duplicate values
            value={opt.id}
            className="hidden"
            id={inputId}
            checked={checked || undefined}
            onChange={(e) => {
              const isChecked = (e.target as HTMLInputElement).checked;
              // keep DOM class in sync
              (e.target?.parentNode as HTMLElement)?.classList?.toggle('active', isChecked);
              handleToggle(opt, isChecked);
            }}
          />
          <label htmlFor={inputId} className="block w-full">
            {opt.name ?? opt.country}
          </label>

          {/* when selected, render hidden inputs for every identifier so form submit includes them all */}
          {checked &&
            ids.map((id) => (
              <input
                key={id}
                type="hidden"
                name={opt.type}
                value={id}
              // not disabled so the values are included on form submit
              />
            ))}
        </li>
      );
    });
  }

  return (
    <>
      <div
        className="filter-group"
        tabIndex={0}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setFocus(false);
          }
        }}
      >
        <div
          onFocus={() => setFocus(true)}
        >
          {/* selected labels shown as chips inline for immediate visual feedback */}
          <div className="selected-inline flex flex-wrap gap-2 mb-2">
            {selectedLabels.map((lab, idx) => (
              <span
                key={idx}
                className="chip inline-flex items-center bg-posted-yellow px-2 py-1 rounded"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleRemoveLabel(lab);
                  }
                }}
              >
                <span className="text-sm mr-2">{lab}</span>
                <button
                  type="button"
                  aria-label={`Remove ${lab}`}
                  className="ml-1 text-xs leading-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveLabel(lab);
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) =>
              setSearchValue((e.target as HTMLInputElement)?.value)
            }
          />
          <menu className={clsx(focus ? 'open' : '')}>
            {options}
          </menu>
        </div>
      </div>
    </>
  );
}