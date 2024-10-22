import Navbar from '@/app/ui/components/Navbar';
import Hero from './Hero';
import Content from './Content';
import Footer from '@/app/ui/components/Footer';

export default async function Page({ params }: { params: { slug: string } }) {
  return (
    <>
    <Navbar />
    <Hero slug={params.slug}  />
    <Content slug={params.slug} />
    <Footer />
    </>
  );
}
