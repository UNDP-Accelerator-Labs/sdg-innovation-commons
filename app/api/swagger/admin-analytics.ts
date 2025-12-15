/**
 * Admin Analytics API endpoints documentation
 */
export const adminAnalyticsPaths = {
  '/api/admin/stats': {
    get: {
      tags: ['Admin - Analytics'],
      summary: 'Get platform statistics',
      description: 'Get comprehensive platform statistics (admin only)',
      security: [{ cookieAuth: [] }],
      responses: {
        200: {
          description: 'Platform statistics',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  users: {
                    type: 'object',
                    properties: {
                      total: { type: 'integer' },
                      active: { type: 'integer' },
                      admins: { type: 'integer' },
                    },
                  },
                  content: {
                    type: 'object',
                    properties: {
                      pads: { type: 'integer' },
                      collections: { type: 'integer' },
                      boards: { type: 'integer' },
                    },
                  },
                  collections: {
                    type: 'object',
                  },
                },
              },
            },
          },
        },
        403: {
          description: 'Forbidden - admin only',
        },
      },
    },
  },
  '/api/admin/analytics/search': {
    get: {
      tags: ['Admin - Analytics'],
      summary: 'Get search analytics',
      description: 'Retrieve search analytics data (admin only)',
      security: [{ cookieAuth: [] }],
      parameters: [
        {
          name: 'start_date',
          in: 'query',
          description: 'Start date for analytics range',
          schema: {
            type: 'string',
            format: 'date',
          },
        },
        {
          name: 'end_date',
          in: 'query',
          description: 'End date for analytics range',
          schema: {
            type: 'string',
            format: 'date',
          },
        },
        {
          name: 'platform',
          in: 'query',
          description: 'Filter by platform',
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        200: {
          description: 'Search analytics data',
        },
        403: {
          description: 'Forbidden',
        },
      },
    },
  },
  '/api/admin/worker-health': {
    get: {
      tags: ['Admin - Analytics'],
      summary: 'Get worker health status',
      description: 'Check background worker health and status (admin only)',
      security: [{ cookieAuth: [] }],
      responses: {
        200: {
          description: 'Worker health status',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    enum: ['healthy', 'degraded', 'down'],
                  },
                  workers: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        status: { type: 'string' },
                        last_heartbeat: { type: 'string', format: 'date-time' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        403: {
          description: 'Forbidden',
        },
      },
    },
  },
  '/api/admin/countries': {
    get: {
      tags: ['Admin - Analytics'],
      summary: 'Get country statistics',
      description: 'Get user and content statistics by country (admin only)',
      security: [{ cookieAuth: [] }],
      responses: {
        200: {
          description: 'Country statistics',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    iso3: { type: 'string' },
                    name: { type: 'string' },
                    user_count: { type: 'integer' },
                    pad_count: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
        403: {
          description: 'Forbidden',
        },
      },
    },
  },
};
