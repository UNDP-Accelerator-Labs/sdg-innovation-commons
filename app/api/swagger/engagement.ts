/**
 * Engagement API Documentation
 * Endpoints for managing user engagement with content (likes, dislikes, useful, interesting)
 */

export const engagementPaths = {
  '/api/engagement': {
    post: {
      tags: ['Engagement'],
      summary: 'Engage with content',
      description: 'Add or remove engagement (like, dislike, useful, interesting, no_opinion) on pads. Requires authentication via session cookie or API token.',
      security: [{ cookieAuth: [] }, { bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['action', 'id', 'object', 'type'],
              properties: {
                action: {
                  type: 'string',
                  enum: ['insert', 'delete'],
                  description: 'Action to perform - insert to add engagement, delete to remove',
                },
                id: {
                  type: 'integer',
                  description: 'ID of the content (pad)',
                },
                object: {
                  type: 'string',
                  enum: ['pad'],
                  description: 'Type of content being engaged with',
                },
                type: {
                  type: 'string',
                  enum: ['like', 'dislike', 'useful', 'interesting', 'no_opinion'],
                  description: 'Type of engagement',
                },
                token: {
                  type: 'string',
                  description: 'API access token (alternative to Authorization header)',
                },
              },
            },
            examples: {
              addLike: {
                summary: 'Add a like',
                value: {
                  action: 'insert',
                  id: 11104,
                  object: 'pad',
                  type: 'like',
                },
              },
              markUseful: {
                summary: 'Mark as useful',
                value: {
                  action: 'insert',
                  id: 11104,
                  object: 'pad',
                  type: 'useful',
                },
              },
              removeEngagement: {
                summary: 'Remove engagement',
                value: {
                  action: 'delete',
                  id: 11104,
                  object: 'pad',
                  type: 'like',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Engagement updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'integer',
                    example: 200,
                  },
                  data: {
                    type: 'object',
                    properties: {
                      active: {
                        type: 'boolean',
                        nullable: true,
                        description: 'true if engagement is active, null if removed',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Bad request - missing required fields or not logged in',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'integer',
                    example: 400,
                  },
                  message: {
                    type: 'string',
                    example: 'You need to be logged in to engage with content.',
                  },
                },
              },
            },
          },
        },
        500: {
          description: 'Server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'integer',
                    example: 500,
                  },
                  message: {
                    type: 'string',
                    example: 'An unexpected error occurred.',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const engagementSchemas = {
  Engagement: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        enum: ['like', 'dislike', 'useful', 'interesting', 'no_opinion'],
        description: 'Type of engagement',
      },
      count: {
        type: 'integer',
        description: 'Number of users who selected this engagement type',
      },
      active: {
        type: 'boolean',
        nullable: true,
        description: 'Whether the current user has this engagement active',
      },
    },
  },
};
