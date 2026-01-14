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
import { articlesPaths } from './articles';
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
    description: `Comprehensive API documentation for the SDG Innovation Commons platform.

## About the Platform

The SDG Innovation Commons is a platform for sharing and discovering sustainable development innovations through:

- **What We See** - Solutions and notes on SDG priorities and problems mapped around the world
- **What We Test** - Experiments and action plans to test what works in sustainable development
- **What We Learn** - Curated blogs and publications fostering collaboration and continuous learning
- **Community Curated Boards** - User-created collections organizing content by theme
- **Next Practices** - Curated collections showcasing emerging approaches to achieve the SDGs`,
    contact: {
      name: 'SDG Innovation Commons',
      url: 'https://sdg-innovation-commons.org',
    },
  },
  servers: process.env.NODE_ENV === 'production' 
    ? [
        {
          url: 'https://sdg-innovation-commons.org',
          description: 'Production server',
        },
      ]
    : [
        {
          url: 'http://localhost:3000',
          description: 'Local development server',
        },
      ],
  tags: [
    {
      name: 'Tags',
      description: 'Tag management endpoints for filtering and retrieving thematic areas, SDGs, and other categorizations',
    },
    {
      name: 'Collections',
      description: 'Next Practices - Curated collections showcasing emerging approaches and solutions for achieving the SDGs through what we see, test, and learn',
    },
    {
      name: 'Comments',
      description: 'Discussion and feedback on content - enabling collaborative learning and knowledge exchange',
    },
    {
      name: 'Engagement',
      description: 'User engagement metrics (likes, useful, interesting) with content - helping surface valuable insights',
    },
    {
      name: 'Locations',
      description: 'Geographic location data for countries and regions - mapping innovations around the world',
    },
    {
      name: 'Articles',
      description: 'What We Learn - Blogs and publications fostering collaboration and continuous learning',
    },
    {
      name: 'Pads',
      description: 'Published content representing What We See (solutions) and What We Test (experiments, action plans)',
    },
    {
      name: 'Pinboards',
      description: 'Community Curated Boards - User-created collections organizing and sharing content by theme or topic',
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
    ...articlesPaths,
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
