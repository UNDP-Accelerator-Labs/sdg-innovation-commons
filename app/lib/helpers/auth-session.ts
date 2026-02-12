/**
 * Legacy auth-session helper - DEPRECATED
 * @deprecated Use '@/app/lib/services/auth' instead
 * 
 * Migration:
 * - getSessionInfo => '@/app/lib/services/auth'
 * - SessionInfo type => '@/app/lib/types/auth'
 */

export { getSessionInfo } from '../services/auth';
export type { SessionInfo } from '../types/auth';
