'use client';
import Navbar from '@/app/ui/components/Navbar';
import Hero from './Hero';
import Content from './Content';
import Footer from '@/app/ui/components/Footer';
import { useState } from 'react';

export default function Page({ params }: { params: { slug: string } }) {
  const tabs = ['all', 'solution', 'experiment', 'action plan', 'blog', 'publications', 'news'];
  type TabType = typeof tabs[number];
  // Manage the active tab and data
  const [docType, setDocType] = useState<TabType>(tabs[0]);

  function handleTabUpdate (tab: string): void {
    setDocType(tab);
  }

  return (
    <>
    <Navbar />
    <Hero slug={params.slug}  />
    <Content slug={params.slug} handleTabUpdate={handleTabUpdate} tabs={tabs} docType={docType} />
    <Footer />
    </>
  );
}