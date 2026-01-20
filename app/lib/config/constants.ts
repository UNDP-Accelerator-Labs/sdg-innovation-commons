/**
 * Application configuration constants
 * Centralized configuration for the entire application
 * @module lib/config/constants
 */

import type { PlatformConfig } from '../types';

/**
 * Base host for the application
 */
export const BASE_HOST = '.sdg-innovation-commons.org';

/**
 * Pagination limit for content pages
 */
export const PAGE_LIMIT = 18;

/**
 * Base URL for the application
 */
export const BASE_URL = 'https://sdg-innovation-commons.org';


/**
 * Azure blob storage URL for uploads
 */
export const APP_STORAGE = 'https://acclabplatforms.blob.core.windows.net/';

/**
 * Application short title
 */
export const APP_TITLE_SHORT = 'sdg-innovation-commons';

/**
 * Application full title
 */
export const APP_TITLE_FULL = 'SDG Innovation Commons';

/**
 * NLP API URL
 */
export const NLP_URL = 'https://nlpapi.sdg-innovation-commons.org/api';

/**
 * Local base URL (environment-aware)
 * In production, use the production URL; in development, use localhost
 */
export const LOCAL_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://sdg-innovation-commons.org' 
    : 'http://localhost:3000');

/**
 * Authentication Feature Flags and Configuration
 * Control authentication methods, features, and JWT settings
 */
export const AUTH_CONFIG = {
  /**
   * Enable/disable UNDP SSO (Single Sign-On) authentication
   * Set to false to disable the "UNDP Staff" login tab
   */
  ENABLE_UNDP_SSO: process.env.NEXT_PUBLIC_ENABLE_UNDP_SSO !== 'false',
  
  /**
   * Enable/disable standard email/password authentication
   */
  ENABLE_EMAIL_AUTH: process.env.NEXT_PUBLIC_ENABLE_EMAIL_AUTH !== 'false',
  
  /**
   * Session expiration time in seconds (default: 7 days)
   */
  SESSION_MAX_AGE: 7 * 24 * 60 * 60,
  
  /**
   * Password requirements
   */
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBER: true,
  PASSWORD_REQUIRE_SPECIAL_CHAR: true,
  
  /**
   * JWT configuration for legacy API compatibility
   */
  secret: process.env.APP_SECRET,
  jwtAudience: process.env.JWT_AUDIENCE || 'sdg-innovation-commons',
  jwtIssuer: BASE_HOST?.slice(1) || 'sdg-innovation-commons',
} as const;

/**
 * Platform configurations
 */
export const COMMONS_PLATFORMS: PlatformConfig[] = [
  {
    title: 'Learning Plans',
    url: 'https://learningplans.sdg-innovation-commons.org',
    key: 'action plan',
    shortkey: 'ap',
  },
  {
    title: 'Solutions',
    url: 'https://solutions.sdg-innovation-commons.org',
    key: 'solution',
    shortkey: 'sm',
  },
  {
    title: 'Experiments',
    url: 'https://experiments.sdg-innovation-commons.org',
    key: 'experiment',
    shortkey: 'exp',
  },
  {
    title: 'Insight',
    url: 'https://blogapi.sdg-innovation-commons.org',
    key: 'insight',
    shortkey: 'blogs',
  },
  {
    title: 'Login',
    url: 'https://login.sdg-innovation-commons.org',
    key: 'insight', // Using 'insight' as fallback since 'login' is not in PlatformType
  },
];

/**
 * SDG (Sustainable Development Goals) labels
 */
export const SDG_LABELS: string[] = [
  'No poverty',
  'Zero hunger',
  'Good health and well-being',
  'Quality education',
  'Gender equality',
  'Clean water and sanitation',
  'Affordable and clean energy',
  'Decent work and economic growth',
  'Industry, innovation and infrastructure',
  'Reduced inequalities',
  'Sustainable cities and communities',
  'Responsible consumption and production',
  'Climate action',
  'Life below water',
  'Life on land',
  'Peace, justice and strong institutions',
  'Partnerships for the goals',
];

/**
 * Platform mapping: frontend platform names to database shortkeys
 */
export const PLATFORM_MAP: Record<string, string> = {
  'action plan': 'ap',
  'solution': 'sm',
  'experiment': 'exp',
  'insight': 'blogs',
  'blogs': 'blogs',
  'actionplan': 'ap',
};

/**
 * Platform reverse mapping: database shortkeys to frontend platform names
 */
export const PLATFORM_REVERSE_MAP: Record<string, string> = {
  'ap': 'action plan',
  'sm': 'solution',
  'exp': 'experiment',
  'blogs': 'insight',
};

/**
 * Essential cookie keys that can always be stored
 */
export const ESSENTIAL_COOKIE_KEYS: string[] = [
  'sdg_commons_cookie_consent',
];

/**
 * Shimmer animation CSS class for loading states
 */
export const SHIMMER_CLASS = 
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

/**
 * Count cache TTL in milliseconds (5 minutes)
 */
export const COUNT_CACHE_TTL = 5 * 60 * 1000;

/**
 * Default search platforms
 */
export const DEFAULT_SEARCH_PLATFORMS: Record<string, string> = {
  'see': 'solution',
  'learn': 'action plan',
  'test': 'experiment',
};

/**
 * Email configuration validation
 */
export const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  service: process.env.SMTP_SERVICE,
  adminEmails: process.env.ADMIN_EMAILS,
  isConfigured(): boolean {
    return !!(this.host && this.port && this.user && this.pass);
  },
};

/**
 * Database configuration
 */
export const DB_CONFIG = {
  poolMax: Number(process.env.PG_POOL_MAX) || 10,
  idleTimeoutMs: Number(process.env.PG_IDLE_TIMEOUT_MS) || 30000,
  requireSSL: process.env.DB_REQUIRE_SSL === 'true',
};

// ============================================================================
// LEGACY EXPORT ALIASES - For backward compatibility
// ============================================================================

export const baseHost = BASE_HOST;
export const page_limit = PAGE_LIMIT;
export const base_url = BASE_URL;
export const app_storage = APP_STORAGE;
export const app_title_short = APP_TITLE_SHORT;
export const commonsPlatform = COMMONS_PLATFORMS;
export const sdgLabels = SDG_LABELS;
