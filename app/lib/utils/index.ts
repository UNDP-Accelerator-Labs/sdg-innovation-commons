/**
 * Utility functions barrel export
 * Centralized access to all utility modules
 * @module lib/utils
 */

// String utilities
export * from './string';

// Array utilities
export * from './array';

// Date utilities
export * from './date';

// Platform utilities
export * from './platform';

// Privacy utilities
export * from './privacy';

// SDG utilities
export * from './sdg';

// Media utilities
export * from './media';

// Re-export commonly used constants
export { SHIMMER_CLASS, PAGE_LIMIT, BASE_URL, LOCAL_BASE_URL } from '../config';
