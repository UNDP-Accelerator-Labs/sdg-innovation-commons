'use server';

export interface Props {
    url: string;
    method: string;
    body?: Record<string, any>; 
}

export default async function get({ url, method, body }: Props) {
    try {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
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
