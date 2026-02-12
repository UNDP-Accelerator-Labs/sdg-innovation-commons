/**
 * Collection card component for next-practices page
 * @module next-practices/components/CollectionCard
 */

'use client';

import Card from '@/app/ui/components/Card/collection-card';
import { getStatusBadgeClasses } from '../utils';
import type { Collection } from '../types';

interface CollectionCardProps {
  collection: Collection;
  showStatus: boolean;
  status: string;
}

export default function CollectionCard({
  collection,
  showStatus,
  status,
}: CollectionCardProps) {
  return (
    <div className="relative">
      {showStatus && (
        <div
          className={getStatusBadgeClasses(status)}
          style={{ zIndex: 50 }}
        >
          {status}
        </div>
      )}
      <Card
        id={collection.slug || collection.id}
        title={collection.title}
        description=""
        tags={[]}
        href={`/next-practices/${collection.slug || collection.id}`}
        viewCount={(collection.boards || []).length}
        backgroundImage={collection.main_image || collection.mainImage}
        openInNewTab={false}
        className="mt-10"
      />
    </div>
  );
}
