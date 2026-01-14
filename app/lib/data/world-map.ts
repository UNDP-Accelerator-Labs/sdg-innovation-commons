'use server';
import { headers } from 'next/headers';

interface layerProps {
	iso3: string;
	count: number;
	lat: number;
	lng: number;
	type: string;
	color?: string;
}

interface Props {
	platform?: string;
	projsize?: number;
	base_color?: string;
	background_color?: string;
	layers?: layerProps[];
	simplification?: number;
}

export default async function worldMap({
	platform,
	projsize,
	base_color,
	background_color,
	layers,
	simplification,
}: Props) {
	try {
		// Use local API endpoint instead of external platform API
		const headersList = await headers();
		const host = headersList.get('host') || 'localhost:3000';
		const protocol = headersList.get('x-forwarded-proto') || 'http';
		const baseUrl = `${protocol}://${host}`;
		
		const response = await fetch(`${baseUrl}/api/map`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				projsize: projsize ?? 1440 * 0.75,
				base_color: base_color || '#000',
				background_color: background_color || 'transparent',
				layers: layers || [],
				simplification: simplification || 10,
			}),
		});

		if (!response.ok) {
			const error = await response.json();
			return { 
				status: response.status, 
				message: error.message || 'Failed to generate map' 
			};
		}

		const data = await response.json();
		return { status: 200, file: data.file };
	} catch (error) {
		console.error('Error generating world map:', error);
		return { 
			status: 500, 
			message: error instanceof Error ? error.message : 'Unknown error' 
		};
	}
}