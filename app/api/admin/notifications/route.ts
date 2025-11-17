import { NextRequest } from 'next/server';
import getSession from '@/app/lib/session';
import { createNotification, listNotifications, getNotification, patchNotification, getContributorInfo } from '@/app/lib/data/platform-api';
import { unauthorized } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const session = await getSession();
  const rights = session?.rights || 0;
  if (!session || rights < 4) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json();
  const required = body.type && body.payload;
  if (!required) return NextResponse.json({ error: 'type and payload required' }, { status: 400 });
  const notif = await createNotification({
    type: body.type,
    level: body.level || 'info',
    payload: body.payload,
    related_uuids: body.related_uuids || [],
    metadata: body.metadata || null,
    expires_at: body.expires_at || null,
    actor_uuid: body.actor_uuid || null,
  });
  return NextResponse.json(notif);
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  const rights = session?.rights || 0;
  if (!session || rights < 4) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (id) {
    const row = await getNotification(id);
    // enrich with actor details if present
    if (row && row.action_taken_by) {
      try {
        const actor = await getContributorInfo(row.action_taken_by);
        row.action_taken_by_details = {
          uuid: row.action_taken_by,
          fullName: actor?.fullName || actor?.name || '',
          email: actor?.email || '',
        };
      } catch (e) {
        // ignore enrichment errors
      }
    }
    return NextResponse.json({ data: row });
  }

  const limit = Number(url.searchParams.get('limit') || 20);
  const offset = Number(url.searchParams.get('offset') || 0);
  const filters: any = {};
  if (url.searchParams.get('status')) filters.status = url.searchParams.get('status');
  if (url.searchParams.get('type')) filters.type = url.searchParams.get('type');
  if (url.searchParams.get('level')) filters.level = url.searchParams.get('level');
  if (url.searchParams.get('q')) filters.query = url.searchParams.get('q');

  const rows = await listNotifications({ limit, offset, filters });
  return NextResponse.json({ data: rows, limit, offset });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  const rights = session?.rights || 0;
  if (!session || rights < 4) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json();
  const id = body.id;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  // Validate allowed statuses and sanitize client-provided actor fields
  const allowedStatuses = ['open', 'acknowledged', 'closed'];
  if (body.status && !allowedStatuses.includes(body.status)) {
    return NextResponse.json({ error: 'invalid status' }, { status: 400 });
  }

  // Prevent client from spoofing actor or timestamp - server will record session actor
  delete body.action_taken_by;
  delete body.action_taken_at;

  const actorUuid = session.uuid;
  await patchNotification(id, body, actorUuid);
  const updated = await getNotification(id);
  return NextResponse.json(updated);
}
