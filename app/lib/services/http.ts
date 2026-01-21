/**
 * HTTP client service for making API requests
 * Handles cookie forwarding and common request patterns
 * @module lib/services/http
 */

'use server';

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { cookies } from 'next/headers';
import type { HttpMethod } from '../types';

/**
 * Make an HTTP request with cookie forwarding
 * 
 * @param url - The URL to request
 * @param options - Request configuration options
 * @returns The response data
 * @throws Error if the request fails
 */
export async function httpRequest<T = any>(
  url: string,
  options: AxiosRequestConfig & { method?: HttpMethod } = {}
): Promise<T> {
  try {
    // Forward cookies for server-to-server API calls
    // This ensures authentication works when server components call API routes
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');

    const config: AxiosRequestConfig = {
      ...options,
      url,
      method: options.method || 'GET',
      headers: {
        ...options.headers,
        Cookie: cookieHeader,
      },
    };

    const response: AxiosResponse<T> = await axios(config);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      // For HTTP errors with response data, log but return the data
      // This allows the application to handle API error responses gracefully
      if (error.response) {
        const message = `[HTTP Error] Request failed with status code ${error.response.status}`;
        console.error(message, {
          status: error.response.status,
          data: error.response.data,
            url,
        });
        // Return the error response data so the caller can handle it
        return error.response.data as T;
      }
      
      // For network errors without response, throw
      throw new Error(`[HTTP Error] ${error.message}`);
    }
    throw error;
  }
}

/**
 * Make a GET request
 */
export async function httpGet<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  return httpRequest<T>(url, { ...config, method: 'GET' });
}

/**
 * Make a POST request
 */
export async function httpPost<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  return httpRequest<T>(url, { ...config, method: 'POST', data });
}

/**
 * Make a PUT request
 */
export async function httpPut<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  return httpRequest<T>(url, { ...config, method: 'PUT', data });
}

/**
 * Make a DELETE request
 */
export async function httpDelete<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  return httpRequest<T>(url, { ...config, method: 'DELETE' });
}
