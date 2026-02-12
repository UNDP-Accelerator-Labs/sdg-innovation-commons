/**
 * Client-safe auth utilities
 * Functions that can be used in both client and server components
 * @module lib/services/auth-client
 */

import { redirect as nextRedirect } from 'next/navigation';
import type { UserRights } from '../types';

/**
 * Redirect to login page
 * Can be used in both client and server components
 * 
 * @param pathname - Current pathname to redirect back after login
 */
export function redirectToLogin(pathname?: string): never {
  return nextRedirect(`/login`);
}

/**
 * Check if a user has a specific right (client-side check)
 * 
 * @param userRights - User's rights value
 * @param requiredRight - The right to check for
 * @returns True if user has the required right
 */
export function hasRight(userRights: number, requiredRight: number): boolean {
  return (userRights & requiredRight) === requiredRight;
}

/**
 * Check if a user is an admin (client-side check)
 * 
 * @param userRights - User's rights value
 * @returns True if user is an admin
 */
export function isAdminUser(userRights: number): boolean {
  return hasRight(userRights, 1); // 1 is admin right
}

/**
 * Get user display name from session data
 * 
 * @param user - User object with name/email
 * @returns Display name or email
 */
export function getUserDisplayName(user: { name?: string; email?: string } | null): string {
  if (!user) return 'Guest';
  return user.name || user.email || 'User';
}
