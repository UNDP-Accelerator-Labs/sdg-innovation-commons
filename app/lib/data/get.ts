/**
 * Legacy HTTP request module - DEPRECATED
 * @deprecated Use '@/app/lib/services/http' instead
 * 
 * This file is maintained for backward compatibility.
 * All new code should import from the services folder.
 * 
 * Migration:
 * - import get from '@/app/lib/data/get' 
 *   => import { httpRequest } from '@/app/lib/services/http'
 */

'use server';

import { httpRequest } from '@/app/lib/services/http';
import type { HttpMethod } from '@/app/lib/types';

export interface Props {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, any>;
  cache?: Record<string, any>;
}

export default async function get({ url, method, body, cache }: Props) {
  return httpRequest(url, {
    method: method as HttpMethod,
    data: body,
  });
}