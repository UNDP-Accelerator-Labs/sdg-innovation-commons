/**
 * Collection grid component for next-practices page
 * @module next-practices/components/CollectionGrid
 */

'use client';

import CollectionCard from './CollectionCard';
import { getCollectionStatus } from '../utils';
import type { Collection } from '../types';

interface CollectionGridProps {
  collections: Collection[];
  showStatus: boolean;
}

export default function CollectionGrid({
  collections,
  showStatus,
}: CollectionGridProps) {
  return (
    <div className="grid gap-[20px] md:grid-cols-2 lg:grid-cols-3">
      {collections.map((collection, index) => (
        <CollectionCard
          key={collection.slug || collection.id || index}
          collection={collection}
          showStatus={showStatus}
          status={getCollectionStatus(collection)}
        />
      ))}
    </div>
  );
}
