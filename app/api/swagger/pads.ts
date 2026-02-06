/**
 * Content API endpoints documentation
 * 
 * This API provides access to two types of content across the platform:
 * - "What We See" (platform: solutions) - Proven solutions and innovations
 * - "What We Test" (platforms: experiments, action-plans) - Active experiments and action plans
 * 
 * Note: "What We Learn" content (blogs and publications) is available through the /api/articles endpoint.
 * 
 * Use the 'platforms' parameter to specify which content types to retrieve.
 */
export const padsPaths = {
  '/api/pads': {
    get: {
      tags: ['Pads'],
      summary: 'Get content from What We See and What We Test',
      description: 'Retrieve published content with comprehensive filtering options. Use the platforms parameter to specify content type: solutions (What We See) or experiments/action-plans (What We Test). For blogs and publications (What We Learn), use the /api/articles endpoint. Authentication is optional but enables user-specific features like current_user_engagement and viewing own drafts.',
      security: [{ cookieAuth: [] }, { bearerAuth: [] }, {}],
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
          description: 'Filter by contributor UUID(s). If the logged-in user matches the contributor UUID, returns all their content (including drafts with status < 3). Otherwise, only returns published content (status >= 3).',
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
          description: 'Filter by specific content ID(s)',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'id_dbpads',
          in: 'query',
          description: 'Filter by concatenated content+database ID(s) in format {pad_id}-{db_id} (for external systems)',
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
        // {
        //   name: 'platforms',
        //   in: 'query',
        //   description: 'Filter by content type/platform. Values: "solution" (What We See), "experiment"/"action plan" (What We Test), "consent", "codification". Note: For blogs and publications (What We Learn), use /api/articles endpoint.',
        //   schema: {
        //     type: 'string',
        //     enum: ['solution', 'experiment', 'action plan', 'consent', 'codification'],
        //   },
        // },
        {
          name: 'platform',
          in: 'query',
          description: 'Filter by content type/platform (singular form, alias for platforms). Values: "solution" (What We See), "experiment"/"action plan" (What We Test). Note: For blogs and publications (What We Learn), use /api/articles endpoint.',
          schema: {
            type: 'string',
            enum: ['solution', 'experiment', 'action plan', 'consent', 'codification'],
          },
        },
        {
          name: 'pinboard',
          in: 'query',
          description: 'Filter by Community Curated Board ID(s). Returns only pads that are included in the specified pinboard(s).',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'mobilizations',
          in: 'query',
          description: 'Filter by mobilization ID(s). Supports multiple values by repeating the parameter (e.g., ?mobilizations=1&mobilizations=2). Supports negative filters: prefix with "-" to exclude pads from specific mobilizations (e.g., "-5" excludes mobilization 5). Can combine positive and negative filters.',
          schema: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          explode: true,
          style: 'form',
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
          description: 'Include engagement statistics (likes, bookmarks, etc.), current user engagement (if logged in), and page views/reads',
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
          name: 'include_imgs',
          in: 'query',
          description: 'Include image URLs with Azure Blob Storage paths',
          schema: {
            type: 'boolean',
            default: false,
          },
        },
        {
          name: 'include_source',
          in: 'query',
          description: 'Include detailed information about the source pad if this pad is derived from another pad. When enabled, returns a nested "source" object containing the original pad\'s basic information including title, status, dates, snippet, vignette (if include_imgs is true), tags (if include_tags is true), locations (if include_locations is true), and metadata (if include_metafields is true).',
          schema: {
            type: 'boolean',
            default: false,
          },
        },
        {
          name: 'include_pinboards',
          in: 'query',
          description: 'Include Community Curated Board information: "all" for all boards containing the content, "own" for only user\'s boards (requires authentication)',
          schema: {
            type: 'string',
            enum: ['all', 'own'],
          },
        },
        {
          name: 'include_data',
          in: 'query',
          description: 'Include full content sections. Set to false to exclude sections field and reduce payload size (useful for list views).',
          schema: {
            type: 'boolean',
            default: true,
          },
        },
        {
          name: 'teams',
          in: 'query',
          description: 'Filter by team ID(s)',
          schema: {
            type: 'string',
          },
        },
        {
          name: 'pseudonymize',
          in: 'query',
          description: 'Remove personally identifiable information (email, position, ownername)',
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
            default: 10,
          },
        },
        {
          name: 'token',
          in: 'query',
          description: 'API access token (alternative to Authorization header)',
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
                    pad_id: {
                      type: 'integer',
                      description: 'Unique content identifier',
                    },
                    id_db: {
                      type: 'string',
                      description: 'Concatenated pad+database ID in format {pad_id}_{db_id}',
                    },
                    contributor_id: {
                      type: 'string',
                      description: 'UUID of the contributor (removed if pseudonymize=true)',
                    },
                    ownername: {
                      type: 'string',
                      description: 'Name of the owner (removed if pseudonymize=true)',
                    },
                    position: {
                      type: 'string',
                      description: 'Position of the owner (removed if pseudonymize=true)',
                    },
                    email: {
                      type: 'string',
                      description: 'Email of the owner (removed if pseudonymize=true)',
                    },
                    iso3: {
                      type: 'string',
                      description: 'ISO3 country code',
                    },
                    country: {
                      type: 'string',
                      description: 'Country name',
                    },
                    title: {
                      type: 'string',
                      description: 'Content title',
                    },
                    snippet: {
                      type: 'string',
                      description: 'Auto-generated snippet from full_text (first 300 characters)',
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
                      description: 'Publication status: 0=draft, 1=ready, 2=internal, 3=published',
                    },
                    template: {
                      type: 'integer',
                      description: 'Template ID',
                    },
                    ordb: {
                      type: 'integer',
                      description: 'External database ID used for platform determination',
                    },
                    sections: {
                      type: 'array',
                      description: 'Structured content sections (excluded if include_data=false)',
                    },
                    full_text: {
                      type: 'string',
                      description: 'Full text content',
                    },
                    imgs: {
                      type: 'array',
                      description: 'Image URLs with Azure Blob Storage paths (if include_imgs=true)',
                      items: {
                        type: 'string',
                      },
                    },
                    media: {
                      type: 'array',
                      description: 'Media URLs (if include_imgs=true)',
                      items: {
                        type: 'string',
                      },
                    },
                    vignette: {
                      type: 'string',
                      nullable: true,
                      description: 'Primary image URL for thumbnail (if include_imgs=true)',
                    },
                    tags: {
                      type: 'array',
                      description: 'Associated tags (if include_tags=true)',
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
                      description: 'Geographic locations (if include_locations=true)',
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
                      description: 'Additional metadata fields (if include_metafields=true)',
                    },
                    engagement: {
                      type: 'array',
                      description: 'Engagement statistics (if include_engagement=true)',
                      items: {
                        type: 'object',
                        properties: {
                          type: { type: 'string' },
                          count: { type: 'integer' },
                        },
                      },
                    },
                    current_user_engagement: {
                      type: 'array',
                      description: 'Current user\'s engagement with this pad (if include_engagement=true and user is logged in)',
                      items: {
                        type: 'object',
                        properties: {
                          type: { type: 'string' },
                          count: { type: 'integer' },
                        },
                      },
                    },
                    views: {
                      type: 'object',
                      description: 'Page view and read statistics (if include_engagement=true)',
                      properties: {
                        views: { type: 'integer', description: 'Total view count' },
                        reads: { type: 'integer', description: 'Total read count (scrolled to bottom)' },
                      },
                    },
                    pinboards: {
                      type: 'array',
                      description: 'Pinboards containing this pad (if include_pinboards=all or include_pinboards=own)',
                      items: {
                        type: 'object',
                        properties: {
                          pinboard_id: { type: 'integer' },
                          title: { type: 'string' },
                        },
                      },
                    },
                    comments: {
                      type: 'array',
                      description: 'Comments (if include_comments=true)',
                    },
                    url: {
                      type: 'string',
                      description: 'URL to view the pad',
                    },
                    source_pad_id: {
                      type: 'integer',
                      nullable: true,
                      description: 'ID of the source pad if this pad is derived from another pad',
                    },
                    source: {
                      type: 'object',
                      nullable: true,
                      description: 'Detailed source pad information (only present when include_source=true and pad has a source)',
                      properties: {
                        source_pad_id: { type: 'integer', description: 'Source pad ID' },
                        contributor_id: { type: 'string', description: 'Source pad contributor UUID' },
                        title: { type: 'string', description: 'Source pad title' },
                        snippet: { type: 'string', description: 'Source pad snippet' },
                        url: { type: 'string', description: 'URL to view the source pad' },
                        created_at: { type: 'string', format: 'date-time', description: 'Source pad creation date' },
                        updated_at: { type: 'string', format: 'date-time', description: 'Source pad update date' },
                        status: { type: 'integer', description: 'Source pad status' },
                        template: { type: 'integer', description: 'Source pad template ID' },
                        vignette: { type: 'string', nullable: true, description: 'Source pad thumbnail (if include_imgs=true)' },
                        tags: { type: 'array', description: 'Source pad tags (if include_tags=true)' },
                        locations: { type: 'array', description: 'Source pad locations (if include_locations=true)' },
                        metadata: { type: 'array', description: 'Source pad metadata (if include_metafields=true)' },
                      },
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
