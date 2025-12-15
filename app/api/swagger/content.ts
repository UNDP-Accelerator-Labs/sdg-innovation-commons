/**
 * Content API endpoints documentation
 */
export const contentPaths = {
  '/api/content/flag': {
    post: {
      tags: ['Content'],
      summary: 'Flag content for review',
      description: 'Report inappropriate content for moderation',
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['content_id', 'content_type', 'reason'],
              properties: {
                content_id: {
                  type: 'integer',
                  description: 'ID of the content being flagged',
                },
                content_type: {
                  type: 'string',
                  enum: ['pad', 'collection', 'comment'],
                  description: 'Type of content',
                },
                reason: {
                  type: 'string',
                  enum: ['spam', 'inappropriate', 'misleading', 'other'],
                  description: 'Reason for flagging',
                },
                details: {
                  type: 'string',
                  description: 'Additional details',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Content flagged successfully',
        },
        401: {
          description: 'Unauthorized',
        },
        400: {
          description: 'Invalid request',
        },
      },
    },
  },
};
