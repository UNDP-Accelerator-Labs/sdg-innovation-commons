/**
 * Legacy utils module - DEPRECATED
 * @deprecated This file redirects to new modular structure
 * 
 * Migration Guide:
 * - Constants => '@/app/lib/config/constants'
 * - isURL, getImg, extractSDGNumbers => '@/app/lib/utils'
 * - scrubPII, polishTags => '@/app/lib/utils/privacy'
 * - formatDate => '@/app/lib/utils/date'
 * - getCountryList => '@/app/lib/utils/platform'
 */

// Re-export constants from config
export { 
  baseHost,
  page_limit,
  base_url,
  app_storage,
  app_title_short,
  commonsPlatform,
  sdgLabels,
  NLP_URL,
  LOCAL_BASE_URL
} from '../config/constants';

// Re-export string utilities
export { isURL, URLsToLinks, escapeHtml } from '../utils/string';

// Re-export media utilities
export { getImg } from '../utils/media';

// Re-export SDG utilities
export { extractSDGNumbers } from '../utils/sdg';

// Re-export privacy utilities
export { scrubPII, polishTags } from '../utils/privacy';

// Re-export date utilities
export { formatDate } from '../utils/date';

// Re-export platform utilities
export { getCountryList, defaultSearch } from '../utils/platform';

// Re-export types
export type { IncomingRequestParams as incomingRequestParams } from '../types/common';

// Shimmer effect constant
export const shimmer = 'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

// Password security check function
export function isPasswordSecure(password: string): string[] {
  const minlength = 8;
  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*\(\)]/;
  const commonPasswords = ['password', '123456', 'qwerty', 'azerty'];

  const isUpper = uppercaseRegex.test(password);
  const isLower = lowercaseRegex.test(password);
  const isNumber = numberRegex.test(password);
  const isSpecial = specialCharRegex.test(password);
  const groups = [isUpper, isLower, isNumber, isSpecial].reduce(
    (p, v) => p + (v ? 1 : 0),
    0
  );

  const checks: Record<string, boolean> = {
    'pw-length': password.length >= minlength,
    'pw-groups': groups >= 3,
    'pw-common': !commonPasswords.includes(password.toLowerCase()),
  };

  const msgs: Record<string, string> = {
    'pw-length': 'Password must be at least 8 characters long',
    'pw-groups':
      'Password requires three character groups out of uppercase letters, lowercase letters, numbers, or special characters !@#$%^&*()',
    'pw-common': 'Password cannot be a commonly used password',
  };

  return Object.keys(checks)
    .filter((key) => !checks[key])
    .map((key) => msgs[key]);
}
