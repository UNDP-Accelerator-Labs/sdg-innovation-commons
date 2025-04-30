'use server';
import platformApi from '@/app/lib/data/platform-api';
import nlpStats from '@/app/lib/data/nlp-pagination';

interface Props {
  filters?: string[];
  space?: string;
  platforms?: string | string[];
  searchParams?: any;
  useNlp?: boolean;
}

export default async function metaData(_kwargs: Props) {
  let { filters, space, platforms, searchParams, useNlp } = _kwargs;
  if (!filters) filters = ['countries', 'regions', 'thematic areas', 'sdgs'];
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
  let regions: any[] = [];

  let regionFilters: any[] = [];
  if(filterParams.regions) {
	if (Array.isArray(filterParams.regions)) regionFilters = filterParams.regions;
	else regionFilters = [filterParams.regions];
  }

  if (filters.some((d: string) => d !== 'countries')) {
    tags = await Promise.all(
      platforms.map((d: any) => {
        return platformApi(
          {
            ...filterParams,
            ...{
              space,
              use_pads: true,
              type: filters
                .filter((d: string) => d !== 'countries')
                .map((d: string) => d.replace(/\s+/g, '_')),
            },
          },
          d,
          'tags'
        );
      })
    );
    tags = tags
      .flat()
      .filter((d: any) => d)
      .filter((value: any, index: number, self: any) => {
        return (
          self.findIndex(
            (d: any) => d?.id === value?.id && d?.type === value?.type
          ) === index
        );
      });
    tags?.forEach((d: any) => {
      if (Array.isArray(filterParams[d.type]))
        d.checked = filterParams[d.type]?.includes(d.id?.toString());
      else d.checked = filterParams[d.type] === d.id?.toString();
    });
  }

  if (filters.some((d: string) => d === 'countries')) {
    if (useNlp) {
      const { iso3 } = await nlpStats({ fields: ['iso3'] });
      countries = await platformApi(
        { countries: iso3 },
        'solution',
        'countries'
      );
    } else {
      countries = await Promise.all(
        platforms.map((d: any) => {
          return platformApi(
            { ...filterParams, ...{ space, use_pads: true } },
            d,
            'countries'
          );
        })
      );
      countries = countries
        .flat()
        .filter((value: any, index: number, self: any) => {
          return (
            value?.iso3 &&
            self.findIndex((d: any) => d?.iso3 === value?.iso3) === index
          );
        });
    }

    countries?.forEach((d: any) => {
      d.id = d?.iso3;
      d.name = d.country;
      d.type = 'countries';
      d.checked =
        filterParams[d.type]?.includes(d.id) || filterParams[d.type] === d.id;

      if (!regions.some((s: any) => s.name === d.undp_region_name)) {
        regions.push({
          type: 'regions',
          id: d.undp_region,
          name: d.undp_region_name,
          shortcode: d.undp_region,
          checked: Array.isArray(filterParams['regions'])
            ? filterParams['regions']?.some((a: any) => a === d.undp_region)
            : filterParams['regions'] === d.undp_region,
        });
      }
    })

    regions = regions
      .filter((a: any) => a.name)
      .sort((a: any, b: any) => a.name?.localeCompare(b.name));
  }

  let data: any[] = [];
  if (tags.length) {
    filters
      .filter((d: string) => d !== 'countries')
      .forEach((d: string) => {
        const obj: any = {};
        obj.key = d;
        obj.data = tags?.filter((c: any) => c.type === d.replace(/\s+/g, '_'));
        if (d !== 'sdgs')
          obj.data.sort((a: any, b: any) => a.name?.localeCompare(b.name));
        else obj.data.sort((a: any, b: any) => a.id - b.id);
        data.push(obj);
      });
  }
  if (countries.length) {
    data.push({
      key: 'countries',
      data: countries?.sort((a, b) => a.name?.localeCompare(b.name)),
    });
  }

  if (regions?.length) {
    data = data || []; 
    const regionsData = {
      key: 'regions',
      data: regions,
    };
    const existingIndex = data.findIndex((item: any) => item.key === 'regions');
    if (existingIndex !== -1) {
        data[existingIndex] = regionsData; 
    } else {
        data.push(regionsData); 
    }
  }

  return data;
}
