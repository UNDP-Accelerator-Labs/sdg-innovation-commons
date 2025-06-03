'use server';
import get from '@/app/lib/data/get';
import { commonsPlatform, baseHost } from '@/app/lib/utils';
import jwt from 'jsonwebtoken';
import {cache} from 'react';

const  getSession = cache(async () => { 
  try {
    const base_url = commonsPlatform.find((p) => p.key === 'login')?.url;
    if (!base_url) {
      console.error('Base URL not found.');
      return null;
    }

    const data = await get({
      url: `${base_url}/apis/fetch/session`,
      method: 'GET',
    });


    if (data?.status !== 200) {
      return null;
    }

    const { session } = data;
    return session;
  } catch (error) {
    console.error('Error in getSession:', error);
    return null;
  }
})


export const session_token = async () => {
  const { uuid, rights, username } = (await getSession()) || {};
  if (!uuid) return null;
  const token = await jwt.sign(
    { uuid, rights, username },
    process.env.APP_SECRET as string,
    {
      audience: 'user:known',
      issuer: baseHost?.slice(1),
    }
  );
  return token;
};

export const is_user_logged_in = async () => {
  const name = await getSession();
  if (name && typeof name === 'object' && 'username' in name) {
    return !!name.username;
  }
  return false;
};

export default getSession;