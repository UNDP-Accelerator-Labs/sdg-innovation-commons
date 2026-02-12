/**
 * Search form component for test page
 * @module test/[platform]/components/SearchForm
 */

'use client';

import type React from 'react';
import { Button } from '@/app/ui/components/Button';

interface SearchFormProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  children?: React.ReactNode;
}

export default function SearchForm({
  searchQuery,
  onSearchChange,
  onSubmit,
  children,
}: SearchFormProps) {
  return (
    <form
      id="search-form"
      method="GET"
      onSubmit={onSubmit}
      className="section-header relative pb-[40px] lg:pb-[40px]"
    >
      <div className="group col-span-9 flex flex-row items-stretch lg:col-span-4">
        <input
          type="text"
          name="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="grow !border-r-0 border-black bg-white"
          id="main-search-bar"
          placeholder="What are you looking for?"
        />
        <Button type="submit" className="grow-0 border-l-0">
          Search
        </Button>
      </div>
      {children}
    </form>
  );
}
