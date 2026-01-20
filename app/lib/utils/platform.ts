/**
 * Platform-related utilities and mappings
 * @module lib/utils/platform
 */

import { PLATFORM_MAP, PLATFORM_REVERSE_MAP, COMMONS_PLATFORMS, DEFAULT_SEARCH_PLATFORMS } from '../config';
import type { PlatformType, PlatformShortkey, PlatformConfig } from '../types';

/**
 * Map platform name to database shortkey
 * 
 * @param platform - Platform name
 * @returns Platform shortkey
 */
export function mapPlatformToShortkey(platform: string): string {
  return PLATFORM_MAP[platform.toLowerCase()] || platform;
}

/**
 * Map multiple platform names to shortkeys
 * 
 * @param platforms - Array of platform names
 * @returns Array of platform shortkeys
 */
/**
 * Map multiple platform names to shortkeys
 * 
 * @param platforms - Platform names (string or array)
 * @returns Array of shortkeys
 */
export function mapPlatformsToShortkeys(platforms: string | string[]): string[] {
  const platformArr = Array.isArray(platforms) ? platforms : [platforms];
  return platformArr.map(mapPlatformToShortkey);
}

/**
 * Map shortkey back to platform name
 * 
 * @param shortkey - Platform shortkey
 * @returns Platform name
 */
export function mapShortkeyToPlatform(shortkey: string): string {
  return PLATFORM_REVERSE_MAP[shortkey.toLowerCase()] || shortkey;
}

/**
 * Get platform configuration by key
 * 
 * @param key - Platform key
 * @returns Platform configuration or undefined
 */
export function getPlatformConfig(key: string): PlatformConfig | undefined {
  return COMMONS_PLATFORMS.find((p) => p.key === key || p.shortkey === key);
}

/**
 * Get platform URL by key
 * 
 * @param key - Platform key
 * @returns Platform URL or undefined
 */
export function getPlatformUrl(key: string): string | undefined {
  return getPlatformConfig(key)?.url;
}

/**
 * Get default search platform for a specific page type
 * 
 * @param pageType - Page type ('see', 'learn', 'test')
 * @returns Default platform name
 */
export function getDefaultSearchPlatform(pageType: 'see' | 'learn' | 'test'): string | undefined {
  return DEFAULT_SEARCH_PLATFORMS[pageType];
}

/**
 * Check if a platform key is valid
 * 
 * @param key - Platform key to validate
 * @returns Boolean indicating if key is valid
 */
export function isValidPlatform(key: string): boolean {
  return COMMONS_PLATFORMS.some((p) => p.key === key || p.shortkey === key);
}

/**
 * Get all platform keys
 * 
 * @returns Array of all platform keys
 */
export function getAllPlatformKeys(): string[] {
  return COMMONS_PLATFORMS.map((p) => p.key);
}

/**
 * Get all platform shortkeys
 * 
 * @returns Array of all platform shortkeys
 */
export function getAllPlatformShortkeys(): string[] {
  return COMMONS_PLATFORMS
    .map((p) => p.shortkey)
    .filter((s): s is PlatformShortkey => s !== undefined);
}

/**
 * Legacy alias for getDefaultSearchPlatform
 * @deprecated Use getDefaultSearchPlatform instead
 */
export const defaultSearch = getDefaultSearchPlatform;

/**
 * Get list of countries from post data, limited to specified count
 * 
 * @param post - Post object with location data
 * @param limit - Maximum number of countries to return (default: 3)
 * @returns Array of country names
 */
export function getCountryList(post: any, limit: number = 3): string[] {
  let countries = post?.locations?.map((d: any) => d.country) || [];
  
  if (!countries.length) {
    countries = [
      post?.country === 'NUL' || !post?.country
        ? 'Global'
        : post?.country,
    ];
  } else {
    // Remove duplicates
    countries = countries.filter(
      (value: string, index: number, array: string[]) => {
        return array.indexOf(value) === index;
      }
    );
    
    // Limit number of countries shown
    if (countries.length > limit) {
      const n = countries.length;
      countries = countries.slice(0, limit);
      countries.push(`+${n - limit}`);
    }
  }
  
  return countries;
}

// Re-export server-only database functions from separate module
export { loadExternDb, getExternDbIdForPlatform } from './platform-db';
