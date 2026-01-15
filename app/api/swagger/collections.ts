/**
 * Next Practices (Collections) API endpoints documentation
 * 
 * Next Practices are curated collections that showcase emerging approaches to achieving the SDGs
 * through what we see (solutions), what we test (experiments), and what we learn (insights).
 */
export const collectionsPaths = {
  '/api/collections': {
    get: {
      tags: ['Collections'],
      summary: 'Get Next Practices by filter',
      description: `Retrieve Next Practices (curated collections) filtered by various parameters. 
      
Next Practices showcase how the platform is uncovering emerging solutions for sustainable development by connecting insights from:
- What We See (solutions)
- What We Test (experiments and action plans)
- What We Learn (blogs and publications)`,
      parameters: [
        {
          name: 'slug',
          in: 'query',
          description: 'Fetch a specific Next Practice by its slug',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'list',
          in: 'query',
          description: 'List published Next Practices (use value "public")',
          schema: {
            type: 'string',
            enum: ['public'],
          },
        },
        {
          name: 'owner',
          in: 'query',
          description: 'Filter Next Practices by creator UUID. If the logged-in user matches the creator, returns all their collections (including drafts). Otherwise, only returns published collections.',
          schema: {
            type: 'string',
            format: 'uuid',
          },
        },
        {
          name: 'limit',
          in: 'query',
          description: 'Maximum number of Next Practices to return (max 100)',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 12,
          },
        },
        {
          name: 'offset',
          in: 'query',
          description: 'Number of Next Practices to skip for pagination',
          schema: {
            type: 'integer',
            minimum: 0,
            default: 0,
          },
        },
      ],
      responses: {
        200: {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: {
                oneOf: [
                  {
                    // Single collection by slug
                    $ref: '#/components/schemas/Collection',
                  },
                  {
                    // Array of collections (public or owner filtered)
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Collection',
                    },
                  },
                  {
                    // Owner filtered response with count
                    type: 'object',
                    properties: {
                      data: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Collection',
                        },
                      },
                      count: {
                        type: 'integer',
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        400: {
          description: 'Bad request - missing or invalid parameters',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        404: {
          description: 'Next Practice not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
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
      summary: 'Create a new Next Practice',
      description: 'Create a new Next Practice collection (requires authentication)',
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
          description: 'Next Practice created successfully',
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
