import Navbar from '@/app/ui/components/Navbar';
import Contact from '@/app/ui/components/Contact';
import Footer from '@/app/ui/components/Footer';
import Learn from './Learn'
import See from './See'
import Test from './Test'
import How from './How-it-works'
import FeaturedBoard from './Featured-board'
import GetInspired from './Get-Inspired'

export default function Home() {
  return (
    <>
      <Navbar />
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
