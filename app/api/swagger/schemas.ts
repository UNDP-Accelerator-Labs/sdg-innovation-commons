/**
 * Shared schemas used across API endpoints
 */
export const schemas = {
  Error: {
    type: 'object',
    properties: {
      error: {
        type: 'string',
        description: 'Error message',
      },
      message: {
        type: 'string',
        description: 'Detailed error description',
      },
    },
  },
  Tag: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'Tag ID',
      },
      name: {
        type: 'string',
        description: 'Tag name',
      },
      type: {
        type: 'string',
        enum: ['thematic_areas', 'sdgs', 'regions', 'countries', 'methods', 'datasources'],
        description: 'Tag type',
      },
      language: {
        type: 'string',
        description: 'Language code (e.g., en, es, fr)',
      },
      count: {
        type: 'integer',
        description: 'Number of times this tag is used',
      },
    },
  },
  Collection: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'Collection ID',
      },
      slug: {
        type: 'string',
        description: 'URL-friendly slug',
      },
      title: {
        type: 'string',
        description: 'Collection title',
      },
      description: {
        type: 'string',
        description: 'Collection description',
      },
      main_image: {
        type: 'string',
        description: 'Main image URL',
      },
      sections: {
        type: 'array',
        description: 'Collection sections',
        items: {
          type: 'object',
        },
      },
      highlights: {
        type: 'object',
        description: 'Collection metadata including status',
      },
      boards: {
        type: 'array',
        description: 'Associated boards',
        items: {
          type: 'integer',
        },
      },
      creator_name: {
        type: 'string',
        description: 'Creator username',
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
    },
  },
  Board: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: 'Board ID',
      },
      title: {
        type: 'string',
        description: 'Board title',
      },
      description: {
        type: 'string',
        description: 'Board description',
      },
    },
  },
};
