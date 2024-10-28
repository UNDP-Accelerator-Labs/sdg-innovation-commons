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
  const initialParams = {};
  params.forEach((v, k): void => {
      if (initialParams[k]) {
        if (!Array.isArray(initialParams[k])) initialParams[k] = [initialParams[k]];
        initialParams[k].push(v);
      } else initialParams[k] = v;
  });
  if (!Object.keys(initialParams).includes('page')) initialParams.page = 1;

  const [apiParams, setApiParams] = useState<any>(initialParams);

  const handleSearch = function(search: any): void {
      setApiParams(prevParams => ({
        ...prevParams,
        ...search
      }));
  };

  function handlePageUpdate (page: number): void {
      setApiParams(params => ({
        ...params,
        page
      }));
  };

  return (
    <>
    <Navbar />
    <Hero apiParams={apiParams} handleSearch={handleSearch} />
    <Content apiParams={apiParams} handlePageUpdate={handlePageUpdate} />
    <Footer />
    </>
  );
}