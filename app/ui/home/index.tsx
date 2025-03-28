"use client";
import { useState, useEffect } from "react";
import { useSharedState } from "@/app/ui/components/SharedState/Context";
import platformApi from "@/app/lib/data/platform-api";
import Navbar from "@/app/ui/components/Navbar";
import Contact from "@/app/ui/components/Contact";
import Footer from "@/app/ui/components/Footer";
import Hero from "./Hero";
import BlockBtns from "./BlockBtns";
import Learn from "./Learn";
import See from "./See";
import Test from "./Test";
import How from "./How-it-works";
import FeaturedBoard from "./Featured-board";
import GetInspired from "./Get-Inspired";
import About from "./About";

export default function Home() {
  const [boards, setBoards] = useState<any[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false); 
  const { sharedState } = useSharedState();
  const { isLogedIn, session } = sharedState || {};

  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      const { data: board, count: board_count } = await platformApi(
        { space : session?.rights >= 3 ? 'all' : 'private' },
        "experiment",
        "pinboards"
      );
      setBoards(board);
      setDataLoaded(true); 
    }
    fetchData();
  }, [session]);


  useEffect(() => {
    if (!dataLoaded) return; 

    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }

    // Set up Intersection Observer
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            window.history.replaceState(null, "", `#${entry.target.id}`);
          }
        });
      },
      {
        root: null,
        threshold: 0.6,
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, [dataLoaded]); 

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
