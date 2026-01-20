/**
 * Legacy session module - DEPRECATED
 * @deprecated Use '@/app/lib/services/auth' instead
 * 
 * This file is maintained for backward compatibility.
 * All new code should import from the services folder.
 * 
 * Migration:
 * - import { getSession } from '@/app/lib/session' 
 *   => import { getSession } from '@/app/lib/services/auth'
 */

export { 
  getSession, 
  generateSessionToken as session_token,
} from './services/auth';

/**
 * Check if user is logged in
 */
export const is_user_logged_in = async () => {
  const { getSession } = await import('./services/auth');
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

// Re-export getSession as default for legacy compatibility
export { getSession as default } from './services/auth';
