'use server';
import { session_info } from '@/app/lib/session';

export interface Props {
    url: string;
    method: string;
    body?: Record<string, any>; 
}

export default async function get({ url, method, body }: Props) {
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
        });

        if (!response?.ok) {
            throw new Error(`Error: ${response?.status} ${response?.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', url, error);
        return null;
    }
}
