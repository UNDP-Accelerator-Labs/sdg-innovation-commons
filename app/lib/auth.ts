'use server';
import { redirect } from "next/navigation";
import { headers } from 'next/headers'
import { commonsPlatform, baseHost } from '@/app/lib/utils';

export async function redirectToLogin(pathname: string) {
  const url: string | undefined = commonsPlatform.find((p: any) => p.key === 'login')?.url
  const app_name = 'SDG Commons'
  const host = await getCurrentUrl(pathname)
  // return redirect(`${url}/login?app=${encodeURIComponent(app_name)}&origin=${host}`)
  return redirect(`/login`)
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



