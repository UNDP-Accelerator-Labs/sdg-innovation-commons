/**
 * Tags API endpoints documentation
 */
export const tagsPaths = {
  '/api/tags': {
    get: {
      tags: ['Tags'],
      summary: 'Get tags with filters',
      description: 'Retrieve tags filtered by various criteria including platform, type, language, and geographic filters',
      parameters: [
        {
          name: 'platform',
          in: 'query',
          description: 'Platform filter (solution, experiment, action plan, insight)',
          schema: {
            type: 'string',
            enum: ['solution', 'experiment', 'action plan', 'insight'],
          },
        },
        {
          name: 'type',
          in: 'query',
          description: 'Tag type filter (can be multiple)',
          schema: {
            type: 'string',
            enum: ['thematic_areas', 'sdgs', 'regions', 'countries', 'methods', 'datasources'],
          },
        },
        {
          name: 'language',
          in: 'query',
          description: 'Language code (e.g., en, es, fr)',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'use_pads',
          in: 'query',
          description: 'Filter to only show tags used in published pads',
          schema: {
            type: 'boolean',
          },
        },
        {
          name: 'countries',
          in: 'query',
          description: 'Filter by country ISO3 codes (can be multiple)',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'regions',
          in: 'query',
          description: 'Filter by UNDP region codes (can be multiple)',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'space',
          in: 'query',
          description: 'Content space filter',
          schema: {
            type: 'string',
            enum: ['published', 'pinned'],
          },
        },
        {
          name: 'output',
          in: 'query',
          description: 'Output format',
          schema: {
            type: 'string',
            enum: ['json', 'csv'],
            default: 'json',
          },
        },
      ],
      responses: {
        200: {
          description: 'Successful response',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Tag',
                },
              },
            },
          },
        },
        400: {
          description: 'Bad request',
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
    // post: {
    //   tags: ['Tags'],
    //   summary: 'Get tags with complex filters (POST)',
    //   description: 'Same as GET but accepts complex filter arrays in request body',
    //   requestBody: {
    //     required: true,
    //     content: {
    //       'application/json': {
    //         schema: {
    //           type: 'object',
    //           properties: {
    //             platform: {
    //               type: 'array',
    //               items: {
    //                 type: 'string',
    //                 enum: ['solution', 'experiment', 'action plan', 'insight'],
    //               },
    //             },
    //             type: {
    //               type: 'array',
    //               items: {
    //                 type: 'string',
    //               },
    //             },
    //             language: {
    //               type: 'string',
    //             },
    //             use_pads: {
    //               type: 'boolean',
    //             },
    //             countries: {
    //               type: 'array',
    //               items: {
    //                 type: 'string',
    //               },
    //             },
    //             regions: {
    //               type: 'array',
    //               items: {
    //                 type: 'string',
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    //   responses: {
    //     200: {
    //       description: 'Successful response',
    //       content: {
    //         'application/json': {
    //           schema: {
    //             type: 'array',
    //             items: {
    //               $ref: '#/components/schemas/Tag',
    //             },
    //           },
    //         },
    //       },
    //     },
    //     400: {
    //       description: 'Bad request',
    //       content: {
    //         'application/json': {
    //           schema: {
    //             $ref: '#/components/schemas/Error',
    //           },
    //         },
    //       },
    //     },
    //   },
    // },
  },
};
