'use server';
import { cookies } from 'next/headers'
import get from '@/app/lib/data/get';
import { commonsPlatform, baseHost, LOCAL_BASE_URL } from '@/app/lib/utils';
import { SignJWT, jwtVerify } from 'jose'
import jwt from 'jsonwebtoken'

interface TokenPayload {
  uuid: string;
  rights: number;
}

export default async function getSession() {
    const s_id: string | null = await get_session_id()
    if (!s_id) {
        return null
    }

    const base_url: string | undefined = process.env.NODE_ENV != 'production' ? LOCAL_BASE_URL
        : commonsPlatform
            .find(p => p.key === 'login')?.url;

    const session = await get({
        url: `${base_url}/apis/fetch/session?s_id=${s_id}`,
        method: 'GET',
    });

    if (!session.uuid) return null

    const token: string = await getToken({uuid: session?.uuid, rights: session?.rights });
    (await cookies()).set('_uuid_token', token);

    return session
}

export const get_session_id = async () => {
    const s_id: string = (await cookies()).get(`${process.env.APP_SUITE}-session`)?.value || '';
    if (!s_id) {
        return null
    }
    return s_id?.split('.')[0]?.slice(2);
}

export const session_info = async () => {
    const sess = decrypt((await cookies()).get('session')?.value)
    return sess;
}


export async function getToken({ uuid, rights }: TokenPayload) {
    const token = await jwt.sign(
      { uuid, rights },
      process.env.APP_SECRET as string, 
      { audience: 'user:known', issuer: baseHost?.slice(1), expiresIn: '2m' }
    );
    return token;
}

const encodedKey = new TextEncoder().encode(process.env.APP_SECRET)

export async function encrypt(payload: any) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1d')
        .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        console.log('Failed to verify session')
    }
}