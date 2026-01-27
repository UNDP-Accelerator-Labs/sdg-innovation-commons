'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { clearFunctionalData } from '@/app/lib/consent-storage';

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  timestamp: number;
}

const COOKIE_CONSENT_KEY = 'sdg_commons_cookie_consent';
const CONSENT_VERSION = '1.0'; // Increment when privacy policy changes

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always enabled
    functional: false,
    analytics: false,
    timestamp: Date.now(),
  });

  useEffect(() => {
    // Check if user has already made a choice
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    
    if (!savedConsent) {
      // Show banner after a brief delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      try {
        const parsed = JSON.parse(savedConsent);
        // Check if consent is for current version
        if (parsed.version === CONSENT_VERSION) {
          setPreferences(parsed.preferences);
          applyConsent(parsed.preferences);
        } else {
          // Outdated consent, show banner again
          setTimeout(() => setShowBanner(true), 1000);
        }
      } catch (error) {
        console.error('Error parsing cookie consent:', error);
        setTimeout(() => setShowBanner(true), 1000);
      }
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    const consentData = {
      version: CONSENT_VERSION,
      preferences: prefs,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
    applyConsent(prefs);
    setPreferences(prefs);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const applyConsent = (prefs: CookiePreferences) => {
    if (typeof window !== 'undefined') {
      // Handle Functional Cookies
      if (!prefs.functional) {
        // Clear all functional data when consent is revoked
        clearFunctionalData();
        // console.log('Functional cookies disabled: Cleared stored preferences');
      } else {
        console.log('Functional cookies enabled: User preferences will be saved');
      }
      
      // Log analytics consent status (actual loading handled by GoatCounterAnalytics component)
      if (prefs.analytics) {
        // console.log('Analytics cookies enabled: GoatCounter will be loaded');
      } else {
        console.log('Analytics cookies disabled: GoatCounter will not be loaded');
      }
    }

    // Broadcast consent change event for other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cookieConsentChanged', { 
        detail: prefs 
      }));
    }
  };

  const acceptAll = () => {
    saveConsent({
      essential: true,
      functional: true,
      analytics: true,
      timestamp: Date.now(),
    });
  };

  const acceptEssentialOnly = () => {
    saveConsent({
      essential: true,
      functional: false,
      analytics: false,
      timestamp: Date.now(),
    });
  };

  const handlePreferenceSave = () => {
    saveConsent(preferences);
  };

  if (!showBanner && !showPreferences) return null;

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-[9999] animate-slide-up">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">We value your privacy</h3>
                <p className="text-sm text-gray-700 mb-2">
                  We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
                  Essential cookies are required for the site to function properly.
                </p>
                <Link 
                  href="https://www.undp.org/copyright-terms-use" 
                  className="text-sm text-[#0072bc] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more about our privacy policy
                </Link>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={() => setShowPreferences(true)}
                  className="h-[50px] font-bold font-space-mono text-[14px] px-[30px] border-2 border-black hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  Manage Preferences
                </button>
                <button
                  onClick={acceptEssentialOnly}
                  className="h-[50px] font-bold font-space-mono text-[14px] px-[30px] border-2 border-black hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  Essential Only
                </button>
                <button
                  onClick={acceptAll}
                  className="h-[50px] font-bold font-space-mono text-[14px] px-[30px] bg-[#0072bc] text-white border-2 border-[#0072bc] hover:bg-[#005a94] hover:border-[#005a94] transition-colors whitespace-nowrap"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold">Cookie Preferences</h2>
              <p className="text-sm text-gray-600 mt-2">
                Choose which cookies you want to allow. You can change these settings at any time.
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Essential Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">Essential Cookies</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      Required for the website to function properly. These cookies enable basic functions like page navigation, 
                      access to secure areas, and authentication. The website cannot function properly without these cookies.
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded text-sm font-medium">
                      Always Active
                    </div>
                  </div>
                </div>
              </div>

              {/* Functional Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">Functional Cookies</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      These cookies enable enhanced functionality and personalization, such as remembering your 
                      preferences, search filters, and display settings across sessions.
                    </p>
                    {/* <div className="text-xs text-gray-600 mt-2">
                      <strong>Examples:</strong> Language preferences, Theme settings, Filter selections
                    </div> */}
                  </div>
                  <div className="ml-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0072bc]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">Analytics Cookies</h3>
                    <p className="text-sm text-gray-700 mb-2">
                      These cookies help us understand how visitors interact with our website by collecting and 
                      reporting information anonymously. This helps us improve the site and user experience.
                    </p>
                    {/* <div className="text-xs text-gray-600 mt-2">
                      <strong>Examples:</strong> Google Analytics, Page visit statistics, User journey tracking
                    </div> */}
                  </div>
                  <div className="ml-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0072bc]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPreferences(false);
                  setShowBanner(true);
                }}
                className="h-[50px] font-bold font-space-mono text-[14px] px-[30px] border-2 border-black hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePreferenceSave}
                className="h-[50px] font-bold font-space-mono text-[14px] px-[30px] bg-[#0072bc] text-white border-2 border-[#0072bc] hover:bg-[#005a94] hover:border-[#005a94] transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

// Export helper function to check consent status
export function getCookieConsent(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;
  
  const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!savedConsent) return null;
  
  try {
    const parsed = JSON.parse(savedConsent);
    if (parsed.version === CONSENT_VERSION) {
      return parsed.preferences;
    }
  } catch (error) {
    console.error('Error parsing cookie consent:', error);
  }
  
  return null;
}
