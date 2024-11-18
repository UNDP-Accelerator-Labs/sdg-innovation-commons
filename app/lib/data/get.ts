'use server';
import { cookies } from 'next/headers'

export interface Props {
    url: string;
    method: string;
    body?: Record<string, any>; 
}

export default async function get({ url, method, body }: Props) {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('x-access-token')?.value;

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };
        /*
        if (token) {
            headers["x-access-token"] = token;
        }
        */

        const response = await fetch(url, {
            method,
            headers,
            ...(method !== 'GET' && { body: JSON.stringify(body) }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
}
