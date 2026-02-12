/**
 * Admin Content Management API endpoints documentation
 */
export const adminContentPaths = {
  '/api/admin/content/flag-actions': {
    get: {
      tags: ['Admin - Content'],
      summary: 'Get flagged content',
      description: 'Retrieve all flagged content for review (admin only)',
      security: [{ cookieAuth: [] }],
      responses: {
        200: {
          description: 'List of flagged content',
        },
        403: {
          description: 'Forbidden',
        },
      },
    },
  },
  '/api/admin/content/flag-action': {
    post: {
      tags: ['Admin - Content'],
      summary: 'Take action on flagged content',
      description: 'Approve or remove flagged content (admin only)',
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['flag_id', 'action'],
              properties: {
                flag_id: {
                  type: 'integer',
                },
                action: {
                  type: 'string',
                  enum: ['approve', 'remove', 'dismiss'],
                },
                notes: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Action completed',
        },
        403: {
          description: 'Forbidden',
        },
      },
    },
  },
  '/api/admin/collections': {
    get: {
      tags: ['Admin - Content'],
      summary: 'Get all collections for review',
      description: 'Get all collections including drafts and pending review (admin only)',
      security: [{ cookieAuth: [] }],
      responses: {
        200: {
          description: 'List of collections',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Collection',
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
