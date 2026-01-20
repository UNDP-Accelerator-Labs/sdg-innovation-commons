/**
 * Legacy auth module - DEPRECATED
 * @deprecated Use '@/app/lib/services/auth' or '@/app/lib/services/auth-client' instead
 * 
 * This file is maintained for backward compatibility.
 * All new code should import from the services folder.
 * 
 * Migration:
 * - Client components: import from '@/app/lib/services/auth-client'
 * - Server components: import from '@/app/lib/services/auth'
 */

// Export only client-safe functions to avoid bundling server-only code
export { redirectToLogin, hasRight, isAdminUser, getUserDisplayName } from './services/auth-client';



