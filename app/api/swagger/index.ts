/**
 * Modular Swagger/OpenAPI documentation
 * 
 * This file aggregates all API documentation modules into a single OpenAPI spec.
 * To add new endpoints:
 * 1. Create a new file in app/api/swagger/ for your API group
 * 2. Export a paths object with your endpoint definitions
 * 3. Import and merge it in this file
 */

import { schemas } from './schemas';
import { tagsPaths } from './tags';
import { collectionsPaths } from './collections';
import { pinboardsPaths, pinboardSchemas } from './pinboards';
import { analyticsPaths } from './analytics';
import { contentPaths } from './content';
import { uploadsPaths } from './uploads';
import { commentsPaths, commentsSchemas } from './comments';
import { engagementPaths, engagementSchemas } from './engagement';
// Admin endpoints commented out - not exposed in public API
// import { adminUsersPaths } from './admin-users';
// import { adminContentPaths } from './admin-content';
// import { adminAnalyticsPaths } from './admin-analytics';
// import { adminExportsPaths } from './admin-exports';
// import { adminNotificationsPaths } from './admin-notifications';
import { countriesPaths } from './countries';
import { regionsPaths } from './regions';
import { padsPaths } from './pads';

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'SDG Innovation Commons API',
    version: '1.0.0',
    description: 'Comprehensive API documentation for the SDG Innovation Commons platform',
    contact: {
      name: 'SDG Innovation Commons',
      url: 'https://sdg-innovation-commons.org',
    },
  },
  servers: [
    {
      url: 'https://sdg-innovation-commons.org',
      description: 'Production server',
    },
    {
      url: 'http://localhost:3000',
      description: 'Local development server',
    },
  ],
  tags: [
    {
      name: 'Tags',
      description: 'Tag management endpoints for filtering and retrieving tags',
    },
    {
      name: 'Collections',
      description: 'User-created collections of content',
    },
    {
      name: 'Comments',
      description: 'Comment and discussion management on pads',
    },
    {
      name: 'Engagement',
      description: 'User engagement (likes, useful, interesting) with content',
    },
    // {
    //   name: 'Analytics',
    //   description: 'Search and usage analytics',
    // },
    // {
    //   name: 'Content',
    //   description: 'Content management and moderation',
    // },
    // {
    //   name: 'Uploads',
    //   description: 'File upload endpoints',
    // },
    // Admin tags commented out - not exposed in public API
    // {
    //   name: 'Admin - Users',
    //   description: 'User management (admin only)',
    // },
    // {
    //   name: 'Admin - Content',
    //   description: 'Content moderation (admin only)',
    // },
    // {
    //   name: 'Admin - Analytics',
    //   description: 'Analytics and statistics (admin only)',
    // },
    // {
    //   name: 'Admin - Exports',
    //   description: 'Data export management (admin only)',
    // },
    // {
    //   name: 'Admin - Notifications',
    //   description: 'Notification management (admin only)',
    // },
    {
      name: 'Locations',
      description: 'Geographic location data for countries and regions',
    },
    {
      name: 'Pads',
      description: 'Published content (solutions, experiments, action plans, blogs)',
    },
    {
      name: 'Pinboards',
      description: 'User-created pinboards for organizing and sharing pads',
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'connect.sid',
        description: 'Session cookie authentication',
      },
    },
    schemas: {
      ...schemas,
      ...pinboardSchemas,
      ...commentsSchemas,
      ...engagementSchemas,
    },
  },
  paths: {
    // Merge all path definitions
    ...tagsPaths,
    ...collectionsPaths,
    ...pinboardsPaths,
    ...commentsPaths,
    ...engagementPaths,
    // ...analyticsPaths,
    // ...contentPaths,
    // ...uploadsPaths,
    // Admin endpoints commented out - not exposed in public API
    // ...adminUsersPaths,
    // ...adminContentPaths,
    // ...adminAnalyticsPaths,
    // ...adminExportsPaths,
    // ...adminNotificationsPaths,
    ...countriesPaths,
    ...regionsPaths,
    ...padsPaths,
  },
};
