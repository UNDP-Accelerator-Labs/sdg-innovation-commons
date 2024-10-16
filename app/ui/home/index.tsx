import Navbar from '@/app/ui/components/Navbar';
import Hero from '@/app/ui/components/Hero';
import BlockBtns from '@/app/ui/components/BlockBtns';
import Contact from '@/app/ui/components/Contact';
import Footer from '@/app/ui/components/Footer';
import Learn from './Learn'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <BlockBtns />
      <Learn />
      <Contact />
      <Footer />
    </>
  );
}
