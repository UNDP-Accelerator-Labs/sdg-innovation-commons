import Navbar from '@/app/ui/components/Navbar';
import Hero from './Hero';
import Content from './Content';
import Footer from '@/app/ui/components/Footer';
import { incomingRequestParams } from '@/app/lib/utils';

export default async function Page({ params, searchParams }: incomingRequestParams) {
  const { slug } = await params
  const tabs = ['all', 'solution', 'experiment', 'action plan', 'blog', 'publications', 'news'];

  return (
    <>
    <Navbar />
    <Hero slug={slug}  />
    <Content slug={slug} tabs={tabs} />
    <Footer />
    </>
  );
}