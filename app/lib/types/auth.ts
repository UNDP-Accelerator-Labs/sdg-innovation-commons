/**
 * Authentication and session type definitions
 * @module lib/types/auth
 */

/**
 * User session information
 */
export interface SessionInfo {
  uuid: string;
  email: string;
  name: string;
  rights: number;
  iso3: string;
  language?: string;
  bureau?: string;
  collaborators?: string[];
  pinboards?: number[];
  is_trusted?: boolean;
  trusted_domain?: string;
  loginTime: string;
}

/**
 * API authentication result from token or session
 */
export interface ApiAuthResult {
  isAuthenticated: boolean;
  uuid?: string;
  email?: string;
  rights?: number;
  source: 'session' | 'api_token' | 'none';
}

/**
 * User rights levels
 */
export enum UserRights {
  Guest = 0,
  User = 1,
  Contributor = 2,
  Admin = 3,
  SuperAdmin = 4,
}

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  email: string;
  password: string;
  originalUrl?: string;
  is_trusted?: boolean;
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password update request
 */
export interface PasswordUpdateRequest {
  password: string;
  confirmPassword: string;
  token: string;
}

/**
 * Token validation response
 */
export interface TokenValidationResponse {
  valid: boolean;
  message?: string;
  userId?: string;
}
