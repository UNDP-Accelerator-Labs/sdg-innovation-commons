/**
 * Regions API endpoints documentation
 */
export const regionsPaths = {
  '/api/regions': {
    get: {
      tags: ['Locations'],
      summary: 'Get UNDP regions',
      description: 'Retrieve UNDP regions with optional filters',
      parameters: [
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
          description: 'Filter by specific region codes (can be multiple)',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'language',
          in: 'query',
          description: 'Language code (currently not used, for future compatibility)',
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
                    undp_region: {
                      type: 'string',
                      description: 'UNDP region abbreviation code',
                    },
                    undp_region_name: {
                      type: 'string',
                      description: 'Full name of the UNDP region',
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
