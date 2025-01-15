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

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      cookie: cookieHeader,
    };

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
        throw new Error(`Error: ${error.message}`);
      }
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}