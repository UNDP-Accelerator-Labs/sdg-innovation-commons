'use server';

import { commonsPlatform, polishTags, LOCAL_BASE_URL } from '@/app/lib/helpers/utils';
import blogsApi from '@/app/lib/data/blogs-api';
import get from '@/app/lib/data/get';
import type { Props } from './types';

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
    _kwargs.include_imgs = true;
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
        // Only append non-null, non-undefined values
        if (v !== null && v !== undefined && v !== 'null' && v !== 'undefined') {
          params.append(k, v);
        }
      });
    } else {
      // Only set non-null, non-undefined values
      if (argV !== null && argV !== undefined && argV !== 'null' && argV !== 'undefined') {
        params.set(k, argV);
      }
    }
  }

  if (platform) {
    params.set('platform', platform);
  }

  const base_url: string | undefined = commonsPlatform.find(
    (p) => p.key === platform
  )?.url;

  // For server-side requests, construct the full local URL
  const isServerSide = typeof window === 'undefined';
  const baseUrl = isServerSide 
    ? (LOCAL_BASE_URL || `http://localhost:${process.env.PORT || 3000}`) 
    : (LOCAL_BASE_URL || '');
  
  const localUrl = `${baseUrl}/api/${object}?${params.toString()}`;

  if (urlOnly) return localUrl;

  // Call local API only
  const response = await get({
    url: localUrl,
    method,
    body: method !== 'GET' ? body : undefined,
  });

  // Handle response structure: {count, data} for pads/pinboards, or direct array
  let data = response;
  let count = undefined;
  
  if (response && typeof response === 'object' && 'data' in response) {
    // New structure with count
    data = response.data;
    count = response.count;
  }

  // set urls for pads
  if (object === 'pads' && Array.isArray(data)) {
    data?.forEach((d: any) => {
      d.url = `${baseUrl}/pads/${platform}/${d.pad_id}`;
      d.base = platform;
      const date = new Date(d.created_at);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      d.date = `${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : ''}${month}.${year}`;
    });
    const polishedData = polishTags(data);
    return count !== undefined ? { count, data: polishedData } : polishedData;
  }
  return count !== undefined ? { count, data } : data;
}

export async function fetchCountries(params: any, platform: string = 'experiment') {
  return platformApi(params, platform, 'countries');
}

export async function fetchPinboards(params: any, platform: string = 'experiment') {
  return platformApi(params, platform, 'pinboards');
}

export async function engageApi(
  platform: string,
  type: string,
  action: string,
  id: number
) {
  const url = `${LOCAL_BASE_URL}/api/engagement`;
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

  const url = `${LOCAL_BASE_URL}/api/pinboards/add-pads`;
  const body = {
    action,
    board_id,
    object_id,
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
  const url = `${LOCAL_BASE_URL}/api/pinboards/update`;
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
  let _region = Array.isArray(region) ? region : [region];

  const regions = Array.isArray(region) ? region.map(r => `regions=${r}`).join('&') : `regions=${region}`;
  const url = `${LOCAL_BASE_URL}/api/countries?${regions}`;
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
  action: string = 'add'
) {
  if(!message || !platform) return;

  const url = `${LOCAL_BASE_URL}/api/comments`;
  const body = {
    object: 'pad',
    id,
    message,
    source,
    action,
  };

  const data = await get({
    url,
    method: 'POST',
    body,
  });
  return data;
}

export async function deleteComment(
  platform: string,
  id: number,
) {
  if(!platform) return;

  const url = `${LOCAL_BASE_URL}/api/comments`;
  const body = {
    comment_id: id,
    action: 'delete',
  };

  const data = await get({
    url,
    method: 'POST',
    body,
  });
  return data;
}
