'use server';
import { session_info } from '@/app/lib/session';

export interface Props {
    url: string;
    method: string;
    body?: Record<string, any>; 
    cache?: Record<string, any>; 
}

export default async function get({ url, method, body, cache }: Props) {
    try {
        const token = await session_info()
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers["x-access-token"] = token;
        }

        const response = await fetch(url, {
            method,
            credentials: 'include',
            headers,
            ...(method !== 'GET' && { body: JSON.stringify(body) }),
            ...(cache ? cache : '')
        });

        const responseData = await response.json();

        if (!response.ok) {
            if (response.status === 400) {
                if (responseData?.message) {
                    return [];
                }
                return responseData;
            } else {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
        }

        return responseData;
    } catch (error) {
        console.log('Fetch error:', url, error);
        return null;
    }
}
