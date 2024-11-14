import { Suspense } from 'react';
import Navbar from '@/app/ui/components/Navbar';
import Hero from './Hero';
import Content from './Content';
import Footer from '@/app/ui/components/Footer';

interface Props {
  id: number;
}

export default function Pad({ id }: Props) {
  

  return (
    <>
      <Navbar />
      <Suspense>
        <Content id={id} platform={'solution'} />
      </Suspense>
      <Footer />
    </>
  );
}
