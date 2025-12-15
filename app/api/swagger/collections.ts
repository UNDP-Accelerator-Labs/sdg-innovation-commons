/**
 * Collections API endpoints documentation
 */
export const collectionsPaths = {
  '/api/collections': {
    get: {
      tags: ['Collections'],
      summary: 'Get all published collections',
      description: 'Retrieve all published collections with their metadata',
      responses: {
        200: {
          description: 'Successful response',
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
        500: {
          description: 'Server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
    post: {
      tags: ['Collections'],
      summary: 'Create a new collection',
      description: 'Create a new collection (requires authentication)',
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['title'],
              properties: {
                title: {
                  type: 'string',
                  minLength: 1,
                  maxLength: 500,
                },
                description: {
                  type: 'string',
                  maxLength: 5000,
                },
                main_image: {
                  type: 'string',
                },
                sections: {
                  type: 'array',
                  maxItems: 50,
                },
                boards: {
                  type: 'array',
                  items: {
                    type: 'integer',
                  },
                },
                status: {
                  type: 'string',
                  enum: ['draft', 'awaiting_review', 'published'],
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Collection created successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Collection',
              },
            },
          },
        },
        401: {
          description: 'Unauthorized',
        },
        400: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
    put: {
      tags: ['Collections'],
      summary: 'Update an existing collection',
      description: 'Update a collection (requires authentication and ownership)',
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['id'],
              properties: {
                id: {
                  type: 'integer',
                },
                title: {
                  type: 'string',
                },
                description: {
                  type: 'string',
                },
                main_image: {
                  type: 'string',
                },
                sections: {
                  type: 'array',
                },
                boards: {
                  type: 'array',
                },
                status: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Collection updated successfully',
        },
        401: {
          description: 'Unauthorized',
        },
        403: {
          description: 'Forbidden - not the owner',
        },
        404: {
          description: 'Collection not found',
        },
      },
    },
    delete: {
      tags: ['Collections'],
      summary: 'Delete a collection',
      description: 'Delete a collection (requires authentication and ownership)',
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['id'],
              properties: {
                id: {
                  type: 'integer',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Collection deleted successfully',
        },
        401: {
          description: 'Unauthorized',
        },
        403: {
          description: 'Forbidden',
        },
      },
    },
  },
  '/api/my-collections': {
    get: {
      tags: ['Collections'],
      summary: 'Get user collections',
      description: 'Get all collections created by the authenticated user, including drafts',
      security: [{ cookieAuth: [] }],
      responses: {
        200: {
          description: 'Successful response',
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
        401: {
          description: 'Unauthorized',
        },
      },
    },
  },
};
