import '@/app/ui/global.css'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { SessionProvider } from '@/app/ui/components/SessionProvider';
import { SharedStateProvider } from '@/app/ui/components/SharedState/Context';
import { auth } from '@/auth';
import CookieConsent from '@/app/ui/components/CookieConsent';
import GoatCounterAnalytics from '@/app/ui/components/GoatCounterAnalytics';
import getSession from '@/app/lib/session';
import { auth } from '@/auth';

const { PROD_ENV } = process.env;

export const metadata: Metadata = {
  title: 'SDG Commons',
  description: "The SDG Commons is a resource hub with data, insights, solutions and next practices for the Sustainable Development Goals (SDGs) powered by the UNDP Accelerator Labs. Join us to bring these insights into action.",
  metadataBase: new URL('https://sdg-innovation-commons.org'),
  openGraph: {
    images: [
      {
        url: 'https://sdg-innovation-commons.org/images/undp-logo.svg',
        alt: 'SDG Commons — insights, data and next practices',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://sdg-innovation-commons.org/images/undp-logo.svg'],
  },
  ...(PROD_ENV === 'staging' && {
    robots: 'noindex, nofollow',
  }),
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = (await headers()).get('x-nonce') as string
  const isProduction = process.env.NODE_ENV === 'production';
  const host = (await headers()).get('host') || '';
  const excludedSubdomains = ['staging', 'localhost'];
  const subdomain = host.split('.')[0];
  const isProd = !excludedSubdomains.includes(subdomain);
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          <SharedStateProvider session={session?.user}>
            {children}
            {children}
            <CookieConsent />
            {isProduction && isProd && <GoatCounterAnalytics nonce={nonce} />}
          </SharedStateProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
