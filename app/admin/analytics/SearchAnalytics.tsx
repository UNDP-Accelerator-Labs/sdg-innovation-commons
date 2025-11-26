'use client';

import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Users, BarChart3, Filter, Calendar, Download } from 'lucide-react';
import { Button } from '@/app/ui/components/Button';
import WordCloud from '@/app/ui/components/WordCloud';

interface WordCloudData {
  text: string;
  size: number;
  platform?: string;
  daysUsed?: number;
}

interface SearchStats {
  total_searches: number;
  unique_queries: number;
  unique_users: number;
  platforms_searched: number;
  avg_results_per_search: number;
  first_search: string;
  latest_search: string;
}

interface SearchSummary {
  query: string;
  platform: string;
  search_type: string;
  search_count: number;
  avg_results: number;
  unique_users: number;
  first_searched: string;
  last_searched: string;
}

interface TrendData {
  search_date: string;
  platform: string;
  daily_searches: number;
  unique_queries: number;
  unique_users: number;
}

interface PlatformData {
  name: string;
  searchCount: number;
  uniqueQueries: number;
  uniqueUsers: number;
  latestSearch: string;
}

export default function SearchAnalytics() {
  const [wordCloudData, setWordCloudData] = useState<WordCloudData[]>([]);
  const [stats, setStats] = useState<SearchStats | null>(null);
  const [summary, setSummary] = useState<SearchSummary[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [platforms, setPlatforms] = useState<PlatformData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedDays, setSelectedDays] = useState<number>(30);
  const [activeTab, setActiveTab] = useState<'overview' | 'wordcloud' | 'trends' | 'queries'>('overview');

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        days: selectedDays.toString(),
        limit: '100',
        ...(selectedPlatform && selectedPlatform !== 'all' && { platform: selectedPlatform })
      });

      // Fetch all analytics data including platforms
      const [statsRes, wordcloudRes, summaryRes, trendsRes, platformsRes] = await Promise.all([
        fetch(`/api/admin/analytics/search?type=stats&${params}`),
        fetch(`/api/admin/analytics/search?type=wordcloud&${params}`),
        fetch(`/api/admin/analytics/search?type=summary&${params}`),
        fetch(`/api/admin/analytics/search?type=trends&${params}`),
        fetch(`/api/admin/analytics/search?type=platforms&days=${selectedDays}`)
      ]);

      if (!statsRes.ok || !wordcloudRes.ok || !summaryRes.ok || !trendsRes.ok || !platformsRes.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const [statsData, wordcloudData, summaryData, trendsData, platformsData] = await Promise.all([
        statsRes.json(),
        wordcloudRes.json(),
        summaryRes.json(),
        trendsRes.json(),
        platformsRes.json()
      ]);

      setStats(statsData.stats);
      setWordCloudData(wordcloudData.wordcloud || []);
      setSummary(summaryData.summary || []);
      setTrends(trendsData.trends || []);
      setPlatforms(platformsData.platforms || []);

    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPlatform, selectedDays]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatPlatformName = (platformName: string) => {
    // Convert platform names to more readable format
    const nameMap: Record<string, string> = {
      'what-we-learn': 'What We Learn',
      'what-we-see': 'What We See', 
      'what-we-test': 'What We Test',
      'boards': 'Boards',
      'general': 'General Search',
      'global-search': 'Global Search',
      'solutions': 'Solutions',
      'experiments': 'Experiments',
      'action-plans': 'Action Plans',
      'pads': 'Pads',
      'next-practices': 'Next Practices'
    };
    
    return nameMap[platformName] || platformName.charAt(0).toUpperCase() + platformName.slice(1);
  };

  if (loading) {
    return (
      <div className="bg-white border-2 border-black border-solid rounded p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border-2 border-black border-solid rounded p-6">
        <div className="text-center text-red-600">
          <p className="text-lg font-medium">Error Loading Analytics</p>
          <p className="text-sm mt-2">{error}</p>
          <Button 
            onClick={fetchAnalytics}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="bg-white border-2 border-black border-solid rounded p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Search Analytics</h2>
            <p className="text-gray-600">Monitor user search behavior and trending queries across platforms</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Platforms</option>
              {platforms.map(platform => (
                <option key={platform.name} value={platform.name}>
                  {formatPlatformName(platform.name)} ({platform.searchCount} searches)
                </option>
              ))}
            </select>
            
            <select
              value={selectedDays}
              onChange={(e) => setSelectedDays(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 3 months</option>
              <option value={365}>Last year</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Searches</p>
                  <p className="text-2xl font-bold text-blue-900">{formatNumber(stats.total_searches)}</p>
                </div>
                <Search className="h-8 w-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Active Searchers</p>
                  <p className="text-2xl font-bold text-green-900">{formatNumber(stats.unique_users)}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Unique Queries</p>
                  <p className="text-2xl font-bold text-orange-900">{formatNumber(stats.unique_queries)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Avg Results</p>
                  <p className="text-2xl font-bold text-purple-900">{Math.round(stats.avg_results_per_search)}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'wordcloud', label: 'Word Cloud', icon: TrendingUp },
              { key: 'queries', label: 'Top Queries', icon: Search },
              { key: 'trends', label: 'Trends', icon: Calendar }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 inline mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white border-2 border-black border-solid rounded p-6">
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Search Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Key Metrics</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Platforms Searched:</dt>
                    <dd className="text-sm font-medium">{stats.platforms_searched}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">First Search:</dt>
                    <dd className="text-sm font-medium">{stats.first_search ? formatDate(stats.first_search) : 'N/A'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Latest Search:</dt>
                    <dd className="text-sm font-medium">{stats.latest_search ? formatDate(stats.latest_search) : 'N/A'}</dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Search Efficiency</h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Average results per search:</dt>
                    <dd className="text-sm font-medium">{Math.round(stats.avg_results_per_search)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Queries per user:</dt>
                    <dd className="text-sm font-medium">{(stats.unique_queries / Math.max(stats.unique_users, 1)).toFixed(2)}</dd>
                  </div>
                  </dl>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wordcloud' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Search Terms Word Cloud</h3>
              <p className="text-sm text-gray-600">
                Showing {wordCloudData.length} most frequent search terms
              </p>
            </div>
            <WordCloud data={wordCloudData} width={800} height={500} className="mx-auto" />
          </div>
        )}

        {activeTab === 'queries' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Top Search Queries</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-900">Query</th>
                    <th className="px-4 py-3 font-medium text-gray-900">Platform</th>
                    <th className="px-4 py-3 font-medium text-gray-900">Count</th>
                    <th className="px-4 py-3 font-medium text-gray-900">Users</th>
                    <th className="px-4 py-3 font-medium text-gray-900">Avg Results</th>
                    <th className="px-4 py-3 font-medium text-gray-900">Last Search</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {summary.slice(0, 20).map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{item.query}</td>
                      <td className="px-4 py-3 text-gray-600 capitalize">{item.platform || 'All'}</td>
                      <td className="px-4 py-3 text-gray-900">{item.search_count}</td>
                      <td className="px-4 py-3 text-gray-600">{item.unique_users}</td>
                      <td className="px-4 py-3 text-gray-600">{Math.round(item.avg_results)}</td>
                      <td className="px-4 py-3 text-gray-600">{formatDate(item.last_searched)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Search Trends</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-900">Date</th>
                    <th className="px-4 py-3 font-medium text-gray-900">Platform</th>
                    <th className="px-4 py-3 font-medium text-gray-900">Searches</th>
                    <th className="px-4 py-3 font-medium text-gray-900">Unique Queries</th>
                    <th className="px-4 py-3 font-medium text-gray-900">Unique Users</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {trends.slice(0, 30).map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{formatDate(item.search_date)}</td>
                      <td className="px-4 py-3 text-gray-600 capitalize">{item.platform || 'All'}</td>
                      <td className="px-4 py-3 text-gray-900">{item.daily_searches}</td>
                      <td className="px-4 py-3 text-gray-600">{item.unique_queries}</td>
                      <td className="px-4 py-3 text-gray-600">{item.unique_users}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
