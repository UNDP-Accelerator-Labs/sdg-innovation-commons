import '@/app/ui/global.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import { headers } from 'next/headers'
import { SharedStateProvider } from '@/app/ui/components/SharedState/Context';

export const metadata: Metadata = {
  title: 'SDG Commons',
  description: "The SDG Commons is a resource hub with data, insights, solutions and next practices for the Sustainable Development Goals (SDGs) powered by the UNDP Accelerator Labs. Join us to bring these insights into action.",
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


  return (
    <html lang="en">
      <meta property="og:image" content="<generated>" />
      <meta property="og:image:type" content="<generated>" />
      <meta property="og:image:width" content="<generated>" />
      <meta property="og:image:height" content="<generated>" />
      <meta property="og:image:alt" content="<generated>" />

      <meta name="twitter:image" content="<generated>" />
      <meta name="twitter:image:type" content="<generated>" />
      <meta name="twitter:image:width" content="<generated>" />
      <meta name="twitter:image:height" content="<generated>" />
      <meta name="twitter:image:alt" content="<generated>" />

      {isProduction && isProd && (
        <Script
          nonce={nonce}
          data-goatcounter="https://sdg-commons-latest.goatcounter.com/count"
          async src="//gc.zgo.at/count.js"
          strategy="afterInteractive"
        />
      )}
      <body>
        <SharedStateProvider>
          {children}
        </SharedStateProvider>
      </body>
    </html>
  );
}
