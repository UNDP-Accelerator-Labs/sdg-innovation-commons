'use server';
import axios from 'axios';
import { cookies } from 'next/headers';

export interface Props {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, any>;
  cache?: Record<string, any>;
}

export default async function get({ url, method, body, cache }: Props) {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

    const { NODE_ENV, JWT_TOKEN } = process.env;
    const isLocalhost = NODE_ENV === 'development' || NODE_ENV === 'test';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      cookie: cookieHeader,
    };

    // Add x-access-token if running in localhost
    if (isLocalhost && JWT_TOKEN) {
      headers['x-access-token'] = JWT_TOKEN;
    }

    const response = await axios({
      url,
      method,
      headers,
      data: method !== 'GET' ? body : undefined,
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        try {
          const responseData = error.response.data;
          if (responseData?.message) {
            return [];
          }
          return responseData;
        } catch {
          throw new Error('Error parsing JSON for status 400');
        }
      } else {
        console.error('Error:', error?.message);
        throw new Error(`Error occurred...`);
      }
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}