/**
 * Collection tabs component for next-practices page
 * @module next-practices/components/CollectionTabs
 */

'use client';

import clsx from 'clsx';
import type { CollectionTab } from '../types';

interface CollectionTabsProps {
  activeTab: CollectionTab;
  onTabChange: (tab: CollectionTab) => void;
  showTabs: boolean;
}

export default function CollectionTabs({
  activeTab,
  onTabChange,
  showTabs,
}: CollectionTabsProps) {
  if (!showTabs) return null;

  const tabs: { key: CollectionTab; label: string }[] = [
    { key: 'public', label: 'Public Collections' },
    { key: 'my', label: 'My Collections' },
  ];

  return (
    <nav className="tabs">
      {tabs.map((tab) => (
        <div
          key={tab.key}
          className={clsx(
            'tab tab-line',
            activeTab === tab.key ? 'font-bold' : 'yellow'
          )}
        >
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onTabChange(tab.key);
            }}
          >
            {tab.label}
          </a>
        </div>
      ))}
    </nav>
  );
}
