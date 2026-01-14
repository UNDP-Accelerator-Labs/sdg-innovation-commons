/**
 * Comments API Documentation
 * Endpoints for managing comments on pads (solutions, experiments, etc.)
 */

export const commentsPaths = {
  '/api/comments': {
    post: {
      tags: ['Comments'],
      summary: 'Add or delete a comment',
      description: 'Add a new comment to content or delete an existing comment. Requires authentication.',
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              oneOf: [
                {
                  type: 'object',
                  title: 'Add Comment',
                  required: ['object', 'id', 'message', 'action'],
                  properties: {
                    action: {
                      type: 'string',
                      enum: ['add'],
                      description: 'Action type',
                    },
                    object: {
                      type: 'string',
                      enum: ['pad'],
                      description: 'Type of content being commented on',
                    },
                    id: {
                      type: 'integer',
                      description: 'ID of the content (pad)',
                    },
                    message: {
                      type: 'string',
                      description: 'Comment text content',
                    },
                    source: {
                      type: 'integer',
                      nullable: true,
                      description: 'Parent comment ID for replies (optional)',
                    },
                  },
                },
                {
                  type: 'object',
                  title: 'Delete Comment',
                  required: ['action', 'comment_id'],
                  properties: {
                    action: {
                      type: 'string',
                      enum: ['delete'],
                      description: 'Action type',
                    },
                    comment_id: {
                      type: 'integer',
                      description: 'ID of the comment to delete',
                    },
                  },
                },
              ],
            },
            examples: {
              addComment: {
                summary: 'Add a new comment',
                value: {
                  action: 'add',
                  object: 'pad',
                  id: 11104,
                  message: 'Great solution! Would love to learn more.',
                  source: null,
                },
              },
              addReply: {
                summary: 'Reply to existing comment',
                value: {
                  action: 'add',
                  object: 'pad',
                  id: 11104,
                  message: 'Thanks for your interest!',
                  source: 147,
                },
              },
              deleteComment: {
                summary: 'Delete a comment',
                value: {
                  action: 'delete',
                  comment_id: 147,
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Comment added or deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'integer',
                    example: 200,
                  },
                  message: {
                    type: 'string',
                    example: 'Comment added successfully.',
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

export const commentsSchemas = {
  Comment: {
    type: 'object',
    properties: {
      message_id: {
        type: 'integer',
        description: 'Unique comment identifier',
      },
      response_to_message_id: {
        type: 'integer',
        nullable: true,
        description: 'Parent comment ID for nested replies',
      },
      user_id: {
        type: 'string',
        format: 'uuid',
        nullable: true,
        description: 'UUID of comment author (null if anonymized)',
      },
      ownername: {
        type: 'string',
        description: 'Display name of comment author',
      },
      date: {
        type: 'string',
        format: 'date-time',
        description: 'Comment creation timestamp',
      },
      message: {
        type: 'string',
        description: 'Comment text content',
      },
    },
  },
};
