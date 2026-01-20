/**
 * Main library barrel export
 * Centralized access to all library modules
 * @module lib
 * 
 * WARNING: This file exports server-only code.
 * Client components should import specific utilities from @/app/lib/utils
 */

// Types - safe for both client and server
export * from './types';

// Configuration - safe for both client and server
export * from './config';

// Utilities - safe for both client and server
export * from './utils';

// Services - SERVER ONLY - do not import in client components
// export * from './services';

// Legacy exports for backward compatibility - SERVER ONLY
export { query as dbQuery, getClient as getDbClient } from './services/database';
export { getSession, generateSessionToken as session_token } from './services/auth';
export { httpRequest as get } from './services/http';
