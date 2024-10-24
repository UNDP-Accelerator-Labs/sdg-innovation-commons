'use server';
import { cookies } from 'next/headers'
import { DB } from '@/app/lib/db';

export default async function getSession(withUserInfo: Boolean) {
    const s_id: string = (await cookies()).get(`${process.env.APP_SUITE}-session`)?.value || ''
    if (!s_id) {
        return null
    }

    let split = s_id?.split('.')[0]?.slice(2)
    const session = await DB.general.oneOrNone(`
        SELECT sess
        FROM public.session
        WHERE sid = $1
        AND expire > NOW()
        AND sess->>'uuid' IS NOT NULL;
    `, [split], d => d?.sess ?? null)

 
    if (withUserInfo && session) {
        const user = await DB.general.oneOrNone(`
            SELECT *
            FROM public.users
            WHERE uuid = $1
        `, [session?.uuid])
        if (user) delete user.password

        return { user, session }
    }

    return session
}
