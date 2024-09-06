import 'server-only'
import { cookies } from 'next/headers'

export async function getSession() {
    const session = cookies().get(`${process.env.APP_SUITE}-session`)
    return session
}

//TODO - LINK THE APP DIRRECTLY TO THE SESSION STORE
// import nextSession from "next-session";
// import { expressSession, promisifyStore } from "next-session/lib/compat";
// const PgSession = require('connect-pg-simple')(expressSession);
// import { baseHost } from './utils'
// import { DB } from './db';

// export const getSession = nextSession({
//     name: `${process.env.APP_SUITE}-session`,
//     store: promisifyStore(
//         new PgSession({ pgPromise: DB.general })
//     ),
//     cookie: {
//       domain: process.env.NODE_ENV === 'production' ? baseHost : undefined,
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 1 * 1000 * 60 * 60 * 24 * 1, // 1 day
//       sameSite: 'lax',
//     },
// });
