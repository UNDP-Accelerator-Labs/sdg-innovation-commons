'use server';
import { cookies } from 'next/headers';
import get from '@/app/lib/data/get';
import { commonsPlatform, baseHost, LOCAL_BASE_URL } from '@/app/lib/utils';
import { SignJWT, jwtVerify } from 'jose'
import jwt from 'jsonwebtoken'
 
interface TokenPayload {
    uuid?: string;
    username?: string;
    rights?: number;
    pinboards?: any;
}
 
const TOKEN_EXPIRATION_MS = 2 * 60 * 60; //2 mins
 
export default async function getSession() {
    try {
        const cookieStore = await cookies();
        const s_id: string | null = await get_session_id();
 
        if (!s_id) {
            cookieStore.delete('_uuid_token');
            cookieStore.delete('_uuid_platform');
            console.log('No session ID found, returning null.');
            return null;
        }
 
        const [currtoken, currname]: [string | null, any] = await Promise.all([
            session_info(),
            session_name(),
        ]);
 
        if (currname?.username && currtoken) {
            console.log('Valid session, returning.');
            return { username: currname.username, token: currtoken };
        }
 
        const base_url = commonsPlatform.find(p => p.key === 'solution')?.url;
        if (!base_url) {
            console.error('Base URL not found.');
            return null;
        }
 
        const session = await get({
            url: `${base_url}/apis/fetch/session?s_id=${s_id}`,
            method: 'GET',
        });
 
        if (!session?.uuid) {
            cookieStore.delete('_uuid_token');
            cookieStore.delete('_uuid_platform');
            console.log('Session UUID not found, returning null.');
            return null;
        }
 
        // Generate tokens concurrently
        const [token, name] = await Promise.all([
            getToken({ uuid: session.uuid, rights: session.rights, pinboards: session?.pinboards }),
            getToken({ username: session.username, rights: session.rights, pinboards: session?.pinboards }),
        ]);
 
        // Set cookies
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + TOKEN_EXPIRATION_MS),
            sameSite: 'lax' as const,
            path: '/',
        };
 
        cookieStore.set('_uuid_token', token, cookieOptions);
        cookieStore.set('_uuid_platform', name, cookieOptions);
 
        return session;
    } catch (error) {
        console.error('Error in getSession:', error);
        return null;
    }
}
 
 
export const get_session_id = async () => {
    const s_id: string = (await cookies()).get(`${process.env.APP_SUITE}-session`)?.value || '';
    if (!s_id) {
        return null
    }
    return s_id?.split('.')[0]?.slice(2);
}
 
export const session_info = async () => {
    const token: string|undefined = (await cookies()).get('_uuid_token')?.value
    if (!token) return null;
    return token;
}
 
export const session_name = async () => {
    const token: string|undefined = (await cookies()).get('_uuid_platform')?.value as string
    if (!token) return null;
    const name = verifyToken(token)
    return name;
}
 
 
export const is_user_logged_in = async () => {
    const name = await session_name();
    if (name && typeof name === 'object' && 'username' in name) {
        return !!name.username;
    }
    return false;
};
 
export async function getToken({ uuid, rights, username, pinboards }: TokenPayload) {
    const token = await jwt.sign(
        { uuid, rights, username, pinboards },
        process.env.APP_SECRET as string,
        { audience: 'user:known', issuer: baseHost?.slice(1) }
    );
    return token;
}
 
const encodedKey = new TextEncoder().encode(process.env.APP_SECRET)
 
export async function encrypt(payload: any) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
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
 
export async function verifyToken(token: string) {
    try {
        const secret = process.env.APP_SECRET as string;
        const issuer = baseHost?.slice(1);
 
        const payload = jwt.verify(token, secret, {
            audience: 'user:known',
            issuer: issuer,
        });
 
        return payload;
    } catch (err: any) {
        return null;
    }
}