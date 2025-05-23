'use server';
import blogsApi from './blogs-api';
import {
  commonsPlatform,
  extractSDGNumbers,
  polishTags,
  LOCAL_BASE_URL,
} from '@/app/lib/utils';
import get from './get';

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
  anonymize_comments?: boolean;
  platform?: string;
  pseudonymize?: boolean;
  render?: boolean;
  action?: string;
  include_pinboards?: string;
  email?: string;
  output?: string;
}

export default async function platformApi(
  _kwargs: Props,
  platform: string,
  object: string,
  urlOnly: boolean = false,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body: Record<string, any> = {}
) {
  let {
    space,
    pinboard,
    include_tags,
    include_locations,
    include_engagement,
    include_comments,
    include_pinboards,
    action,
    render,
    output,
  } = _kwargs;
  if (!platform) platform = 'solution';
  if (!object) object = 'pads';
  if (!action) action = 'fetch';
  if (!space) _kwargs.space = 'published';
  if (pinboard) _kwargs.space = 'pinned';
  if (object === 'pads' && !include_tags) _kwargs.include_tags = true;
  if (object === 'pads' && !include_locations) _kwargs.include_locations = true;
  if (object === 'pads' && !include_comments) {
    _kwargs.include_comments = true;
    _kwargs.anonymize_comments = false;
  }
  if (object === 'pads' && !include_engagement)
    _kwargs.include_engagement = true;
  if (object === 'pads' && !include_pinboards)
    _kwargs.include_pinboards = 'all';

  if (!['solution', 'experiment', 'action plan'].includes(platform)) return await blogsApi(_kwargs);

  const params = new URLSearchParams();
  if (render) params.set('output', 'csv');
  if (output) params.set('output', output);
  else params.set('output', 'json');
  params.set('include_data', 'true');

  for (let k in _kwargs) {
    const argV = _kwargs[k as keyof typeof _kwargs];
    if (Array.isArray(argV)) {
      argV.forEach((v: any) => {
        params.append(k, v);
      });
    } else {
      params.set(k, argV);
    }
  }

  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === platform
  )?.url;

  const url = `${base_url}/apis/${action}/${object}?${params.toString()}`; 
  // console.log('check url ', url);

  if (urlOnly) return url;

  const data = await get({
    url,
    method,
    body,
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
  } else return data;
}

export async function engageApi(
  platform: string,
  type: string,
  action: string,
  id: number
) {
  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === platform
  )?.url;

  const url = `${base_url}/engage`;
  const body = {
    action,
    id,
    object: 'pad',
    type,
  };

  const data = await get({
    url,
    method: 'POST',
    body,
  });
  return data;
}

export async function pin(
  platform: string,
  action: string,
  board_id: number,
  object_id: number | number[],
  board_title?: string
) {
  let source = platform;
  if (['news', 'blog', 'publications', 'press release'].includes(platform))
    source = 'solution';

  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === source
  )?.url;

  const url = `${base_url}/pin`;
  const body = {
    action,
    board_id,
    object_id,
    object: 'pad',
    board_title,
    source: platform,
  };

  const data = await get({
    url,
    method: 'POST',
    body,
  });
  return data;
}

export async function updatePinboard(
  id: number,
  title: string,
  description: string
) {
  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === 'experiment'
  )?.url;

  const url = `${base_url}/save/pinboard`;
  const body = {
    id,
    title,
    description,
  };

  const data = await get({
    url,
    method: 'POST',
    body,
  });
  return data;
}


export async function getRegion(region: string | string[]) {
  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === 'experiment'
  )?.url;

  let _region = Array.isArray(region) ? region : [region];

  const regions = Array.isArray(region) ? region.map(r => `regions=${r}`).join('&') : `regions=${region}`;
  const url = `${base_url}/apis/fetch/countries?${regions}`;
  let data = await get({
    url,
    method: 'GET',
  });

  data = data.filter((d: any) => _region.includes(d?.undp_region))

  return data;
}



export async function addComment(
  platform: string,
  message: string,
  id: number,
  source: number|string|undefined,
) {
  if(!message || !platform) return;

  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === platform
  )?.url;

  const url = `${base_url}/comment`;
  const body = {
    object: 'pad',
    id,
    message,
    source,
  };

  const data = await get({
    url,
    method: 'POST',
    body,
  });
  return data;
}