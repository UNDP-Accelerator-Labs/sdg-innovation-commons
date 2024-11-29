"use client";
import { useState, useEffect } from 'react';
import { is_user_logged_in } from '@/app/lib/session';
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

    const [isLogedIn, setIsLogedIn] = useState<boolean>(false);
    const [boards, setBoards] = useState<any[]>([]);
    
     // Fetch data on component mount
     useEffect(() => {
        async function fetchData() {

            const { data : board, count: board_count } = await platformApi(
                { limit: 200 }, //TODO: ADD 'all' PARAMETER TO PLATFORM API TO RETURN ALL LIST
                'solution', 
                'pinboards'
            );
            setBoards(board)
    
            const isValidUser = await is_user_logged_in();
            setIsLogedIn(isValidUser)
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
