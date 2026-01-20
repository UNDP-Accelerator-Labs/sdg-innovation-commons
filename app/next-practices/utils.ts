/**
 * Utility functions for next-practices page
 * @module next-practices/utils
 */

import type { Collection } from './types';

/**
 * Get human-friendly status for a collection
 */
export function getCollectionStatus(collection: Collection): string {
  // Check for explicit status in highlights first
  if (collection?.highlights?.status) {
    return collection.highlights.status
      .split('_')
      .filter(Boolean)
      .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }

  // Check top-level status field
  if (collection?.status && typeof collection.status === 'string') {
    return collection.status
      .split('_')
      .filter(Boolean)
      .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }

  // Review flags in highlights
  if (collection?.highlights && typeof collection.highlights === 'object') {
    // If awaiting_review is set
    if (collection.highlights.awaiting_review || collection.highlights?.review === true) {
      return 'Awaiting Review';
    }
    // If there are comments
    if (
      Array.isArray(collection.highlights?.comments) &&
      collection.highlights.comments.length > 0
    ) {
      return 'Review: Comments';
    }
  }

  // Public if it has boards attached
  if (Array.isArray(collection?.boards) && collection.boards.length > 0) {
    return 'Public';
  }

  // If creator exists but no boards -> draft
  if (collection?.creator_name || collection?.creatorName || collection?.creator) {
    return 'Draft';
  }

  return 'Draft';
}

/**
 * Get status badge styling classes
 */
export function getStatusBadgeClasses(status: string): string {
  const baseClasses = 'absolute top-12 right-2 px-2 py-1 border rounded text-xs font-semibold';
  
  if (status === 'Published' || status === 'Public') {
    return `${baseClasses} bg-green-100 text-green-800 border-green-300`;
  }
  
  if (status === 'Rejected') {
    return `${baseClasses} bg-red-100 text-red-800 border-red-300`;
  }
  
  if (status.startsWith('Review') || status === 'Awaiting Review') {
    return `${baseClasses} bg-yellow-100 text-yellow-800 border-yellow-300`;
  }
  
  return `${baseClasses} bg-gray-100 text-gray-800 border-gray-300`;
}
