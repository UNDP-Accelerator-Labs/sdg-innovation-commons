import Navbar from '@/app/ui/components/Navbar';
import Contact from '@/app/ui/components/Contact';
import Footer from '@/app/ui/components/Footer';
import Learn from './Learn'
import See from './See'
import Test from './Test'
import How from './How-it-works'

export default function Home() {
  return (
    <>
      <Navbar />
      <How />
      <Test />
      <See />
      <Learn />
      <Contact />
      <Footer />
    </>
  );
}
