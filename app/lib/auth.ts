'use server';
import { redirect } from "next/navigation";
import { headers } from 'next/headers'
import { commonsPlatform, baseHost } from '@/app/lib/utils';
import { DB } from '@/app/lib/db';
import jwt from 'jsonwebtoken'

interface TokenPayload {
  uuid: string;
  rights: number;
}

export async function redirectToLogin(pathname: string) {
  const url: string | undefined = commonsPlatform.find((p: any) => p.key === 'login')?.url
  const app_name = 'SDG Commons'
  const host = await getCurrentUrl(pathname)
  return redirect(`${url}/login?app=${encodeURIComponent(app_name)}&origin=${host}`)
}


export async function getCurrentUrl(pathname: string) {
  const headersList = await headers();
  const host = headersList.get('host');
  const referer = headersList.get('referer');

  if (referer) {
    return referer;
  }

  const protocol = host?.includes('localhost') ? 'http' : 'https';

  return `${protocol}://${host}${pathname ?? ''}`;
}

export async function logout(uuid: string) {
  try {
    await DB.general.oneOrNone(`
      UPDATE session 
        SET sess = jsonb_build_object(
          'cookie', sess -> 'cookie',
          'sessions', sess -> 'sessions',
          'uuid', null,
          'username', null,
          'email', null,
          'team', sess -> 'team',
          'collaborators', sess -> 'collaborators',
          'rights', sess -> 'rights',
          'public', sess -> 'public',
          'language', sess -> 'language',
          'country', sess -> 'country',
          'app', sess -> 'app',
          'device', sess -> 'device',
          'is_trusted', sess -> 'is_trusted',
          'confirm_dev_origins', sess -> 'confirm_dev_origins'
        )
      WHERE sess->>'uuid' = $1;
    `, [uuid]);
    return redirect('/');
  } catch (err) {
    console.error('Error during logout:', err);
    return redirect('/');
  }
}

export async function getToken({ uuid, rights }: TokenPayload) {
  const token = await jwt.sign(
    { uuid, rights },
    process.env.APP_SECRET as string, 
    { audience: 'user:known', issuer: baseHost?.slice(1) }
  );
  return token;
}


