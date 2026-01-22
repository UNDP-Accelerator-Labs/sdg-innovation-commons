import 'server-only';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';
import { query } from '@/app/lib/services/database';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const { email, password } = credentials;

        // Get user info with all related data
        const userQuery = `
          SELECT u.uuid, u.rights, u.name, u.email, u.iso3, u.password,
            u.language,
            COALESCE(su.undp_bureau, adm0.undp_bureau) AS bureau,
            COALESCE(
              (SELECT json_agg(DISTINCT(jsonb_build_object(
                'uuid', u2.uuid,
                'name', u2.name,
                'rights', u2.rights
              ))) FROM team_members tm
              INNER JOIN teams t ON t.id = tm.team
              INNER JOIN users u2 ON u2.uuid = tm.member
              WHERE t.id IN (SELECT team FROM team_members WHERE member = u.uuid)
            )::TEXT, '[]')::JSONB AS collaborators,
            COALESCE(
              (SELECT json_agg(DISTINCT(p.id))
              FROM pinboards p
              WHERE p.id IN (
                SELECT pinboard FROM pinboard_contributors
                WHERE participant = u.uuid
              ) OR p.owner = u.uuid
              )::TEXT, '[]')::JSONB AS pinboards
          FROM users u
          LEFT JOIN adm0_subunits su ON su.su_a3 = u.iso3
          LEFT JOIN adm0 ON adm0.adm0_a3 = u.iso3
          WHERE u.email = $1 OR u.name = $1
        `;

        const userResult = await query('general', userQuery, [email]);

        if (!userResult || userResult.rowCount === 0) {
          return null;
        }

        const user = userResult.rows[0];

        // Verify password
        const passwordMatch = await bcrypt.compare(
          password as string,
          user.password
        );

        if (!passwordMatch) {
          return null;
        }

        // Update last login
        await query(
          'general',
          `UPDATE users SET last_login = NOW() WHERE uuid = $1`,
          [user.uuid]
        );

        // Return user object (without password)
        return {
          id: user.uuid,
          uuid: user.uuid,
          name: user.name,
          email: user.email,
          rights: user.rights,
          iso3: user.iso3,
          language: user.language,
          bureau: user.bureau,
          collaborators: user.collaborators,
          pinboards: user.pinboards,
          is_trusted: false,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.APP_SECRET,
});
