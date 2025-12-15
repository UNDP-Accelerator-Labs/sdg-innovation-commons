/**
 * Admin Data Export API endpoints documentation
 */
export const adminExportsPaths = {
  '/api/admin/export/request': {
    post: {
      tags: ['Admin - Exports'],
      summary: 'Request data export',
      description: 'Request a data export job (admin only)',
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['export_type'],
              properties: {
                export_type: {
                  type: 'string',
                  enum: ['pads', 'users', 'collections', 'analytics'],
                  description: 'Type of data to export',
                },
                format: {
                  type: 'string',
                  enum: ['csv', 'json', 'xlsx'],
                  default: 'csv',
                  description: 'Export file format',
                },
                filters: {
                  type: 'object',
                  description: 'Optional filters for the export',
                  properties: {
                    platform: {
                      type: 'string',
                      description: 'Filter by platform',
                    },
                    start_date: {
                      type: 'string',
                      format: 'date',
                      description: 'Start date for date range',
                    },
                    end_date: {
                      type: 'string',
                      format: 'date',
                      description: 'End date for date range',
                    },
                  },
                },
                include_tags: {
                  type: 'boolean',
                  default: true,
                  description: 'Include tags in export',
                },
                include_locations: {
                  type: 'boolean',
                  default: true,
                  description: 'Include location data',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Export job created',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  job_id: {
                    type: 'string',
                    description: 'Unique job identifier',
                  },
                  status: {
                    type: 'string',
                    enum: ['pending', 'processing'],
                  },
                  created_at: {
                    type: 'string',
                    format: 'date-time',
                  },
                },
              },
            },
          },
        },
        403: {
          description: 'Forbidden',
        },
        400: {
          description: 'Invalid request parameters',
        },
      },
    },
  },
  '/api/admin/export/jobs': {
    get: {
      tags: ['Admin - Exports'],
      summary: 'Get export jobs',
      description: 'List all export jobs and their status (admin only)',
      security: [{ cookieAuth: [] }],
      parameters: [
        {
          name: 'status',
          in: 'query',
          description: 'Filter by job status',
          schema: {
            type: 'string',
            enum: ['pending', 'processing', 'completed', 'failed'],
          },
        },
        {
          name: 'limit',
          in: 'query',
          description: 'Number of jobs to return',
          schema: {
            type: 'integer',
            default: 50,
          },
        },
      ],
      responses: {
        200: {
          description: 'List of export jobs',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    job_id: { type: 'string' },
                    export_type: { type: 'string' },
                    format: { type: 'string' },
                    status: { type: 'string' },
                    created_at: { type: 'string', format: 'date-time' },
                    completed_at: { type: 'string', format: 'date-time' },
                    download_url: { type: 'string' },
                    error_message: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        403: {
          description: 'Forbidden',
        },
      },
    },
  },
};
