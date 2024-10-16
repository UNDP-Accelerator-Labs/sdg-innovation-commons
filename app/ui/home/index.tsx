import Navbar from '@/app/ui/components/Navbar';
import Hero from '@/app/ui/components/Hero';
import BlockBtns from '@/app/ui/components/BlockBtns';
import Contact from '@/app/ui/components/Contact';
import Footer from '@/app/ui/components/Footer';
import Learn from './Learn'
import See from './See'
import Test from './Test'
import How from './How-it-works'
import FeaturedBoard from './Featured-board'
import GetInspired from './Get-Inspired'
import About from './About'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <BlockBtns />
      <About />
      <GetInspired />
      <FeaturedBoard />
      <How />
      <Test />
      <See />
      <Learn />
      <Contact />
      <Footer />
    </>
  );
}
