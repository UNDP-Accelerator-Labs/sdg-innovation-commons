/**
 * Platform tabs navigation component
 * @module test/[platform]/components/PlatformTabs
 */

'use client';

import clsx from 'clsx';
import Link from 'next/link';

interface PlatformTabsProps {
  tabs: string[];
  currentPlatform: string;
  searchParams: URLSearchParams;
}

export default function PlatformTabs({
  tabs,
  currentPlatform,
  searchParams,
}: PlatformTabsProps) {
  return (
    <nav className="tabs items-end">
      {tabs.map((tab, index) => {
        const displayText = tab === 'all' ? 'all items' : tab;
        const finalText = `${displayText}${displayText.slice(-1) === 's' ? '' : 's'}`;

        return (
          <div
            key={index}
            className={clsx(
              'tab tab-line',
              currentPlatform === tab ? 'font-bold' : 'yellow'
            )}
          >
            <Link
              href={`/test/${tab}?${searchParams.toString()}`}
              scroll={false}
            >
              {finalText}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
