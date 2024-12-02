"use client";
import { useState, useEffect } from 'react';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import platformApi from '@/app/lib/data/platform-api';
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
    const [boards, setBoards] = useState<any[]>([]);
    const { sharedState } = useSharedState();
    const { isLogedIn } = sharedState || {}

     // Fetch data on component mount
     useEffect(() => {
        async function fetchData() {

            const { data : board, count: board_count } = await platformApi(
                {}, 
                'solution', 
                'pinboards'
            );
            setBoards(board)
        }
        fetchData();
    }, []); 

  return (
    <>
      <Navbar />
      <Hero />
      <BlockBtns />
      <About />
      {/*<GetInspired />*/}
      <FeaturedBoard />
      {/* <How /> */}
      <See boards={boards} isLogedIn={isLogedIn} />
      <Test boards={boards} isLogedIn={isLogedIn} />
      <Learn boards={boards} isLogedIn={isLogedIn} />
      <Contact />
      <Footer />
    </>
  );
}
