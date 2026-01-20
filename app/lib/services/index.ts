/**
 * Services barrel export
 * Centralized access to all service modules
 * @module lib/services
 * 
 * NOTE: Only export server-side functions here.
 * Client components cannot import from this module.
 */

// Database service - server only
export * from './database';

// Authentication service - server only  
export * from './auth';

// Email service - server only
export * from './email';

// HTTP client service - server only
export * from './http';
