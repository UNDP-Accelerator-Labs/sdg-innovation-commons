/**
 * Legacy helpers module - DEPRECATED
 * @deprecated This file redirects to new modular structure
 * 
 * Migration Guide:
 * - sendEmail => '@/app/lib/services/email'
 * - safeArr, countArray, multiJoin => '@/app/lib/utils/array'
 * - Platform functions => '@/app/lib/utils/platform'
 * - loadExternDb, getExternDbIdForPlatform => '@/app/lib/utils/platform'
 */

import { sendEmail as sendEmailNew } from '../services/email';

// Legacy sendEmail wrapper for backward compatibility
export async function sendEmail(
  to: string,
  cc: string | null | undefined,
  subject: string,
  html: string
) {
  return sendEmailNew({
    to,
    cc: cc || undefined,
    subject,
    html,
  });
}

// Re-export from new locations
export { 
  safeArr, 
  countArray, 
  multiJoin 
} from '../utils/array';

// Re-export platform constants and utilities
export { 
  mapPlatformToShortkey,
  mapPlatformsToShortkeys,
  mapShortkeyToPlatform,
  loadExternDb,
  getExternDbIdForPlatform
} from '../utils/platform';

// Re-export constants
export { 
  PLATFORM_MAP,
  PLATFORM_REVERSE_MAP
} from '../config/constants';
