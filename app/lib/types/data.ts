/**
 * Data layer type definitions
 * @module lib/types/data
 */

/**
 * External database entry
 */
export interface ExternalDbEntry {
  id: number;
  db: string;
  name?: string;
}

/**
 * Contact form state
 */
export interface ContactFormState {
  success?: boolean;
  error?: string;
  message?: string;
}

/**
 * Collection/Board metadata
 */
export interface CollectionMetadata {
  id: number;
  title: string;
  description?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
  owner_uuid?: string;
  is_public?: boolean;
  item_count?: number;
}

/**
 * Board card data
 */
export interface BoardCard {
  id: number;
  doc_id: number;
  platform: string;
  title: string;
  description?: string;
  image?: string;
  url?: string;
  tags?: string[];
  sdgs?: number[];
  countries?: string[];
}

/**
 * Contributor information
 */
export interface ContributorInfo {
  uuid: string;
  name: string;
  email?: string;
  iso3?: string;
  contribution_count?: number;
}

/**
 * Notification data
 */
export interface NotificationData {
  id: number;
  recipient_uuid: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  data?: Record<string, any>;
}

/**
 * Analytics event
 */
export interface AnalyticsEvent {
  event_type: string;
  user_uuid?: string;
  session_id?: string;
  data: Record<string, any>;
  timestamp?: string;
}

/**
 * Search tracking options
 */
export interface SearchTrackingOptions {
  searchTerm: string;
  platform?: string;
  filters?: Record<string, any>;
  resultCount?: number;
  userUuid?: string;
  sessionId?: string;
}
