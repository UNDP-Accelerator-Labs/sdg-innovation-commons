/**
 * String and URL manipulation utilities
 * @module lib/utils/string
 */

/**
 * Check if a string is a valid URL
 * 
 * @param str - String to check
 * @returns Boolean indicating if string is a URL
 */
export function isURL(str: string = ''): boolean {
  const urlRegex = /(?<!:)(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  return urlRegex.test(encodeURI(str.valueOf().trim()));
}

/**
 * Convert URLs in plain text to clickable HTML links
 * 
 * @param str - String containing URLs
 * @returns String with URLs converted to HTML anchor tags
 */
export function URLsToLinks(str: string = ''): string {
  if (typeof str !== 'string') return str;

  // URLs starting with http://, https://, or ftp://
  const replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  str = str.valueOf().replace(
    replacePattern1,
    '<a class="text-blue-500 cursor-pointer" href="$1" target="_blank">$1</a>'
  );

  // URLs starting with "www." (without http:// or https://)
  const replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  str = str.valueOf().replace(
    replacePattern2,
    '$1<a class="text-blue-500 cursor-pointer" href="http://$2" target="_blank">$2</a>'
  );

  // Email addresses
  const replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
  str = str.valueOf().replace(
    replacePattern3,
    '<a class="text-blue-500 cursor-pointer" href="mailto:$1">$1</a>'
  );

  return str;
}

/**
 * Password security validation
 * Returns array of error messages for insecure passwords
 * 
 * @param password - Password to validate
 * @returns Array of validation error messages (empty if valid)
 */
export function validatePasswordStrength(password: string): string[] {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return errors;
}

/**
 * Truncate a string to a maximum length with ellipsis
 * 
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @param ellipsis - Ellipsis string (default: '...')
 * @returns Truncated string
 */
export function truncate(str: string, maxLength: number, ellipsis: string = '...'): string {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * Convert string to slug format (lowercase, hyphenated)
 * 
 * @param str - String to convert
 * @returns Slugified string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Capitalize first letter of a string
 * 
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert camelCase or PascalCase to human-readable format
 * 
 * @param str - String to convert
 * @returns Human-readable string
 */
export function camelToHuman(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase()
    .replace(/^./, (char) => char.toUpperCase());
}

/**
 * Escape HTML entities in a string
 * 
 * @param s - String to escape
 * @returns HTML-escaped string
 */
export async function escapeHtml(s: any): Promise<string> {
  if (s === null || typeof s === 'undefined') return '';
  return String(s).replace(/[&"'<>]/g, function (c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as any)[c];
  });
}
