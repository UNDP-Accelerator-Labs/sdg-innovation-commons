/**
 * Authentication validation utilities
 * Centralized validation logic for authentication operations
 * @module lib/utils/auth-validation
 */

import { AUTH_CONFIG } from '../config/constants';

/**
 * Password validation result
 */
export interface PasswordValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Email validation result
 */
export interface EmailValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Validate password against security requirements
 * @param password - Password to validate
 * @returns Validation result with error message if invalid
 */
export function validatePassword(password: string): PasswordValidationResult {
  if (!password) {
    return {
      isValid: false,
      error: 'Password is required.',
    };
  }

  if (password.length < AUTH_CONFIG.PASSWORD_MIN_LENGTH) {
    return {
      isValid: false,
      error: `Password must be at least ${AUTH_CONFIG.PASSWORD_MIN_LENGTH} characters long.`,
    };
  }

  if (AUTH_CONFIG.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter.',
    };
  }

  if (AUTH_CONFIG.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter.',
    };
  }

  if (AUTH_CONFIG.PASSWORD_REQUIRE_NUMBER && !/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one number.',
    };
  }

  if (AUTH_CONFIG.PASSWORD_REQUIRE_SPECIAL_CHAR && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one special character.',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns Validation result
 */
export function validateEmail(email: string): EmailValidationResult {
  if (!email) {
    return {
      isValid: false,
      error: 'Email is required.',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address.',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validate password confirmation
 * @param password - Original password
 * @param confirmPassword - Confirmation password
 * @returns Validation result
 */
export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string
): { isValid: boolean; error: string | null } {
  if (!confirmPassword) {
    return {
      isValid: false,
      error: 'Please confirm your password.',
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match.',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Check if UNDP SSO authentication is enabled
 * @returns True if UNDP SSO is enabled
 */
export function isUndpSsoEnabled(): boolean {
  return AUTH_CONFIG.ENABLE_UNDP_SSO;
}

/**
 * Check if standard email authentication is enabled
 * @returns True if email auth is enabled
 */
export function isEmailAuthEnabled(): boolean {
  return AUTH_CONFIG.ENABLE_EMAIL_AUTH;
}

/**
 * Get password requirements as human-readable text
 * @returns Array of password requirement strings
 */
export function getPasswordRequirements(): string[] {
  const requirements: string[] = [];

  requirements.push(`At least ${AUTH_CONFIG.PASSWORD_MIN_LENGTH} characters long`);

  if (AUTH_CONFIG.PASSWORD_REQUIRE_UPPERCASE) {
    requirements.push('One uppercase letter');
  }

  if (AUTH_CONFIG.PASSWORD_REQUIRE_LOWERCASE) {
    requirements.push('One lowercase letter');
  }

  if (AUTH_CONFIG.PASSWORD_REQUIRE_NUMBER) {
    requirements.push('One number');
  }

  if (AUTH_CONFIG.PASSWORD_REQUIRE_SPECIAL_CHAR) {
    requirements.push('One special character');
  }

  return requirements;
}
