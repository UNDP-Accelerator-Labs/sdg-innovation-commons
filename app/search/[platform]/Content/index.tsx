'use client';

import { useState, useEffect } from 'react';
import BlogCard from '@/app/ui/components/Card/without-img';
import Card from '@/app/ui/components/Card/with-img';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import nlpApi from '@/app/lib/data/nlp-api';
import { formatDate, page_limit, getCountryList } from '@/app/lib/utils';
import clsx from 'clsx';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { pagestats, Pagination } from '@/app/ui/components/Pagination';
import { PageStatsResponse, SectionProps } from '@/app/test/[platform]/Content';
import { useSharedState } from '@/app/ui/components/SharedState/Context';
import ResultsInfo from '@/app/ui/components/ResultInfo';

export default function Content({
  searchParams,
  platform,
  tabs,
}: SectionProps) {
  // read live params from the browser
  const urlSearch = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const page = urlSearch.get('page') || '1';
  const search = urlSearch.get('search') || '';

  const windowParams = new URLSearchParams(urlSearch.toString());
  windowParams.set('page', '1');

  const [pages, setPages] = useState<number>(0);
  const [hits, setHits] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [allObjectIdz, setAllObjectIdz] = useState<any>();
  const [objectIdz, setObjectIdz] = useState<number[]>([]);

  const { sharedState, setSharedState } = useSharedState();

  // tab definitions: maps our new top-level tabs to the underlying doc types
  const contentTypeOptions = ['solution','experiment','action plan','blog','publications','DRA','AILA'] as const;
  type TabId = 'all' | 'what-we-see' | 'what-we-test' | 'what-we-learn';
  type TabDefinition = { label: string; docTypes: string[] };
  const tabDefinitions: Record<TabId, TabDefinition> = {
    'all': { label: 'All', docTypes: [...contentTypeOptions] },
    'what-we-see': { label: 'What we see', docTypes: ['solution'] },
    'what-we-test': { label: 'What we test', docTypes: ['experiment','action plan'] },
    'what-we-learn': { label: 'What we learn', docTypes: ['blog','publications','DRA','AILA'] },
  };

  // derive initial state from URL params (so shared links restore UI)
  const tabFromUrl = (urlSearch.get('tab') as TabId) || 'all';
  const docTypesFromUrl = urlSearch.getAll('doc_type'); // multiple allowed
  const [activeTab, setActiveTab] = useState<string>(tabFromUrl);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(docTypesFromUrl || []);
  const [total, setTotal] = useState<number>(0);

  // keep state in sync when user navigates or shares a link
  useEffect(() => {
    const t = (urlSearch.get('tab') as TabId) || 'all';
    setActiveTab(t);
    setSelectedFilters(urlSearch.getAll('doc_type') || []);
  }, [urlSearch.toString()]);

  async function fetchData(): Promise<void> {
    setLoading(true);

    let doc_type: string[] = [];

    // resolve tab definition with proper typing guard once
    const def = (tabDefinitions[activeTab as TabId] || tabDefinitions['all']);

    // priority: selectedFilters (user checkboxes) > activeTab mapping
    if (selectedFilters.length > 0) {
      doc_type = selectedFilters;
    } else {
      doc_type = def.docTypes;
    }

    const { total: totalCount, pages: totalPages }: PageStatsResponse = await pagestats(
      +page,
      doc_type,
      {
        ...Object.fromEntries(new URLSearchParams(urlSearch.toString())),
      }
    );
    setPages(totalPages);
    setTotal(totalCount);

    const data = await nlpApi({
      ...Object.fromEntries(new URLSearchParams(urlSearch.toString())),
      ...{ limit: page_limit, doc_type },
    });
    setHits(data || []);

    const idz: number[] = (data || []).map((p: any) => p?.pad_id || p?.doc_id);
    setObjectIdz(idz);

    const sorted_keys: Record<string, number[]> = {};
    (data || []).forEach((item: any) => {
      const key = item.base;
      if (!sorted_keys[key]) {
        sorted_keys[key] = [];
      }
      sorted_keys[key].push(item?.pad_id || item?.doc_id);
    });
    setAllObjectIdz(sorted_keys);

    setLoading(false);
  }

  // Fetch data on component mount and when deps change
  useEffect(() => {
    fetchData();
  }, [activeTab, selectedFilters, page, search, urlSearch.toString()]);

  useEffect(() => {
    setSharedState((prevState: any) => ({
      ...prevState,
      searchData: {
        allObjectIdz,
        objectIdz,
      },
    }));
  }, [loading, allObjectIdz]);

  // update URL helper
  function pushUrlWith(params: URLSearchParams) {
    const url = `${pathname}?${params.toString()}`;

    // In browser: update the URL without triggering a navigation or scrolling
    if (typeof window !== 'undefined' && window.history && window.history.pushState) {
      window.history.pushState({}, '', url);
    }

    // Fallback to router.push on the server or when history API is unavailable
    router.push(url);
  }

  // handle clicking a top-level tab: set tab in url and clear doc_type filter so mapping applies
  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setSelectedFilters([]);
    const params = new URLSearchParams(urlSearch.toString());
    params.set('page', '1');
    params.set('tab', id);
    // clear doc_type so tab mapping is used unless user later selects filters
    params.delete('doc_type');
    pushUrlWith(params);
  };

  return (
    <>
      <section className="home-section !border-t-0 py-0">
        <div className="inner xxl:px-[80px] xxl:w-[1440px] mx-auto w-[375px] px-[20px] md:w-[744px] lg:w-[992px] lg:px-[80px] xl:w-[1200px] xl:px-[40px]">
          <ResultsInfo total={ hits.length ? total : 0} searchQuery={search} useNlp={true} />
        </div>
      </section>

      <section className="lg:home-section !border-t-0 lg:pb-[80px]">
        <div className="inner xxl:px-[80px] xxl:w-[1440px] mx-auto w-[375px] px-[20px] md:w-[744px] lg:w-[992px] lg:px-[80px] xl:w-[1200px] xl:px-[40px]">
          {/* Top-level tabs (buttons) */}
          <nav className="tabs flex items-center gap-4 mb-4">
            {Object.entries(tabDefinitions).map(([id, def]) => (
              <div
                key={id}
                className={clsx('tab tab-line mb-[10px] md:mb-0 lg:mb-0', activeTab === id ? 'font-bold' : 'yellow')}
                onClick={() => handleTabClick(id)}
              >
                {def.label}
              </div>
            ))}
          </nav>

          <div className="section-content">
            {/* Display Cards */}
            <div className="grid gap-[20px] md:grid-cols-2 xl:grid-cols-3">
              {loading ? (
                <ImgCardsSkeleton />
              ) : (
                hits?.map((post: any, i: number) => {
                  if (post?.base == 'blog') {
                    return (
                      <BlogCard
                        key={i}
                        id={post.doc_id}
                        country={
                          post?.country === 'NUL' || !post?.country
                            ? 'Global'
                            : post?.country
                        }
                        date={formatDate(post?.meta?.date) || ''}
                        title={post?.title || ''}
                        description={`${post?.snippets} ${post?.snippets?.length ? '...' : ''}`}
                        tags={post?.base || ''}
                        tagStyle="bg-light-blue"
                        href={post?.url}
                        openInNewTab={true}
                        source={post?.base || 'blog'}
                        isLogedIn={sharedState?.isLogedIn}
                        data={post}
                      />
                    );
                  } else {
                    let color: string = 'green';
                    let path: string = 'see';
                    if (post?.base === 'action plan') {
                      color = 'yellow';
                      path = 'test';
                    } else if (post?.base === 'experiment') {
                      color = 'orange';
                      path = 'test';
                    }
                    const countries = getCountryList(post, 3);
                    return (
                      <Card
                        key={i}
                        id={post?.doc_id || post?.pad_id}
                        country={countries}
                        title={post?.title || ''}
                        description={
                          post?.snippet?.length
                            ? `${post?.snippet?.length > 200 ? `${post.snippet.slice(0, 200)}…` : post.snippet}`
                            : post?.snippets
                        }
                        source={post?.base || 'solution'}
                        tagStyle={`bg-light-${color}`}
                        tagStyleShade={`bg-light-${color}-shade`}
                        href={post?.url}
                        viewCount={0}
                        tags={post?.tags}
                        sdg={
                          post?.sdg?.length ? `SDG ${post?.sdg?.join('/')}` : ''
                        }
                        backgroundImage={post?.vignette}
                        date={post?.date}
                        data={post}
                        isLogedIn={sharedState?.isLogedIn}
                      />
                    );
                  }
                })
              )}
            </div>
          </div>

          <div className="pagination">
            <div className="col-start-2 flex w-full justify-center">
              {!loading ? (
                <>
                  {hits.length ? <Pagination page={+page} totalPages={pages} /> : null}
                </>
              ) : (
                <small className="block w-full text-center">
                  Loading pagination
                </small>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
