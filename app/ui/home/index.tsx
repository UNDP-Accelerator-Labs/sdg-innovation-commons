import Navbar from '@/app/ui/components/Navbar';
import Contact from '@/app/ui/components/Contact';
import Footer from '@/app/ui/components/Footer';
import Hero from './Hero';
import BlockBtns from './BlockBtns';
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
      {/*<GetInspired />*/}
      <FeaturedBoard />
      {/* <How /> */}
      <See />
      <Test />
      <Learn />
      <Contact />
      <Footer />
    </>
  );
}
