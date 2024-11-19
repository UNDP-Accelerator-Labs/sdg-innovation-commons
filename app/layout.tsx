import '@/app/ui/global.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SDG Innovation Commons',
  description: 'Building a 21st-century architecture for global public goods, requires sharing openly and scaling data, insights, solutions and next practices for the Sustainable Development Goals (SDGs). Join the Accelerator Labs on this journey as we open up our body of work, and come shape the SDG Commons with us.',
}


export default function RootLayout({
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
