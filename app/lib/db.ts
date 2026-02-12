/**
 * Legacy database module - DEPRECATED
 * @deprecated Use '@/app/lib/services/database' instead
 * 
 * This file is maintained for backward compatibility.
 * All new code should import from the services folder.
 * 
 * Migration:
 * - import { query } from '@/app/lib/db' 
 *   => import { query } from '@/app/lib/services/database'
 */

export * from './services/database';
export { default } from './services/database';
