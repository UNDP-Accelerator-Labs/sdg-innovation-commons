import { NextResponse } from 'next/server';
import platformApi from '@/app/lib/data/platform-api';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('q') || '';

    const res = await platformApi(
          { page: 1, limit: 10, search: q, space: 'published' },
          'experiment', 
          'pinboards'
        );
    const data = Array.isArray(res) ? res : res?.data || [];

    const out = data.map((b: any) => ({ id: b.pinboard_id || b.id || b.pinboardId, title: b.title || b.name || b.pinboard_title, description: b.description }));
    return NextResponse.json(out);
  } catch (e) {
    console.error('GET /api/boards error', e);
    return NextResponse.json([], { status: 500 });
  }
}
