/**
 * Community Curated Boards API endpoints documentation
 * 
 * Community Curated Boards allow users to create thematic collections organized
 * by connecting related content from "What We See" (solutions), "What We Test" 
 * (experiments and action plans), and "What We Learn" (blogs and publications).
 */
export const pinboardsPaths = {
  '/api/pinboards': {
    get: {
      tags: ['Pinboards'],
      summary: 'List or get Community Curated Boards',
      description: 'Retrieve boards with filtering, search, and pagination. Returns either a list of boards or a detailed single board with its content.',
      parameters: [
        {
          name: 'pinboard',
          in: 'query',
          description: 'Single board ID or comma-separated list of IDs. If omitted or multiple provided, returns list of boards. If single ID provided, returns detailed board with its content.',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'page',
          in: 'query',
          description: 'Page number for pagination. In list mode, applies to boards. In single board mode, applies to content items within the board.',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
          },
        },
        {
          name: 'limit',
          in: 'query',
          description: 'Items per page',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 10,
          },
        },
        {
          name: 'space',
          in: 'query',
          description: 'Filter by visibility: "private" (user\'s own), "published" (public, status > 2), "all" (both, default)',
          schema: {
            type: 'string',
            enum: ['private', 'published', 'all'],
            default: 'all',
          },
        },
        {
          name: 'owner',
          in: 'query',
          description: 'Filter boards by creator UUID. If the logged-in user matches the creator, returns all their boards (including drafts with status <= 2). Otherwise, only returns published boards (status > 2).',
          schema: {
            type: 'string',
            format: 'uuid',
          },
        },
        {
          name: 'databases',
          in: 'query',
          description: 'Filter by platform/content type. Comma-separated list. Possible values: solutions (What We See), experiments, action-plans (What We Test), blogs, publications (What We Learn).',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'search',
          in: 'query',
          description: 'Search in board title and description',
          schema: {
            type: 'string',
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
                    type: 'object',
                    description: 'Multiple boards response',
                    properties: {
                      count: {
                        type: 'integer',
                        description: 'Total number of boards',
                      },
                      data: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Pinboard',
                        },
                      },
                    },
                  },
                  {
                    $ref: '#/components/schemas/PinboardDetailed',
                    description: 'Single board response with content',
                  },
                ],
              },
            },
          },
        },
        500: {
          description: 'Server error',
        },
      },
    },
    post: {
      tags: ['Pinboards'],
      summary: 'List or get pinboards (POST)',
      description: 'Same as GET but accepts parameters in request body',
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                pinboard: {
                  oneOf: [
                    { type: 'string' },
                    { type: 'array', items: { type: 'string' } },
                  ],
                  description: 'Single pinboard ID or array of IDs',
                },
                page: {
                  type: 'integer',
                  minimum: 1,
                },
                limit: {
                  type: 'integer',
                  minimum: 1,
                },
                space: {
                  type: 'string',
                  enum: ['private', 'published', 'all'],
                },
                databases: {
                  oneOf: [
                    { type: 'string' },
                    { type: 'array', items: { type: 'string' } },
                  ],
                },
                search: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: {
                oneOf: [
                  {
                    type: 'object',
                    properties: {
                      count: { type: 'integer' },
                      data: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/Pinboard' },
                      },
                    },
                  },
                  { $ref: '#/components/schemas/PinboardDetailed' },
                ],
              },
            },
          },
        },
      },
    },
  },
  '/api/pinboards/create': {
    post: {
      tags: ['Pinboards'],
      summary: 'Create a new pinboard',
      description: 'Creates a new pinboard or returns existing one if title + owner combination exists. Automatically adds creator as contributor.',
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
                  description: 'Pinboard title (required)',
                },
                description: {
                  type: 'string',
                  description: 'Pinboard description',
                },
                mobilization: {
                  type: 'string',
                  description: 'Associated mobilization ID',
                },
                status: {
                  type: 'integer',
                  description: 'Publication status: 1=draft, 2=review, 3+=published',
                  default: 1,
                },
                display_filters: {
                  type: 'boolean',
                  description: 'Show filters on pinboard view',
                  default: false,
                },
                display_map: {
                  type: 'boolean',
                  description: 'Show map on pinboard view',
                  default: false,
                },
                display_fullscreen: {
                  type: 'boolean',
                  description: 'Enable fullscreen mode',
                  default: false,
                },
                slideshow: {
                  type: 'boolean',
                  description: 'Enable slideshow mode',
                  default: false,
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Pinboard created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  pinboard: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      title: { type: 'string' },
                      description: { type: 'string' },
                      date: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Bad request - missing required fields',
        },
        403: {
          description: 'Unauthorized - user not logged in',
        },
      },
    },
  },
  '/api/pinboards/delete': {
    post: {
      tags: ['Pinboards'],
      summary: 'Delete pinboard(s)',
      description: 'Deletes one or more pinboards and their contributions. Only owners, contributors, or super users can delete.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['pinboard'],
              properties: {
                pinboard: {
                  oneOf: [
                    { type: 'integer' },
                    { type: 'string' },
                    { type: 'array', items: { type: 'integer' } },
                  ],
                  description: 'Single pinboard ID or array of IDs to delete',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Pinboard(s) deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        400: {
          description: 'Bad request - missing pinboard ID',
        },
        403: {
          description: 'Unauthorized - user not logged in or lacks permission',
        },
      },
    },
    delete: {
      tags: ['Pinboards'],
      summary: 'Delete pinboard(s) (DELETE method)',
      description: 'Same as POST method',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['pinboard'],
              properties: {
                pinboard: {
                  oneOf: [
                    { type: 'integer' },
                    { type: 'array', items: { type: 'integer' } },
                  ],
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Pinboard(s) deleted successfully',
        },
      },
    },
  },
  '/api/pinboards/request-collaboration': {
    post: {
      tags: ['Pinboards'],
      summary: 'Request collaboration on a pinboard',
      description: 'Sends a collaboration request to the board owner and existing contributors. Super users (rights > 2) are automatically granted access.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['pinboard_id'],
              properties: {
                pinboard_id: {
                  type: 'integer',
                  description: 'ID of the pinboard to request collaboration on',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Collaboration request processed',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: {
                    type: 'string',
                    examples: [
                      'Collaboration request sent successfully.',
                      'You are already a collaborator or owner of this board.',
                    ],
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Bad request - missing pinboard_id',
        },
        403: {
          description: 'Unauthorized - user not logged in',
        },
        404: {
          description: 'Pinboard not found',
        },
      },
    },
  },
  '/api/pinboards/collaboration-decision': {
    post: {
      tags: ['Pinboards'],
      summary: 'Approve or deny a collaboration request',
      description: 'Handles collaboration decisions. Only board owners and existing contributors can approve/deny requests.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['pinboard_id', 'decision', 'requestor_email'],
              properties: {
                pinboard_id: {
                  type: 'integer',
                  description: 'ID of the pinboard',
                },
                decision: {
                  type: 'string',
                  enum: ['approve', 'deny'],
                  description: 'Decision on the collaboration request',
                },
                requestor_email: {
                  type: 'string',
                  format: 'email',
                  description: 'Email of the user requesting collaboration',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Decision processed successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: {
                    type: 'string',
                    examples: [
                      'The user (user@example.com) has been granted collaborator access to the board.',
                      'The collaboration request from (user@example.com) has been denied.',
                      'The user (user@example.com) is already a collaborator on this board.',
                    ],
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Bad request - missing or invalid parameters',
        },
        403: {
          description: 'Unauthorized - user not authorized to make decisions on this board',
        },
        404: {
          description: 'Pinboard or requestor not found',
        },
      },
    },
  },
};

/**
 * Pinboard schema definitions
 */
export const pinboardSchemas = {
  Pinboard: {
    type: 'object',
    description: 'Pinboard summary (list view)',
    properties: {
      pinboard_id: {
        type: 'integer',
        description: 'Unique pinboard identifier',
      },
      title: {
        type: 'string',
        description: 'Pinboard title',
      },
      description: {
        type: 'string',
        description: 'Pinboard description',
      },
      date: {
        type: 'string',
        format: 'date-time',
        description: 'Creation date',
      },
      status: {
        type: 'integer',
        description: 'Publication status: 1=draft, 2=review, 3+=published',
      },
      counts: {
        type: 'array',
        description: 'Count of pads per platform',
        items: {
          type: 'object',
          properties: {
            pinboard_id: { type: 'integer' },
            platform: { type: 'string' },
            count: { type: 'integer' },
          },
        },
      },
      total: {
        type: 'integer',
        description: 'Total number of pads across all platforms',
      },
      contributors: {
        type: 'integer',
        description: 'Number of contributors',
      },
      creator: {
        type: 'object',
        description: 'Pinboard creator information',
        properties: {
          name: { type: 'string' },
          iso3: { type: 'string' },
          id: { type: 'string' },
          isUNDP: { type: 'boolean' },
        },
      },
      is_contributor: {
        type: 'boolean',
        description: 'Whether current user has edit access (owner, contributor, or super user)',
      },
    },
  },
  PinboardDetailed: {
    type: 'object',
    description: 'Detailed pinboard with pads (single view)',
    properties: {
      pinboard_id: { type: 'integer' },
      title: { type: 'string' },
      description: { type: 'string' },
      date: { type: 'string', format: 'date-time' },
      status: { type: 'integer' },
      counts: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            pinboard_id: { type: 'integer' },
            platform: { type: 'string' },
            count: { type: 'integer' },
          },
        },
      },
      total: { type: 'integer' },
      contributors: { type: 'integer' },
      pads: {
        type: 'array',
        description: 'Array of pads in the pinboard (paginated)',
        items: {
          type: 'object',
          properties: {
            pad_id: { type: 'integer' },
            platform: { type: 'string' },
          },
        },
      },
      creator: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          iso3: { type: 'string' },
          id: { type: 'string' },
          isUNDP: { type: 'boolean' },
        },
      },
      is_contributor: { type: 'boolean' },
    },
  },
};
