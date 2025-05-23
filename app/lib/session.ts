'use server';
import { cookies } from 'next/headers';
import get from '@/app/lib/data/get';
import { commonsPlatform, baseHost, base_url as issuer } from '@/app/lib/utils';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { randomUUID } from 'crypto';

interface TokenPayload {
  uuid?: string;
  username?: string;
  rights?: number;
  pinboards?: any;
}
const TOKEN_EXPIRATION_MS = 2 * 60 * 60 * 1000; //2 hrs
const { NODE_ENV, APP_SESSION_KEY } = process.env;
const isLocalhost = NODE_ENV === 'development' || NODE_ENV === 'test';

export default async function getSession() {
  try {
    const cookieStore = await cookies();
    const s_id: string | null = await get_session_id();

    if (!s_id && !isLocalhost) {
      cookieStore.delete(APP_SESSION_KEY as string);
      console.log('No session ID found, returning null.');
      return null;
    }

    const base_url = commonsPlatform.find((p) => p.key === 'login')?.url;
    if (!base_url) {
      console.error('Base URL not found.');
      return null;
    }

    const session = await get({
      url: `${base_url}/apis/fetch/session?s_id=${s_id}`,
      method: 'GET',
    });

    if (!session?.uuid && !isLocalhost) {
      cookieStore.delete(APP_SESSION_KEY as string);
      console.log('Session UUID not found, returning null.');
      return null;
    }
    // Generate tokens for session
    let name: string | null = null;
    const localsession =
    {
      uuid: randomUUID(),
      username: 'localuser',
      rights: 3,
      pinboards: [],
    }

    if (isLocalhost) {
      name = await getToken({
        ...localsession
      });
    } else {
      name = await getToken({
        uuid: session?.uuid,
        username: session.username,
        rights: session.rights,
        pinboards: session?.pinboards,
      });
    }

    // Set cookies
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + TOKEN_EXPIRATION_MS),
      sameSite: 'lax' as const,
      path: '/',
    };

    cookieStore.set(APP_SESSION_KEY as string, name, cookieOptions);
    if (isLocalhost) {
      return localsession;
    }
    return session;
  } catch (error) {
    console.error('Error in getSession:', error);
    return null;
  }
}

export const get_session_id = async () => {
  const s_id: string =
    (await cookies()).get(`${process.env.APP_SUITE}-session`)?.value || '';
  if (!s_id) {
    return null;
  }
  return s_id?.split('.')[0]?.slice(2);
};

export const session_token = async () => {
  const { uuid, rights, username } = (await session_name()) || {};
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

export const session_name = async () => {
  const token: string | undefined = (await cookies()).get(APP_SESSION_KEY as string)
    ?.value as string;
  if (!token) return null;
  const name = verifyToken(token);
  return name;
};

export const is_user_logged_in = async () => {
  const name = await session_name();
  const s_id: string | null = await get_session_id();
  if (name && typeof name === 'object' && 'username' in name && s_id) {
    return !!name.username;
  }
  else if (isLocalhost) {
    return true;
  }
  return false;
};

export async function getToken({
  uuid,
  rights,
  username,
  pinboards,
}: TokenPayload) {
  const token = await jwt.sign(
    { uuid, rights, username, pinboards },
    process.env.APP_SECRET as string,
    {
      audience: 'user:known',
      issuer,
    }
  );
  return token;
}

export async function verifyToken(token: string) {
  try {
    const secret = process.env.APP_SECRET as string;

    const payload = jwt.verify(token, secret, {
      audience: 'user:known',
      issuer,
    }) as JwtPayload;

    return payload;
  } catch (err: any) {
    return null;
  }
}
