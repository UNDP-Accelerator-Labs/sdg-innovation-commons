/**
 * Consent-Aware Storage Utilities
 * 
 * These functions wrap localStorage/sessionStorage operations to respect
 * user cookie consent preferences. Only functional data is stored when
 * the user has granted functional cookie consent.
 */

import { getCookieConsent } from '@/app/ui/components/CookieConsent';

/**
 * Store data in localStorage only if functional cookies are enabled
 * @param key - Storage key
 * @param value - Value to store (will be JSON stringified)
 * @returns boolean - true if stored successfully, false if consent not granted
 */
export function setConsentAwareItem(key: string, value: any): boolean {
  if (typeof window === 'undefined') return false;
  
  const consent = getCookieConsent();
  
  // Essential data (like cookie consent itself) can always be stored
  const essentialKeys = ['sdg_commons_cookie_consent'];
  if (essentialKeys.includes(key)) {
    try {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error storing essential data:', error);
      return false;
    }
  }
  
  // Functional data requires consent
  if (!consent?.functional) {
    console.log(`Functional cookies disabled: Not storing "${key}"`);
    return false;
  }
  
  try {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error storing consent-aware data:', error);
    return false;
  }
}

/**
 * Retrieve data from localStorage only if functional cookies are enabled
 * @param key - Storage key
 * @param parse - Whether to parse JSON (default: false)
 * @returns The stored value or null
 */
export function getConsentAwareItem(key: string, parse: boolean = false): string | any | null {
  if (typeof window === 'undefined') return null;
  
  const consent = getCookieConsent();
  
  // Essential data can always be retrieved
  const essentialKeys = ['sdg_commons_cookie_consent'];
  if (essentialKeys.includes(key)) {
    try {
      const value = localStorage.getItem(key);
      return parse && value ? JSON.parse(value) : value;
    } catch (error) {
      console.error('Error retrieving essential data:', error);
      return null;
    }
  }
  
  // Functional data requires consent
  if (!consent?.functional) {
    return null;
  }
  
  try {
    const value = localStorage.getItem(key);
    return parse && value ? JSON.parse(value) : value;
  } catch (error) {
    console.error('Error retrieving consent-aware data:', error);
    return null;
  }
}

/**
 * Remove data from localStorage
 * @param key - Storage key
 */
export function removeConsentAwareItem(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing consent-aware data:', error);
  }
}

/**
 * Clear all functional data from localStorage when consent is revoked
 * Essential data (like consent preferences) is preserved
 */
export function clearFunctionalData(): void {
  if (typeof window === 'undefined') return;
  
  const essentialKeys = ['sdg_commons_cookie_consent'];
  
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (!essentialKeys.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    console.log('Cleared functional data from localStorage');
  } catch (error) {
    console.error('Error clearing functional data:', error);
  }
}

/**
 * Check if analytics tracking is enabled
 * @returns boolean - true if user has granted analytics consent
 */
export function isAnalyticsEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  
  const consent = getCookieConsent();
  return consent?.analytics || false;
}

/**
 * Check if functional cookies are enabled
 * @returns boolean - true if user has granted functional consent
 */
export function isFunctionalEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  
  const consent = getCookieConsent();
  return consent?.functional || false;
}

/**
 * Track analytics event only if consent is granted
 * Note: GoatCounter script only loads if analytics consent is granted,
 * so this function will safely do nothing if consent is denied.
 * @param eventName - Name of the event to track
 * @param eventData - Optional event data
 */
export function trackConsentAwareEvent(eventName: string, eventData?: any): void {
  if (typeof window === 'undefined') return;
  
  const consent = getCookieConsent();
  if (!consent?.analytics) {
    console.log(`Analytics disabled: Not tracking event "${eventName}"`);
    return;
  }
  
  // Track with GoatCounter if available (only loaded when consent granted)
  if ((window as any).goatcounter) {
    try {
      (window as any).goatcounter.count({
        path: eventName,
        title: eventData?.title || eventName,
        event: true
      });
    } catch (error) {
      console.error('Error tracking event with GoatCounter:', error);
    }
  } else {
    console.log('GoatCounter not loaded yet - event tracking deferred');
  }
}
