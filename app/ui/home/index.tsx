import Navbar from '@/app/ui/components/Navbar';
import Contact from '@/app/ui/components/Contact';
import Footer from '@/app/ui/components/Footer';
import Learn from './Learn'

export default function Home() {
  return (
    <>
      <Navbar />
      <Learn />
      <Contact />
      <Footer />
    </>
  );
}
