'use client';

import { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import CardWithImg from '@/app/ui/components/Card/with-img';
import FeaturedCard from '@/app/ui/components/Card/featured-card';
import CollectionCard from '@/app/ui/components/Card/collection-card';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import { Pagination } from '@/app/ui/components/Pagination';
import { commonsPlatform, page_limit, formatDate } from '@/app/lib/helpers/utils';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import Link from 'next/link';

interface UserContributionsProps {
  uuid: string;
  personalView?: boolean;
}

type TabType = 'action' | 'experiment' | 'solution' | 'pinboards' | 'collections';

interface TabConfig {
  id: TabType;
  label: string;
  platform: string;
  endpoint: string;
}

const tabs: TabConfig[] = [
  { id: 'action', label: 'Action Plan', platform: 'action plan', endpoint: 'pads' },
  { id: 'experiment', label: 'Experiment', platform: 'experiment', endpoint: 'pads' },
  { id: 'solution', label: 'Solution', platform: 'solution', endpoint: 'pads' },
  { id: 'pinboards', label: 'Board', platform: 'experiment', endpoint: 'pinboards' },
  { id: 'collections', label: 'Next Practice', platform: 'experiment', endpoint: 'collections' },
];

export default function UserContributions({ uuid, personalView = false }: UserContributionsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('action');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  const { sharedState } = useSharedState();
  const { isLogedIn, session } = sharedState || {};
  const loggedInUserUuid = session?.uuid;

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchUserContent = useCallback(async (tab: TabType, page: number = 1) => {
    if (typeof window === 'undefined') return; // Skip on server
    
    setLoading(true);
    try {
      const tabConfig = tabs.find(t => t.id === tab);
      if (!tabConfig) {
        setData([]);
        setCount(0);
        setTotalPages(0);
        setLoading(false);
        return;
      }

      // Build query parameters
      const params = new URLSearchParams();
      params.set('output', 'json');
      params.set('include_data', 'true');
      params.set('limit', page_limit.toString());
      params.set('page', page.toString());

      let apiUrl = '';
      
      if (tab === 'pinboards') {
        // Fetch boards created by the user
        params.set('owner', uuid);
        const databases = commonsPlatform?.filter((d: any) => d.shortkey)?.map((d: any) => d.shortkey) || [];
        databases.forEach(db => params.append('databases', db));
        apiUrl = `/api/pinboards?${params.toString()}`;
      } else if (tab === 'collections') {
        // Fetch collections created by the user
        params.set('owner', uuid);
        apiUrl = `/api/collections?${params.toString()}`;
      } else {
        // Fetch pads (action plans, experiments, solutions)
        // Using 'contributors' parameter which filters by owner (p.owner)
        // The API now handles showing drafts to owner and only published to others
        params.set('platform', tabConfig.platform);
        params.append('contributors', uuid);
        params.set('include_tags', 'true');
        params.set('include_locations', 'true');
        params.set('include_engagement', 'true');
        apiUrl = `/api/pads?${params.toString()}`;
      }

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        setData([]);
        setCount(0);
        setLoading(false);
        return;
      }
      
      const result = await response.json();
      
      // The API now handles the visibility logic, so we can use the data directly
      let filteredData = [];
      let totalCount = 0;

      if (tab === 'pinboards') {
        // Pinboards API returns {count, data} structure
        filteredData = result.data || [];
        totalCount = result.count || filteredData.length;
      } else if (tab === 'collections') {
        // Collections API returns {data, count} structure when using owner filter
        filteredData = result.data || [];
        totalCount = result.count || filteredData.length;
      } else {
        // Pads API returns {data, count} structure
        filteredData = result.data || [];
        totalCount = result.count || filteredData.length;
      }

      setData(filteredData);
      setCount(totalCount);
      setTotalPages(Math.ceil(totalCount / page_limit));
    } catch (error) {
      console.error('Error fetching user content:', error);
      setData([]);
      setCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [uuid]);

  useEffect(() => {
    if (mounted) {
      setCurrentPage(1); // Reset to page 1 when tab changes
      fetchUserContent(activeTab, 1);
    }
  }, [activeTab, mounted, fetchUserContent]);

  useEffect(() => {
    if (mounted) {
      fetchUserContent(activeTab, currentPage);
    }
  }, [currentPage, activeTab, fetchUserContent, mounted]);

  if (!mounted) {
    return null; // Prevent SSR rendering
  }

  const getCardHref = (item: any, tab: TabType) => {
    if (tab === 'pinboards') {
      return `/boards/all/${item.pinboard_id}`;
    } else if (tab === 'collections') {
      // Collections use slug-based URLs, not ID-based
      return `/next-practices/${item.slug}`;
    } else {
      const platform = tabs.find(t => t.id === tab)?.platform || 'experiment';
      const padId = item.pad_id || item.id;
      return `/pads/${encodeURIComponent(platform)}/${padId}`;
    }
  };

  const getCardTitle = (item: any) => {
    return item.title || '';
  };

  const getCardDescription = (item: any, tab: TabType) => {
    const description = item.description || item.snippet || '';
    if (description.length > 200) {
      return `${description.slice(0, 200)}…`;
    }
    return description;
  };

  return (
    <div className="mt-10 pt-10 border border-black bg-white">
      {/* Display tabs */}
      <nav className="tabs items-end">
        {tabs.map((tab, i) => {
          let txt: string = tab.label;
          return (
            <div
              key={i}
              className={clsx(
                'tab tab-line',
                activeTab === tab.id ? 'font-bold' : 'yellow'
              )}
            >
              <Link 
                onClick={() => setActiveTab(tab.id)}
                className="w-full h-full"
                href={'#'}
                scroll={false}
              >
                {`${txt}${txt.slice(-1) === 's' ? '' : 's'}`}
              </Link>
            </div>
          );
        })}
      </nav>
      

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="grid gap-[20px] md:grid-cols-2 lg:grid-cols-3">
            <ImgCardsSkeleton />
          </div>
        ) : data.length > 0 ? (
          <>
            <p className="mb-6 text-gray-600 font-xs">
              {count} {count === 1 ? 'item' : 'items'} found
            </p>
            <div className="grid gap-[20px] md:grid-cols-2 xl:grid-cols-3">
              {data.map((item: any) => {
                const itemId = item.pad_id || item.id || item.pinboard_id;
                // Safely extract view count - handle if it's an object
                let viewCount = 0;
                if (typeof item.total === 'number') {
                  viewCount = item.total;
                } else if (typeof item.engagement === 'number') {
                  viewCount = item.engagement;
                } else if (item.total?.count) {
                  viewCount = item.total.count;
                } else if (item.engagement?.count) {
                  viewCount = item.engagement.count;
                }
                
                // Get tag styles based on platform
                let tagStyle = 'bg-light-green';
                let tagStyleShade = 'bg-light-green-shade';
                if (activeTab === 'action') {
                  tagStyle = 'bg-light-yellow';
                  tagStyleShade = 'bg-light-yellow-shade';
                } else if (activeTab === 'experiment') {
                  tagStyle = 'bg-light-orange';
                  tagStyleShade = 'bg-light-orange-shade';
                }
                
                // Format countries like in test/see pages
                const countries = item.locations && item.locations.length > 0
                  ? item.locations.slice(0, 3).map((loc: any) => loc.country || loc.iso3).filter(Boolean)
                  : [item.country || item.creator?.iso3 || 'Global'];
                
                // Format SDG like in test/see pages
                const sdgValue = item.sdg && item.sdg.length > 0 ? `SDG ${item.sdg.join('/')}` : undefined;
                
                const cardProps = {
                  id: itemId,
                  country: countries,
                  title: getCardTitle(item),
                  description: getCardDescription(item, activeTab),
                  source: activeTab === 'pinboards' ? 'pinboard' : activeTab === 'collections' ? 'collection' : tabs.find(t => t.id === activeTab)?.platform || 'solution',
                  tagStyle,
                  tagStyleShade,
                  href: getCardHref(item, activeTab),
                  backgroundImage: item.vignette || item.img,
                  date: formatDate(item.date || item.created_at),
                  viewCount,
                  isLogedIn: isLogedIn || false,
                  data: item,
                  engagement: item.engagement,
                  tags: item.tags,
                  ...(sdgValue && { sdg: sdgValue }),
                };
                
                // Use different card types for different content
                if (activeTab === 'collections') {
                  // Use collection-card for Next Practices (same as next-practices page)
                  return (
                    <CollectionCard
                      key={itemId}
                      id={item.slug || itemId}
                      title={getCardTitle(item)}
                      description=""
                      tags={[]}
                      href={getCardHref(item, activeTab)}
                      viewCount={(item.boards || []).length}
                      backgroundImage={item.main_image || item.mainImage || item.vignette || item.img}
                      openInNewTab={false}
                      className="mt-10"
                    />
                  );
                } else if (activeTab === 'pinboards') {
                  // Use featured-card for boards
                  return <FeaturedCard key={itemId} {...cardProps} />;
                } else {
                  // Use with-img card for pads (action, experiment, solution)
                  return <CardWithImg key={itemId} {...cardProps} />;
                }
              })}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                page={currentPage}
                pages={totalPages}
                total={count}
                handlePrev={() => setCurrentPage(currentPage - 1)}
                handleNext={() => setCurrentPage(currentPage + 1)}
                setPage={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              No {tabs.find(t => t.id === activeTab)?.label.toLowerCase() || 'items'} found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
