/**
 * Pads (Content) API endpoints documentation
 */
export const padsPaths = {
  '/api/pads': {
    get: {
      tags: ['Pads'],
      summary: 'Get pads (solutions, experiments, action plans, blogs)',
      description: 'Retrieve published content with comprehensive filtering options',
      parameters: [
        {
          name: 'space',
          in: 'query',
          description: 'Content visibility filter',
          schema: {
            type: 'string',
            enum: ['published', 'private', 'shared', 'all'],
            default: 'published',
          },
        },
        {
          name: 'search',
          in: 'query',
          description: 'Search in title and full text',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'status',
          in: 'query',
          description: 'Publication status: 0=draft, 1=ready, 2=internal, 3=published',
          schema: {
            type: 'integer',
            minimum: 0,
            maximum: 3,
          },
        },
        {
          name: 'contributors',
          in: 'query',
          description: 'Filter by contributor UUID(s)',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'countries',
          in: 'query',
          description: 'Filter by country ISO3 code(s)',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'regions',
          in: 'query',
          description: 'Filter by UNDP region code(s)',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'pads',
          in: 'query',
          description: 'Filter by specific pad ID(s)',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'templates',
          in: 'query',
          description: 'Filter by template ID(s)',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'platforms',
          in: 'query',
          description: 'Filter by platform (solution, experiment, action plan)',
          schema: {
            type: 'string',
            enum: ['solution', 'experiment', 'action plan'],
          },
        },
        {
          name: 'thematic_areas',
          in: 'query',
          description: 'Filter by thematic area tag ID(s)',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'sdgs',
          in: 'query',
          description: 'Filter by SDG tag ID(s)',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'datasources',
          in: 'query',
          description: 'Filter by datasource tag ID(s)',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'include_tags',
          in: 'query',
          description: 'Include tag information',
          schema: {
            type: 'boolean',
            default: false,
          },
        },
        {
          name: 'include_locations',
          in: 'query',
          description: 'Include location data',
          schema: {
            type: 'boolean',
            default: false,
          },
        },
        {
          name: 'include_metafields',
          in: 'query',
          description: 'Include metadata fields',
          schema: {
            type: 'boolean',
            default: false,
          },
        },
        {
          name: 'include_engagement',
          in: 'query',
          description: 'Include engagement statistics (likes, views, etc.)',
          schema: {
            type: 'boolean',
            default: false,
          },
        },
        {
          name: 'include_comments',
          in: 'query',
          description: 'Include comments',
          schema: {
            type: 'boolean',
            default: false,
          },
        },
        {
          name: 'pseudonymize',
          in: 'query',
          description: 'Remove personally identifiable information',
          schema: {
            type: 'boolean',
            default: true,
          },
        },
        {
          name: 'anonymize_comments',
          in: 'query',
          description: 'Remove user IDs from comments',
          schema: {
            type: 'boolean',
            default: true,
          },
        },
        {
          name: 'page',
          in: 'query',
          description: 'Page number for pagination',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
          },
        },
        {
          name: 'limit',
          in: 'query',
          description: 'Number of results per page',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 1000,
            default: 100,
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
                  type: 'object',
                  properties: {
                    pad_id: {
                      type: 'integer',
                      description: 'Unique pad identifier',
                    },
                    contributor_id: {
                      type: 'string',
                      description: 'UUID of the contributor',
                    },
                    contributor_name: {
                      type: 'string',
                      description: 'Name of the contributor',
                    },
                    contributor_country: {
                      type: 'string',
                      description: 'ISO3 code of contributor country',
                    },
                    title: {
                      type: 'string',
                      description: 'Pad title',
                    },
                    created_at: {
                      type: 'string',
                      format: 'date-time',
                      description: 'Creation timestamp',
                    },
                    updated_at: {
                      type: 'string',
                      format: 'date-time',
                      description: 'Last update timestamp',
                    },
                    status: {
                      type: 'integer',
                      description: 'Publication status',
                    },
                    template: {
                      type: 'integer',
                      description: 'Template ID',
                    },
                    sections: {
                      type: 'array',
                      description: 'Structured content sections',
                    },
                    full_text: {
                      type: 'string',
                      description: 'Full text content',
                    },
                    tags: {
                      type: 'array',
                      description: 'Associated tags',
                      items: {
                        type: 'object',
                        properties: {
                          tag_id: { type: 'integer' },
                          type: { type: 'string' },
                        },
                      },
                    },
                    locations: {
                      type: 'array',
                      description: 'Geographic locations',
                      items: {
                        type: 'object',
                        properties: {
                          lat: { type: 'number' },
                          lng: { type: 'number' },
                          iso3: { type: 'string' },
                        },
                      },
                    },
                    metadata: {
                      type: 'array',
                      description: 'Additional metadata fields',
                    },
                    engagement: {
                      type: 'array',
                      description: 'Engagement statistics (if requested)',
                      items: {
                        type: 'object',
                        properties: {
                          type: { type: 'string' },
                          count: { type: 'integer' },
                        },
                      },
                    },
                    comments: {
                      type: 'array',
                      description: 'Comments (if requested)',
                    },
                    source: {
                      type: 'string',
                      description: 'URL to view the pad',
                    },
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
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
  },
};
