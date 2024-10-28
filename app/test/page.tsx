'use client';
import Navbar from '@/app/ui/components/Navbar';
import Hero from './Hero';
import Content from './Content';
import Footer from '@/app/ui/components/Footer';
import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const initialParams: { [key: string]: any } = {};

  params.forEach((v, k): void => {
      const key = k as keyof typeof initialParams;
      if (initialParams[key]) {
        if (!Array.isArray(initialParams[key])) initialParams[key] = [initialParams[key]];
        initialParams[key].push(v);
      } else initialParams[key] = v;
  });
  if (!Object.keys(initialParams).includes('page')) initialParams.page = 1;

  const [apiParams, setApiParams] = useState<any>(initialParams);

  const handleSearch = function(search: any): void {
      setApiParams((prevParams: any) => ({
        ...prevParams,
        ...search
      }));
  };

  function handlePageUpdate (page: number): void {
      setApiParams((params: any) => ({
        ...params,
        page
      }));
  };

  const tabs: string[] = ['experiment', 'action plan']; 
  // Manage the active tab and data
  const [platform, setPlatform] = useState<string>(tabs[0]);

  function handleTabUpdate (tab: string): void {
    setPlatform(tab);
  }

  return (
    <>
    <Navbar />
    <Hero 
      apiParams={apiParams}
      handleSearch={handleSearch}
      platform={platform} 
    />
    <Content 
      apiParams={apiParams} 
      handlePageUpdate={handlePageUpdate} 
      handleTabUpdate={handleTabUpdate} 
      platform={platform}
      tabs={tabs}
    />
    <Footer />
    </>
  );
}