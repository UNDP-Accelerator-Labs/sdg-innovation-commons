/**
 * Countries API endpoints documentation
 */
export const countriesPaths = {
  '/api/countries': {
    get: {
      tags: ['Locations'],
      summary: 'Get countries',
      description: 'Retrieve countries with optional filters for regions, lab presence, and pad usage',
      parameters: [
        {
          name: 'countries',
          in: 'query',
          description: 'Filter by specific country ISO3 codes (can be multiple)',
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
          name: 'has_lab',
          in: 'query',
          description: 'Filter countries that have UNDP Accelerator Labs',
          schema: {
            type: 'boolean',
          },
        },
        {
          name: 'use_pads',
          in: 'query',
          description: 'Filter countries that have published pads/content matching additional filter criteria',
          schema: {
            type: 'boolean',
          },
        },
        {
          name: 'pads',
          in: 'query',
          description: 'Filter countries by specific pad IDs (can be multiple). Must be used with use_pads=true',
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
          description: 'Language code for country names (e.g., en, es, fr)',
          schema: {
            type: 'string',
            default: 'en',
          },
        },
        {
          name: 'space',
          in: 'query',
          description: 'Content space filter (used with use_pads=true)',
          schema: {
            type: 'string',
            enum: ['private', 'shared', 'public', 'curated', 'reviewing'],
          },
        },
        {
          name: 'platform',
          in: 'query',
          description: 'Platform filter (used with use_pads=true)',
          schema: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['solution', 'experiment', 'action plan', 'insight'],
            },
          },
        },
        {
          name: 'search',
          in: 'query',
          description: 'Search term to filter pads (used with use_pads=true)',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'templates',
          in: 'query',
          description: 'Filter by template IDs (used with use_pads=true)',
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
          description: 'Filter by mobilization IDs (used with use_pads=true)',
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
          description: 'Filter by thematic area tag IDs (used with use_pads=true)',
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
          description: 'Filter by SDG tag IDs (used with use_pads=true)',
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
          description: 'Filter countries by pads in specific pinboard (used with use_pads=true)',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'section',
          in: 'query',
          description: 'Filter by pinboard section (used with use_pads=true)',
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
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    iso3: {
                      type: 'string',
                      description: 'ISO3 country code',
                    },
                    sub_iso3: {
                      type: 'string',
                      description: 'Subunit ISO3 code (if applicable)',
                    },
                    country: {
                      type: 'string',
                      description: 'Country name',
                    },
                    location: {
                      type: 'object',
                      properties: {
                        lat: { type: 'number' },
                        lng: { type: 'number' },
                      },
                      description: 'Country centroid coordinates',
                    },
                    has_lab: {
                      type: 'boolean',
                      description: 'Whether country has an Accelerator Lab',
                    },
                    undp_region: {
                      type: 'string',
                      description: 'UNDP region code',
                    },
                    undp_region_name: {
                      type: 'string',
                      description: 'UNDP region name',
                    },
                    equivalents: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'List of equivalent ISO3 codes (subunits)',
                    },
                    count: {
                      type: 'integer',
                      description: 'Number of pads from this country (when use_pads=true)',
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
