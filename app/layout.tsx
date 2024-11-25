import '@/app/ui/global.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import { headers } from 'next/headers'

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
      {isProduction && isProd && (
        <Script
          nonce={nonce}
          data-goatcounter="https://sdg-commons-latest.goatcounter.com/count"
          async src="//gc.zgo.at/count.js"
          strategy="afterInteractive"
        />
      )}
      <body>{children}</body>
    </html>
  );
}
