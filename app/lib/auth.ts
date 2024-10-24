'use server';
import { redirect } from "next/navigation";
import { headers } from 'next/headers'
import { commonsPlatform } from '@/app/lib/utils';
import { DB } from '@/app/lib/db';

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
      DELETE FROM public.session
      WHERE sess->>'uuid' = $1;
    `, [uuid]);
    return redirect('/');
  } catch (err) {
    console.error('Error during logout:', err);
    return redirect('/');
  }
}

