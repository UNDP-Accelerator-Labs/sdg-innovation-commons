import React from 'react';

export function ContentSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Hero Skeleton */}
      <div className="bg-gray-200 h-48 w-full mb-6"></div>

      {/* Infobar Skeleton */}
      <div className="bg-gray-200 h-12 w-full mb-6"></div>

      {/* Section Skeleton */}
      <section className='home-section py-[40px] lg:py-[80px] grid-bg'>
        <div className='inner mx-auto px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px]'>
          {/* SEARCH */}
          <form id='search-form' method='GET' className='section-header relative'>
            <div className='col-span-4 flex flex-row group items-stretch mb-6'>
              <div className="bg-gray-200 h-10 w-full rounded"></div>
            </div>
          </form>
          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-200 h-64 w-full rounded"></div>
            <div className="bg-gray-200 h-64 w-full rounded"></div>
            <div className="bg-gray-200 h-64 w-full rounded"></div>
          </div>
        </div>
      </section>
    </div>
  );
}