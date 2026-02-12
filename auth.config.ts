import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import db from '@/app/lib/db';

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdminPage = nextUrl.pathname.startsWith('/admin');
      // Only protect /profile (own profile), not /profile/[uuid] (other users' profiles)
      const isOnOwnProfilePage = nextUrl.pathname === '/profile';
      
      if (isOnAdminPage || isOnOwnProfilePage) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // Initial sign in
        token.uuid = user.uuid;
        token.name = user.name;
        token.email = user.email;
        token.rights = user.rights;
        token.iso3 = user.iso3;
        token.language = user.language;
        token.bureau = user.bureau;
        token.collaborators = user.collaborators;
        token.pinboards = user.pinboards;
        token.is_trusted = user.is_trusted;
        
        // Save session to database
        try {
          const sessionData = {
            user_uuid: user.uuid,
            user_name: user.name,
            user_email: user.email,
            user_rights: user.rights,
            login_time: new Date().toISOString(),
          };
          
          // Generate a unique session ID
          const sessionId = `sess_${user.uuid}_${Date.now()}`;
          
          await db.query(
            'general',
            `INSERT INTO session (sid, sess, expire) VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
            [sessionId, JSON.stringify(sessionData)]
          );
          
          // Store session ID in token for later deletion
          token.sessionId = sessionId;
        } catch (error) {
          console.error('Error saving session to database:', error);
        }
      }
      
      if (trigger === 'update' && session) {
        // Handle session updates
        return { ...token, ...session };
      }
      
      return token;
    },
    async session({ session, token }) {
      // Add custom fields to session
      if (token) {
        session.user.uuid = token.uuid as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.rights = token.rights as number;
        session.user.iso3 = token.iso3 as string;
        session.user.language = token.language as string;
        session.user.bureau = token.bureau as string;
        session.user.collaborators = token.collaborators as any[];
        session.user.pinboards = token.pinboards as any[];
        session.user.is_trusted = token.is_trusted as boolean;
        session.user.sessionId = token.sessionId as string;
      }
      return session;
    },
  },
  providers: [], // Will be added in auth.ts
  trustHost: true,
  debug: process.env.NODE_ENV === 'development',
} satisfies NextAuthConfig;
