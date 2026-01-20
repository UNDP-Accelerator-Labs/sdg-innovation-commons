/**
 * Authentication and session management service
 * Centralized authentication logic for the application
 * SERVER-ONLY module - use auth-client.ts for client components
 * @module lib/services/auth
 */

import 'server-only';
import { auth } from '@/auth';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import type { SessionInfo, ApiAuthResult } from '../types';
import { UserRights } from '../types';
import { AUTH_CONFIG } from '../config';

// Re-export client-safe utilities for convenience
export { redirectToLogin, hasRight, isAdminUser, getUserDisplayName } from './auth-client';

/**
 * Get the current user session from NextAuth
 * 
 * @returns Session information or null if not authenticated
 */
export async function getSession(): Promise<SessionInfo | null> {
  const session = await auth();
  
  if (!session?.user) {
    return null;
  }

  // Return session data in standardized format
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
}

/**
 * Generate a session token for legacy API compatibility
 * 
 * @returns JWT token or null if not authenticated
 */
export async function generateSessionToken(): Promise<string | null> {
  const session = await getSession();
  if (!session?.uuid || !AUTH_CONFIG.secret) return null;
  
  const token = jwt.sign(
    { 
      uuid: session.uuid, 
      rights: session.rights, 
      username: session.name 
    },
    AUTH_CONFIG.secret,
    {
      audience: AUTH_CONFIG.jwtAudience,
      issuer: AUTH_CONFIG.jwtIssuer || 'sdg-innovation-commons',
    }
  );
  
  return token;
}

/**
 * Check if user is logged in
 * 
 * @returns Boolean indicating if user is authenticated
 */
export async function isUserLoggedIn(): Promise<boolean> {
  const session = await getSession();
  return !!session?.uuid;
}

/**
 * Check authentication from either NextAuth session or API Bearer token
 * Allows API endpoints to work with both web sessions and API tokens
 * 
 * @param request - Next.js request object
 * @returns Authentication result with user information
 */
export async function getApiAuth(request: NextRequest): Promise<ApiAuthResult> {
  // First check for API token (from middleware headers)
  const apiAuthenticated = request.headers.get('x-api-authenticated');
  
  if (apiAuthenticated === 'true') {
    return {
      isAuthenticated: true,
      uuid: request.headers.get('x-api-user-uuid') || undefined,
      email: request.headers.get('x-api-user-email') || undefined,
      rights: parseInt(request.headers.get('x-api-user-rights') || '1'),
      source: 'api_token',
    };
  }

  // Fall back to NextAuth session
  const session = await auth();
  
  if (session?.user?.uuid) {
    return {
      isAuthenticated: true,
      uuid: session.user.uuid,
      email: session.user.email || undefined,
      rights: session.user.rights || 1,
      source: 'session',
    };
  }

  return {
    isAuthenticated: false,
    source: 'none',
  };
}

/**
 * Authorization helpers
 */

/**
 * Check if user can access private pads/content
 * 
 * @param session - User session information
 * @returns Boolean indicating if user has access
 */
export function canAccessPrivatePads(session: SessionInfo | null): boolean {
  if (!session) return false;
  return session.rights >= (UserRights.User as number);
}

/**
 * Check if user is an administrator
 * 
 * @param session - User session information
 * @returns Boolean indicating if user is admin
 */
export function isAdmin(session: SessionInfo | null): boolean {
  if (!session) return false;
  return session.rights >= (UserRights.Admin as number);
}

/**
 * Check if user is a contributor
 * 
 * @param session - User session information
 * @returns Boolean indicating if user can contribute
 */
export function isContributor(session: SessionInfo | null): boolean {
  if (!session) return false;
  return session.rights >= (UserRights.Contributor as number);
}

/**
 * Check if user has specific rights level
 * 
 * @param session - User session information
 * @param requiredRights - Required rights level
 * @returns Boolean indicating if user has required rights
 */
export function hasRights(session: SessionInfo | null, requiredRights: number): boolean {
  if (!session) return false;
  return session.rights >= requiredRights;
}

/**
 * Check if user owns or can access a resource
 * 
 * @param session - User session information
 * @param resourceOwnerUuid - UUID of resource owner
 * @returns Boolean indicating if user has access
 */
export function canAccessResource(session: SessionInfo | null, resourceOwnerUuid: string): boolean {
  if (!session) return false;
  
  // Admin can access everything
  if (isAdmin(session)) return true;
  
  // User can access their own resources
  if (session.uuid === resourceOwnerUuid) return true;
  
  // Check if user is a collaborator
  if (session.collaborators?.includes(resourceOwnerUuid)) return true;
  
  return false;
}

/**
 * Get current URL from headers
 * 
 * @param pathname - URL pathname
 * @returns Complete URL
 */
export async function getCurrentUrl(pathname: string): Promise<string> {
  const { headers } = await import('next/headers');
  const headersList = await headers();
  const host = headersList.get('host');
  const referer = headersList.get('referer');

  if (referer) {
    return referer;
  }

  const protocol = host?.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}${pathname ?? ''}`;
}

/**
 * Legacy alias for getSession
 * @deprecated Use getSession instead
 * @param _request - Unused parameter for backward compatibility
 */
export async function getSessionInfo(_request?: NextRequest): Promise<SessionInfo | null> {
  // Note: The old getSessionInfo accepted a request parameter for JWT token validation,
  // but NextAuth v5 handles authentication differently through middleware.
  // If you need API token support, use getApiAuth instead.
  return getSession();
}
