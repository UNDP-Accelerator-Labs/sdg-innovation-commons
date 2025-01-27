import Hero from './Hero';
import Content from './Content';
import Navbar from '@/app/ui/components/Navbar';
import Footer from '@/app/ui/components/Footer';
import BoardsButton from '@/app/ui/components/BoardsButton';
import type { Metadata } from 'next'
import { incomingRequestParams } from '@/app/lib/utils';

export const metadata: Metadata = {
  title: 'SDGG Commons - Next Practices',
  description: "Discover how we are uncovering next practices for the SDGs through what we see, what we test, and what we learn.",
}

export default async function Page({ params, searchParams }: incomingRequestParams) {

  const sParams = await searchParams;
  if (!Object.keys(sParams).includes('page')) sParams['page'] = '1';

  return (
    <>
      <Navbar />
      <Hero />
      <Content searchParams={sParams} />
      <Footer />
      <BoardsButton />
    </>
  );
}
