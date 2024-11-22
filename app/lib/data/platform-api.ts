'use server';
import blogsApi from './blogs-api';
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
  include_engagement?: boolean;
  include_comments?: boolean;
  platform?: string;
  pseudonymize?: boolean;
}

export default async function platformApi(_kwargs: Props, platform: string, object: string) {
    let { space, pinboard, include_tags, include_locations, include_engagement } = _kwargs;
    if (!platform) platform = 'solution';
    if (!object) object = 'pads';
    if (!space) _kwargs.space = 'published';
    if (pinboard) _kwargs.space = 'pinned';
    if (object === 'pads' && !include_tags) _kwargs.include_tags = true;
    if (object === 'pads' && !include_locations) _kwargs.include_locations = true;
    if (object === 'pads' && !include_engagement) _kwargs.include_engagement = true;

    if (platform === 'blogs') return await blogsApi(_kwargs);

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
    
    console.log('check url ', url)

    const data = await get({
        url,
        method: 'GET',
    });

    // set urls for pads
    if (object === 'pads' && Array.isArray(data)) {
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
    } 
    else return data;
}
