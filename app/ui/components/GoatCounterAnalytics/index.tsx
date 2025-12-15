'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { getCookieConsent } from '@/app/ui/components/CookieConsent';

interface GoatCounterAnalyticsProps {
  nonce?: string;
}

export default function GoatCounterAnalytics({ nonce }: GoatCounterAnalyticsProps) {
  const consent = getCookieConsent();
  const shouldLoadAnalytics = consent?.analytics || false;

  useEffect(() => {
    // Listen for consent changes
    const handleConsentChange = (event: CustomEvent) => {
      const { analytics } = event.detail;
      
      if (analytics && !(window as any).goatcounter) {
        // Consent granted and script not loaded yet - reload page to load GoatCounter
        window.location.reload();
      } else if (!analytics && (window as any).goatcounter) {
        // Consent revoked - disable tracking
        (window as any).goatcounter.count = () => {};
      }
    };

    window.addEventListener('cookieConsentChanged', handleConsentChange as any);

    return () => {
      window.removeEventListener('cookieConsentChanged', handleConsentChange as any);
    };
  }, []);

  // Only render script if analytics consent is granted
  if (!shouldLoadAnalytics) {
    return null;
  }

  return (
    <Script
      id="goatcounter-analytics"
      nonce={nonce}
      data-goatcounter="https://sdg-commons-latest.goatcounter.com/count"
      async
      src="//gc.zgo.at/count.js"
      strategy="afterInteractive"
      onLoad={() => {
        console.log('GoatCounter analytics loaded - tracking enabled');
      }}
    />
  );
}
