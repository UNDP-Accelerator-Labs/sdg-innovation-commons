import Navbar from '@/app/ui/components/Navbar';
import Hero from './Hero';
import Content from './Content';
import Footer from '@/app/ui/components/Footer';
import BoardsButton from '@/app/ui/components/BoardsButton';
import { Metadata } from 'next';
import { incomingRequestParams } from '@/app/lib/utils';

export const metadata: Metadata = {
  title: 'SDG Commons - What We See',
  description: "Explore our notes on solutions to SDG priorities and problems mapped around the world.",
}

export default async function Page({ params, searchParams }: incomingRequestParams) {
  const sParams = await searchParams;
  if (!Object.keys(sParams).includes('page')) sParams['page'] = '1';

  return (
    <>
    <Navbar />
    <Hero searchParams={sParams} />
    <Content searchParams={sParams} />
    <Footer />
    <BoardsButton />
    </>
  );
}