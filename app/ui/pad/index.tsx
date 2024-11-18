import { Suspense } from 'react';
import Navbar from '@/app/ui/components/Navbar';
import Content from './Content';
import Skeleton from './Content/skeleton';
import Footer from '@/app/ui/components/Footer';

interface Props {
  id: number;
  platform: string;
}

export default function Pad({ 
  id,
  platform,
}: Props) {
  return (
    <>
      <Navbar />
      <Suspense fallback={<Skeleton />}>
        <Content id={id} platform={platform} />
      </Suspense>
      <Footer />
    </>
  );
}
