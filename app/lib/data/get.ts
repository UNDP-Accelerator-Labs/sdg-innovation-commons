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
        // const token = await session_info();
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };
        // if (token) {
        //     headers["x-access-token"] = token;
        // }

        const response = await fetch(url, {
            method,
            credentials: 'include',
            headers,
            ...(method !== 'GET' && { body: JSON.stringify(body) }),
            ...(cache ? cache : '')
        });

        if (!response.ok) {
            if (response.status === 400) {
                try {
                    const responseData = await response.json();
                    if (responseData?.message) {
                        return [];
                    }
                    return responseData;
                } catch {
                    throw new Error(`Error parsing JSON for status 400`);
                }
            } else {
                throw new Error(`Error: `);
            }
        }

        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            const responseData = await response.json();
            return responseData;
        } else {
            const textResponse = await response.text();
            return { status: 200, message: 'Success', data: textResponse };
        }
    } catch (error) {
        console.log('Fetch error:', url, error);
        return null;
    }
}

