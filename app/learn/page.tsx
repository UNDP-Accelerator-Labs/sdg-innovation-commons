import Navbar from '@/app/ui/components/Navbar';
import Hero from './Hero';
import Content from './Content';
import Footer from '@/app/ui/components/Footer';

export default async function Page() {
  return (
    <>
    <Navbar />
    <Hero />
    <Content />
    <Footer />
    </>
  );
}
