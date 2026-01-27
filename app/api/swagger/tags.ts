/**
 * Tags API endpoints documentation
 */
export const tagsPaths = {
  '/api/tags': {
    get: {
      tags: ['Tags'],
      summary: 'Get tags with filters',
      description: 'Retrieve tags filtered by various criteria including platform, type, language, geographic filters, pads, mobilizations, and timeseries data',
      parameters: [
        {
          name: 'tags',
          in: 'query',
          description: 'Filter by specific tag IDs (can be multiple)',
          schema: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        {
          name: 'type',
          in: 'query',
          description: 'Tag type filter (can be multiple)',
          schema: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['thematic_areas', 'sdgs', 'regions', 'countries', 'methods', 'datasources'],
            },
          },
        },
        {
          name: 'pads',
          in: 'query',
          description: 'Filter tags from specific pad IDs (can be multiple)',
          schema: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        {
          name: 'mobilizations',
          in: 'query',
          description: 'Filter tags from pads associated with specific mobilization IDs (can be multiple)',
          schema: {
            type: 'array',
            items: {
              type: 'string',
            },
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
          name: 'timeseries',
          in: 'query',
          description: 'Return timeseries data showing tag usage over time',
          schema: {
            type: 'boolean',
            default: false,
          },
        },
        {
          name: 'aggregation',
          in: 'query',
          description: 'Time aggregation for timeseries (day, week, month, year)',
          schema: {
            type: 'string',
            enum: ['day', 'week', 'month', 'year'],
            default: 'day',
          },
        },
        {
          name: 'use_pads',
          in: 'query',
          description: 'Apply complex pad-level filters (requires additional filter parameters)',
          schema: {
            type: 'boolean',
          },
        },
        {
          name: 'platform',
          in: 'query',
          description: 'Platform filter (solution, experiment, action plan, insight) - can be multiple',
          schema: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['solution', 'experiment', 'action plan', 'insight'],
            },
          },
        },
        {
          name: 'countries',
          in: 'query',
          description: 'Filter by country ISO3 codes (can be multiple, prefix with - for exclusion)',
          schema: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        {
          name: 'regions',
          in: 'query',
          description: 'Filter by UNDP region codes (can be multiple, prefix with - for exclusion)',
          schema: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        {
          name: 'space',
          in: 'query',
          description: 'Content space filter (private, shared, public, curated, reviewing)',
          schema: {
            type: 'string',
            enum: ['private', 'shared', 'public', 'curated', 'reviewing'],
          },
        },
        {
          name: 'search',
          in: 'query',
          description: 'Search term to filter pads by full text',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'templates',
          in: 'query',
          description: 'Filter by template IDs (can be multiple, prefix with - for exclusion)',
          schema: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        {
          name: 'thematic_areas',
          in: 'query',
          description: 'Filter by thematic area tag IDs (can be multiple)',
          schema: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        {
          name: 'sdgs',
          in: 'query',
          description: 'Filter by SDG tag IDs (can be multiple)',
          schema: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        {
          name: 'pinboard',
          in: 'query',
          description: 'Filter tags from pads in a specific pinboard',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'section',
          in: 'query',
          description: 'Filter by pinboard section',
          schema: {
            type: 'string',
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
        {
          name: 'include_data',
          in: 'query',
          description: 'Include additional data in response',
          schema: {
            type: 'boolean',
            default: false,
          },
        },
      ],
      responses: {
        200: {
          description: 'Successful response - returns array of tags with counts or timeseries data based on parameters',
          content: {
            'application/json': {
              schema: {
                oneOf: [
                  {
                    type: 'array',
                    description: 'Regular tag response with counts',
                    items: {
                      allOf: [
                        { $ref: '#/components/schemas/Tag' },
                        {
                          type: 'object',
                          properties: {
                            count: {
                              type: 'integer',
                              description: 'Number of times this tag is used',
                            },
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: 'array',
                    description: 'Timeseries response (when timeseries=true)',
                    items: {
                      allOf: [
                        { $ref: '#/components/schemas/Tag' },
                        {
                          type: 'object',
                          properties: {
                            timeseries: {
                              type: 'array',
                              description: 'Array of date-count pairs showing usage over time',
                              items: {
                                type: 'object',
                                properties: {
                                  date: {
                                    type: 'string',
                                    format: 'date-time',
                                    description: 'Date/time of the aggregated period',
                                  },
                                  count: {
                                    type: 'integer',
                                    description: 'Number of uses in this period',
                                  },
                                },
                              },
                            },
                          },
                        },
                      ],
                    },
                  },
                ],
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
