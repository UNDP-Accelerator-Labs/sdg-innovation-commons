/**
 * Legacy api-auth helper - DEPRECATED
 * @deprecated Use '@/app/lib/services/auth' instead
 * 
 * Migration:
 * - getApiAuth => '@/app/lib/services/auth'
 * - ApiAuthResult type => '@/app/lib/types/auth'
 */

export { getApiAuth } from '../services/auth';
export type { ApiAuthResult } from '../types/auth';
