import fs from 'fs';
import path from 'path';
import getSession from '@/app/lib/session';
import jwt from 'jsonwebtoken';
import { baseHost } from '@/app/lib/utils';

export async function GET(req: Request) {
  try {
    // Allow either cookie-based session or a bearer JWT issued by session_token()
    let authorized = false;

    // 1) Check Authorization header
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        if (!process.env.APP_SECRET) throw new Error('APP_SECRET not configured');
        jwt.verify(token, process.env.APP_SECRET as string, {
          audience: 'user:known',
          issuer: baseHost?.slice(1) || undefined,
        } as any);
        authorized = true;
      } catch (e) {
        // invalid token — fall through to cookie check
        console.warn('Invalid bearer token for worker-health:', e);
      }
    }

    // 2) Fallback: cookie/session
    if (!authorized) {
      const session = await getSession();
      if (session && session.username && session.rights >= 4) authorized = true;
    }

    if (!authorized) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const base = process.env.NODE_ENV === 'production' ? process.cwd() : process.cwd();
    const heartbeatPath = path.join(base, 'App_Data', 'jobs', 'continuous', 'worker', 'worker.heartbeat.json');
    let data: any = null;
    if (fs.existsSync(heartbeatPath)) {
      const raw = fs.readFileSync(heartbeatPath, 'utf8');
      try { data = JSON.parse(raw); } catch (e) { data = null; }
    }

    const status = {
      worker: {
        pid: data?.pid || null,
        uptime: data?.uptime || null,
        lastSeen: data?.timestamp || null,
      },
      now: new Date().toISOString(),
      path: heartbeatPath,
    };

    return new Response(JSON.stringify(status), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
