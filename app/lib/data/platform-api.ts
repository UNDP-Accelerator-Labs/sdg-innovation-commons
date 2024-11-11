'use server';
import { commonsPlatform, extractSDGNumbers, polishTags } from '@/app/lib/utils';
import get from './get'

export interface Props {
  space?: string;
  page?: number;
  limit?: number;
  search?: string; 
  status?: any;
  contributors?: any;
  countries?: any;
  regions?: any;
  teams?: any;
  pads?: any;
  templates?: any;
  mobilizations?: any;
  pinboard?: any;
  section?: any;
  methods?: any;
  nodes?: any;
  orderby?: string;
  include_tags?: boolean;
  include_imgs?: boolean;
  include_data?: boolean;
  include_locations?: boolean;
  include_metafields?: boolean;
  include_source?: boolean;
  include_engagment?: boolean;
  include_comments?: boolean;
  platform?: string;
}

export default async function platformApi(_kwargs: Props, platform: string, object: string) {
    let { space, pinboard, include_tags } = _kwargs;
    if (!platform) platform = 'solution';
    if (!object) object = 'pads';
    if (!space) _kwargs.space = 'public';
    if (pinboard) _kwargs.space = 'pinned';
    if (object === 'pads' && !include_tags) _kwargs.include_tags = true;

    const params = new URLSearchParams();
    params.set('output', 'json');
    
    for (let k in _kwargs) {
        const argV = _kwargs[k as keyof typeof _kwargs];
        if (Array.isArray(argV)) {
            argV.forEach((v:any) => {
                params.append(k, v);
            });
        } else {
            params.set(k, argV);
        }
    } 

    const base_url: string | undefined = commonsPlatform.find(p => p.key === platform)?.url;

    const url = `${base_url}/apis/fetch/${object}?${params.toString()}`;
    const data = await get({
        url,
        method: 'GET',
    });

    console.log('check url')
    console.log(`${base_url}/apis/fetch/${object}?${params.toString()}`)

    // set urls for pads
    if (object === 'pads') {
        data?.forEach((d: any) => {
            d.url = `${base_url}/en/view/pad?id=${d.pad_id}`;
            d.base = platform;
            const date = new Date(d.created_at);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            d.date = `${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : ''}${month}.${year}`;
        });
        return polishTags(data);
    } else return data;

}



/*
export default async function see(_kwargs: Props) {
    const { page, limit, offset, search, language, country } = _kwargs
    const body = {
        input: search ?? '',
        page_limit: page ?? 1,
        page: page ?? 1,
        limit: limit ?? 10,
        offset: offset ?? 0,
        short_snippets: true,
        vecdb: "main",
        filters: {
            language: language ? [language] : [],
            doc_type: ["solution"],
            iso3: country ? [country] : []
        }
    }

    const base_url: string | undefined = commonsPlatform
        .filter(p => p.key === 'solution')
        ?.[0]?.url;

    let data = await get({
        url: `${NLP_URL}/search`,
        method: 'POST',
        body,
    });

    // Call platform API to get additional data if both data and base_url are present
    if (data && base_url) {
        data = await getAdditionalData(data, base_url);
    }
    // Fallback to platform API if data.status is not 'ok'
    else if (!data?.status || data.status !== 'ok') {
        if (base_url) {
            const searchTxt = search && search != defaultSearch('see') ? `&search=${encodeURI(body.input)}` : null
            const url = `${base_url}/apis/fetch/pads?output=json&include_engagement=true&include_tags=true&include_metafields=true&include_data=true&page=${body.page}&page_limit=${body.page_limit}${searchTxt ? searchTxt : ''}`;
            // TODO: Add pagination to platform API source code
            const fetchedData = await get({
                url,
                method: 'GET',
            });

            // Ensure fetchedData is an array before flattening
            let flattenedFetchedData = await Promise.all(
                fetchedData?.flat?.()?.map((p: any) => ({
                    ...p,
                    tags: p?.tags
                        ?.filter((p: any) => p.type === 'thematic_areas')
                        .map((p: any) => p.name),
                    sdg: extractSDGNumbers(p)
                })
                )
                    ?.slice(0, body.limit) //TODO: Remove this line after pagination at platform source code
            );
            if (flattenedFetchedData && flattenedFetchedData.length) {
                data = { hits: flattenedFetchedData };
            }
        }
    }

    return data
}
*/