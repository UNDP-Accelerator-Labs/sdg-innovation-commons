/**
 * Centralized type definitions barrel export
 * @module lib/types
 */

// Common types
export type {
  ConnectionConfig,
  DBKey,
  PostProps,
  IncomingRequestParams,
  PaginatedResponse,
  ApiErrorResponse,
  HttpMethod,
  SuccessResponse,
} from './common';

// Authentication types
export type {
  SessionInfo,
  ApiAuthResult,
  LoginCredentials,
  PasswordResetRequest,
  PasswordUpdateRequest,
  TokenValidationResponse,
} from './auth';

export { UserRights } from './auth';

// Platform types
export type {
  PlatformType,
  PlatformShortkey,
  PlatformConfig,
  PlatformApiParams,
  PadFilterParams,
  NlpApiParams,
  ContentRemovalParams,
} from './platform';

// Data types
export type {
  ExternalDbEntry,
  ContactFormState,
  CollectionMetadata,
  BoardCard,
  ContributorInfo,
  NotificationData,
  AnalyticsEvent,
  SearchTrackingOptions,
} from './data';
