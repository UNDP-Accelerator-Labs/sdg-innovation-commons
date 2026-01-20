/**
 * Type definitions for the next-practices (learn) page
 * @module next-practices/types
 */

/**
 * Collection item
 */
export interface Collection {
  id: number | string;
  slug?: string;
  title: string;
  description?: string;
  main_image?: string;
  mainImage?: string;
  status?: string;
  creator_name?: string;
  creatorName?: string;
  creator?: string;
  boards?: any[];
  highlights?: {
    status?: string;
    awaiting_review?: boolean;
    review?: boolean;
    comments?: any[];
  };
}

/**
 * Props for next-practices section component
 */
export interface SectionProps {
  searchParams: any;
}

/**
 * Collection status type
 */
export type CollectionTab = 'public' | 'my';
