/**
 * Analytics API endpoints documentation
 */
export const analyticsPaths = {
  '/api/analytics/search': {
    post: {
      tags: ['Analytics'],
      summary: 'Track search event',
      description: 'Log a search analytics event',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['query', 'platform'],
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query string',
                },
                platform: {
                  type: 'string',
                  description: 'Platform where search occurred',
                },
                filters: {
                  type: 'object',
                  description: 'Applied filters',
                },
                results_count: {
                  type: 'integer',
                  description: 'Number of results returned',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Event tracked successfully',
        },
        400: {
          description: 'Invalid request',
        },
      },
    },
  },
};
