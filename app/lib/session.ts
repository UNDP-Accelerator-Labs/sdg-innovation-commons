import { auth } from '@/auth';
import jwt from 'jsonwebtoken';

const { APP_SECRET } = process.env;

// Simplified session helper using NextAuth
export const getSession = async () => {
  const session = await auth();
  
  if (!session?.user) {
    return null;
  }

  // Return session data in the format expected by the app
  return {
    uuid: session.user.uuid,
    email: session.user.email || '',
    name: session.user.name || '',
    rights: session.user.rights || 0,
    iso3: session.user.iso3 || '',
    language: session.user.language,
    bureau: session.user.bureau,
    collaborators: session.user.collaborators || [],
    pinboards: session.user.pinboards || [],
    is_trusted: session.user.is_trusted || false,
    loginTime: new Date().toISOString(),
  };
};

/**
 * Generate session token for legacy compatibility
 */
export const session_token = async () => {
  const session = await getSession();
  if (!session?.uuid) return null;
  
  const token = jwt.sign(
    { 
      uuid: session.uuid, 
      rights: session.rights, 
      username: session.name 
    },
    APP_SECRET!,
    {
      audience: 'user:known',
      issuer: 'sdg-innovation-commons.org',
    }
  );
  return token;
};

/**
 * Check if user is logged in
 */
export const is_user_logged_in = async () => {
  const session = await getSession();
  return !!session?.name;
};

// Stub functions for legacy compatibility - these are no longer used with NextAuth
export const deleteSession = async (sessionId: string): Promise<boolean> => {
  console.warn('deleteSession called but NextAuth handles session cleanup automatically');
  return true;
};

export const clearSessionCookies = async (): Promise<void> => {
  console.warn('clearSessionCookies called but NextAuth handles cookies automatically');
};

export const deleteUserSessions = async (uuid: string): Promise<boolean> => {
  console.warn('deleteUserSessions called but NextAuth manages sessions automatically');
  return true;
};

export default getSession;
