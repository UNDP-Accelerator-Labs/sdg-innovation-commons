/**
 * Contributors API endpoints documentation
 */
export const contributorsPaths = {
  '/api/contributors': {
    get: {
      tags: ['Contributors'],
      summary: 'Get contributors list',
      description: 'Retrieve contributors (users) with optional filters and various output formats. Supports filtering by country, position, rights, search terms, and date ranges. Can include contribution statistics and team membership. **Authentication required** - User must be logged in to access this endpoint.',
      security: [
        { cookieAuth: [] },
        { bearerAuth: [] },
      ],
      parameters: [
        {
          name: 'output',
          in: 'query',
          description: 'Output format',
          schema: {
            type: 'string',
            enum: ['json', 'geojson'],
            default: 'json',
          },
        },
        {
          name: 'include_data',
          in: 'query',
          description: 'Include sensitive user data (name, email, position, etc.)',
          schema: {
            type: 'boolean',
            default: false,
          },
        },
        {
          name: 'include_teams',
          in: 'query',
          description: 'Include team membership information',
          schema: {
            type: 'boolean',
            default: false,
          },
        },
        {
          name: 'include_contributions',
          in: 'query',
          description: 'Include user contributions (pads, templates, campaigns)',
          schema: {
            type: 'boolean',
            default: false,
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
          description: 'Filter contributors by space/permission level',
          schema: {
            type: 'string',
            enum: ['all', 'invited'],
          },
        },
        {
          name: 'search',
          in: 'query',
          description: 'Search term to filter by name or position',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'status',
          in: 'query',
          description: 'Filter by confirmation status (can be multiple)',
          schema: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        {
          name: 'countries',
          in: 'query',
          description: 'Filter by country ISO3 codes (can be multiple)',
          schema: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        {
          name: 'positions',
          in: 'query',
          description: 'Filter by position titles (can be multiple)',
          schema: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        {
          name: 'rights',
          in: 'query',
          description: 'Filter by user rights level (can be multiple)',
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
          description: 'Filter by team/pinboard membership',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'page',
          in: 'query',
          description: 'Pagination by first letter of name (e.g., A, B, C)',
          schema: {
            type: 'string',
            pattern: '^[A-Z]$',
          },
        },
        {
          name: 'year',
          in: 'query',
          description: 'Filter by registration year',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'month',
          in: 'query',
          description: 'Filter by registration month (name or number)',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'sso_user',
          in: 'query',
          description: 'Filter by SSO user status',
          schema: {
            type: 'boolean',
          },
        },
      ],
      responses: {
        200: {
          description: 'Successful response - returns array of contributors or GeoJSON FeatureCollection based on output parameter',
          content: {
            'application/json': {
              schema: {
                oneOf: [
                  {
                    type: 'array',
                    description: 'JSON array of contributors (when output=json)',
                    items: {
                      type: 'object',
                      properties: {
                        contributor_id: {
                          type: 'string',
                          description: 'Unique contributor identifier (e.g., c-1, c-2)',
                        },
                        name: {
                          type: 'string',
                          description: 'User name (only if include_data=true)',
                        },
                        email: {
                          type: 'string',
                          description: 'User email (only if include_data=true)',
                        },
                        position: {
                          type: 'string',
                          description: 'User position (only if include_data=true)',
                        },
                        iso3: {
                          type: 'string',
                          description: 'Country ISO3 code (only if include_data=true)',
                        },
                        country: {
                          type: 'string',
                          description: 'Country name (only if include_data=true)',
                        },
                        location: {
                          type: 'object',
                          properties: {
                            lat: { type: 'number' },
                            lng: { type: 'number' },
                          },
                          description: 'Geographic location (only if include_data=true)',
                        },
                        primary_language: {
                          type: 'string',
                          description: 'Primary language (only if include_data=true)',
                        },
                        secondary_languages: {
                          type: 'array',
                          items: { type: 'string' },
                          description: 'Secondary languages (only if include_data=true)',
                        },
                        invited_at: {
                          type: 'string',
                          format: 'date-time',
                          description: 'Invitation date (only if include_data=true)',
                        },
                        confirmed_at: {
                          type: 'string',
                          format: 'date-time',
                          description: 'Confirmation date (only if include_data=true)',
                        },
                        left_at: {
                          type: 'string',
                          format: 'date-time',
                          description: 'Left date (only if include_data=true)',
                        },
                        teams: {
                          type: 'array',
                          items: { type: 'string' },
                          description: 'Team names (only if include_teams=true)',
                        },
                        pads: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'integer' },
                              title: { type: 'string' },
                              status: { type: 'string' },
                            },
                          },
                          description: 'User pads (only if include_contributions=true)',
                        },
                        templates: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'integer' },
                              title: { type: 'string' },
                              status: { type: 'string' },
                            },
                          },
                          description: 'User templates (only if include_contributions=true)',
                        },
                        campaigns: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'integer' },
                              title: { type: 'string' },
                              status: { type: 'string' },
                            },
                          },
                          description: 'User campaigns/mobilizations (only if include_contributions=true)',
                        },
                      },
                    },
                  },
                  {
                    type: 'object',
                    description: 'GeoJSON FeatureCollection (when output=geojson)',
                    properties: {
                      type: {
                        type: 'string',
                        enum: ['FeatureCollection'],
                      },
                      features: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            type: {
                              type: 'string',
                              enum: ['Feature'],
                            },
                            geometry: {
                              type: 'object',
                              properties: {
                                type: {
                                  type: 'string',
                                  enum: ['Point'],
                                },
                                coordinates: {
                                  type: 'array',
                                  items: { type: 'number' },
                                  minItems: 2,
                                  maxItems: 2,
                                },
                              },
                            },
                            properties: {
                              type: 'object',
                              description: 'Contributor properties (same as JSON output)',
                            },
                          },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        401: {
          description: 'Unauthorized - Authentication required',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'Authentication required. Please log in to access contributors data.',
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
