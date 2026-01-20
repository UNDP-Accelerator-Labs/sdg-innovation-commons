/**
 * Content grid component for see page
 * @module see/components/ContentGrid
 */

'use client';

import Card from '@/app/ui/components/Card/with-img';
import { ImgCardsSkeleton } from '@/app/ui/components/Card/skeleton';
import { getCountryList } from '@/app/lib/helpers/utils';
import type { ContentItem } from '../types';

interface ContentGridProps {
  loading: boolean;
  items: ContentItem[];
  isLoggedIn: boolean;
}

export default function ContentGrid({
  loading,
  items,
  isLoggedIn,
}: ContentGridProps) {
  if (loading) {
    return (
      <div className="grid gap-[20px] md:grid-cols-2 xl:grid-cols-3">
        <ImgCardsSkeleton />
      </div>
    );
  }

  return (
    <div className="grid gap-[20px] md:grid-cols-2 xl:grid-cols-3">
      {items?.map((post) => {
        const countries = getCountryList(post, 3);
        const itemId = post.doc_id || post?.pad_id;

        return (
          <Card
            key={itemId}
            id={itemId}
            country={countries}
            title={post?.title || ''}
            description={
              post?.snippets?.length
                ? `${post?.snippets}${post?.snippets?.length ? '...' : ''}`
                : post?.snippet || ''
            }
            source={post?.base || 'solution'}
            tagStyle="bg-light-green"
            tagStyleShade="bg-light-green-shade"
            href={post?.url}
            viewCount={0}
            tags={post?.tags}
            sdg={`SDG ${post?.sdg?.join('/')}`}
            backgroundImage={post?.vignette}
            className=""
            date={post?.date}
            engagement={post?.engagement}
            data={post}
            isLogedIn={isLoggedIn}
          />
        );
      })}
    </div>
  );
}
