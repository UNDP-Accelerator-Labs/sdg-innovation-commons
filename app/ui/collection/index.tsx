import { Suspense } from 'react';
import Navbar from '@/app/ui/components/Navbar';
import Content from './Content';
import { ContentSkeleton } from '@/app/ui/collection/Content/skeleton';
import Footer from '@/app/ui/components/Footer';

interface Props {
  id: string;
  searchParams: any;
  session?: any;
}

export default function Collection({ 
  id,
  searchParams,
  session
}: Props) {
  return (
    <>
      <Navbar />
      <Suspense fallback={<ContentSkeleton />}>
        <Content id={id} searchParams={searchParams} session={session} />
      </Suspense>
      <Footer />
    </>
  );
}
