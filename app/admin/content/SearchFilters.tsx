'use client';

import { Button } from "@/app/ui/components/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface SearchFiltersProps {
  initialQ?: string;
  initialStatus?: string;
  initialLimit?: number;
  initialPage?: number;
}

export default function SearchFilters({ 
  initialQ = "", 
  initialStatus = "", 
  initialLimit = 10,
  initialPage = 1 
}: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    
    const q = formData.get('q') as string;
    const status = formData.get('status') as string;
    const limit = formData.get('limit') as string;
    
    if (q?.trim()) params.set('q', q.trim());
    if (status) params.set('status', status);
    if (limit && limit !== '10') params.set('limit', limit);
    // Always reset to page 1 when searching/filtering
    
    const url = `/admin/content${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(url);
    setIsSubmitting(false);
  };

  const handleFilterChange = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    
    // Reset to page 1 when filtering
    params.delete('page');
    
    const url = `/admin/content${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(url);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="bg-white border-2 border-black rounded p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
          {/* Search input and button */}
          <div className="lg:col-span-6">
            {/* <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Content
            </label> */}
            <div className="flex">
              <input
                type="text"
                name="q"
                defaultValue={initialQ}
                placeholder="Search by content title, reason, or description..."
                className="flex-1 px-3 py-2 border border-black border-r-0 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="px-4 py-2 border-l-0 rounded-l-none"
              >
                {isSubmitting ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>
          
          {/* Status filter */}
          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              name="status"
              defaultValue={initialStatus}
              className="w-full px-3 py-2 border border-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>

          {/* Per page filter */}
          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Results per Page
            </label>
            <select
              name="limit"
              defaultValue={initialLimit}
              className="w-full px-3 py-2 border border-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => handleFilterChange('limit', e.target.value)}
            >
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>
          </div>
        </div>
      </div>
    </form>
  );
}
