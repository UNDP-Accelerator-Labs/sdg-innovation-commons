/**
 * Articles API endpoints documentation
 * 
 * This API provides access to "What We Learn" content:
 * - Blogs - Community articles and blog posts
 * - Publications - Research papers, reports, and formal publications
 * 
 * Articles are stored in a separate database (blogs) and are accessed 
 * through this dedicated endpoint, not through the pads API.
 */
export const articlesPaths = {
  '/api/articles': {
    get: {
      tags: ['Articles'],
      summary: 'Get articles from What We Learn',
      description: 'Retrieve blogs and publications. Requires at least one article ID or URL. Can also fetch articles associated with a Community Curated Board.',
      parameters: [
        {
          name: 'id',
          in: 'query',
          description: 'Article ID(s) to fetch. Can be provided multiple times for multiple articles.',
          schema: {
            type: 'integer',
          },
          style: 'form',
          explode: true,
        },
        {
          name: 'url',
          in: 'query',
          description: 'Article URL(s) to fetch. Can be provided multiple times for multiple articles.',
          schema: {
            type: 'string',
          },
          style: 'form',
          explode: true,
        },
        {
          name: 'pinboard',
          in: 'query',
          description: 'Fetch articles associated with a specific Community Curated Board by its ID. When used, pagination applies to articles within the board.',
          schema: {
            type: 'integer',
          },
        },
        {
          name: 'page',
          in: 'query',
          description: 'Page number for pagination (only applies when using pinboard parameter)',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
          },
        },
        {
          name: 'limit',
          in: 'query',
          description: 'Number of articles per page (only applies when using pinboard parameter)',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 10,
          },
        },
      ],
      responses: {
        200: {
          description: 'Successfully retrieved articles',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    totalRecords: {
                      type: 'integer',
                      description: 'Total number of articles (when using pinboard parameter)',
                    },
                    page: {
                      type: 'integer',
                      description: 'Current page number',
                    },
                    limit: {
                      type: 'integer',
                      description: 'Items per page',
                    },
                    id: {
                      type: 'integer',
                      description: 'Unique article identifier',
                    },
                    url: {
                      type: 'string',
                      description: 'Article URL',
                    },
                    article_type: {
                      type: 'string',
                      description: 'Type of article (blog, publication, etc.)',
                    },
                    title: {
                      type: 'string',
                      description: 'Article title',
                    },
                    iso3: {
                      type: 'string',
                      description: 'ISO3 country code',
                    },
                    posted_date: {
                      type: 'string',
                      format: 'date-time',
                      description: 'Publication date',
                    },
                    posted_date_str: {
                      type: 'string',
                      description: 'Publication date as string',
                    },
                    parsed_date: {
                      type: 'string',
                      format: 'date-time',
                      description: 'Parsed publication date',
                    },
                    language: {
                      type: 'string',
                      description: 'Article language code',
                    },
                    created_at: {
                      type: 'string',
                      format: 'date-time',
                      description: 'Record creation timestamp',
                    },
                    content: {
                      type: 'string',
                      description: 'Article content (text or HTML)',
                    },
                    html_content: {
                      type: 'string',
                      description: 'Article HTML content',
                    },
                    pinboards: {
                      type: 'array',
                      description: 'Community Curated Boards containing this article',
                      items: {
                        type: 'object',
                        properties: {
                          pinboard_id: {
                            type: 'integer',
                            description: 'Board ID',
                          },
                          title: {
                            type: 'string',
                            description: 'Board title',
                          },
                          article_id: {
                            type: 'integer',
                            description: 'Article ID',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Bad request - at least one id or url must be provided',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: "At least one 'id' or 'url' must be provided.",
                  },
                },
              },
            },
          },
        },
        404: {
          description: 'No articles found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'No related articles found',
                  },
                  data: {
                    type: 'array',
                    items: {},
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
                type: 'object',
                properties: {
                  error: {
                    type: 'string',
                    example: 'An unexpected error occurred.',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
