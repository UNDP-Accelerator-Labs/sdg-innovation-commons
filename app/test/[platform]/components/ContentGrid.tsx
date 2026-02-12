/**
 * Content grid component for displaying cards
 * @module test/[platform]/components/ContentGrid
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
  platform: string;
}

export default function ContentGrid({
  loading,
  items,
  isLoggedIn,
  platform,
}: ContentGridProps) {
  if (loading) {
    return (
      <div className="grid gap-[20px] md:grid-cols-2 xl:grid-cols-3">
        <ImgCardsSkeleton />
      </div>
    );
  }

  console.log('items in ContentGrid:', items);
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
            source={post?.base || ''}
            tagStyle={
              post?.base === 'action plan'
                ? 'bg-light-yellow'
                : 'bg-light-orange'
            }
            tagStyleShade={
              post?.base === 'action plan'
                ? 'bg-light-yellow-shade'
                : 'bg-light-orange-shade'
            }
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
