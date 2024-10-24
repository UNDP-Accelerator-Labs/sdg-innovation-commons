import Navbar from '@/app/ui/components/Navbar';
import Hero from './Hero';
import Content from './Content';
import Footer from '@/app/ui/components/Footer';

type Params = Promise<{ slug: string }>

export default async function PagePage({ params }: { params: Params }) {  
  const { slug } = await params
  return (
    <>
    <Navbar />
    <Hero slug={slug}  />
    <Content slug={slug} />
    <Footer />
    </>
  );
}
