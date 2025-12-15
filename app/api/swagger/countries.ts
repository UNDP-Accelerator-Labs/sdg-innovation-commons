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
          description: 'Filter countries that have published pads/content',
          schema: {
            type: 'boolean',
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
