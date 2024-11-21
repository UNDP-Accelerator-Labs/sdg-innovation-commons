import '@/app/ui/global.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SDG Commons',
  description: "The SDG Commons is a resource hub with data, insights, solutions and next practices for the Sustainable Development Goals (SDGs) powered by the UNDP Accelerator Labs. Join us to bring these insights into action.",
}


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
