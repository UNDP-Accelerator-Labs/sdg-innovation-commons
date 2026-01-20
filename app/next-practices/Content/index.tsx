'use client';

import { useState } from 'react';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import { Button } from '@/app/ui/components/Button';
import { useMyCollections, usePublicCollections } from '../hooks';
import { collection as collectionData } from '@/app/lib/data/collection/tempData';
import CollectionTabs from '../components/CollectionTabs';
import CollectionGrid from '../components/CollectionGrid';
import type { SectionProps, CollectionTab } from '../types';

export default function Section({ searchParams }: SectionProps) {
  const { sharedState } = useSharedState();
  const { isLogedIn, session } = sharedState || {};

  const [activeTab, setActiveTab] = useState<CollectionTab>('public');

  // Use custom hooks for data fetching
  const { collections: myCollections, loading: loadingMy } = useMyCollections(isLogedIn || false);
  const { collections: publicCollections, loading: loadingPublic } = usePublicCollections(12);

  // Fallback temp data for display
  const tempData = collectionData.map((d: any, i: number) => {
    const { id, ...obj } = d;
    return {
      ...obj,
      key: id,
      id: i,
      href: `/next-practices/${id}`,
      description: obj.sections?.[0]?.items?.[0]?.txt || '',
    };
  });

  // Use public collections if available, otherwise fallback to temp data
  const publicData = publicCollections.length > 0 ? publicCollections : tempData;

  // Determine which collections to display
  const displayedCollections = activeTab === 'my' ? myCollections : publicData;

  // Show tabs only if user is logged in and has collections
  const showTabs = isLogedIn && myCollections.length > 0;

  return (
    <>
      <section className="home-section py-[80px]">
        <div className="inner mx-auto px-[20px] lg:px-[80px] xl:px-[40px] xxl:px-[80px] w-[375px] md:w-[744px] lg:w-[992px] xl:w-[1200px] xxl:w-[1440px]">
          <div className="tabs flex row justify-between mb-6">
            <div className="group col-span-9 flex flex-row items-stretch lg:col-span-4">
              <CollectionTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                showTabs={showTabs}
              />
            </div>
            {session?.rights >= 2 && (
              <div className="col-span-5 col-start-5 flex flex-row gap-x-5 md:col-span-2 md:col-start-8 lg:col-span-1 lg:col-end-10">
                <Button
                  onClick={() =>
                    (window.location.href = '/next-practices/create')
                  }
                >
                  Create Collection
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-6">
            {isLogedIn && session?.pinboards?.length ? (
              <p className="lead">
                Browse through thematic curated boards on frontier sustainable
                development challenges. Click on "My boards" at the bottom right
                to access and customize your own boards.
              </p>
            ) : null}
          </div>

          <div className="section-content pt-[40px]">
            <CollectionGrid
              collections={displayedCollections}
              showStatus={activeTab === 'my'}
            />
          </div>
        </div>
      </section>
    </>
  );
}
