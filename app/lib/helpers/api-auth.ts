import { NextRequest } from 'next/server';
import { auth } from '@/auth';

export interface ApiAuthResult {
  isAuthenticated: boolean;
  uuid?: string;
  email?: string;
  rights?: number;
  source: 'session' | 'api_token' | 'none';
}

/**
 * Check authentication from either NextAuth session or API Bearer token
 * This allows API endpoints to work with both web sessions and API tokens
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
