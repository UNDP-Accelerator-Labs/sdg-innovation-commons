/**
 * Uploads API endpoints documentation
 */
export const uploadsPaths = {
  '/api/uploads/azure/sas': {
    get: {
      tags: ['Uploads'],
      summary: 'Get Azure SAS token',
      description: 'Get a Shared Access Signature token for Azure Blob Storage uploads',
      security: [{ cookieAuth: [] }],
      parameters: [
        {
          name: 'filename',
          in: 'query',
          required: true,
          description: 'Name of the file to upload',
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        200: {
          description: 'SAS token generated',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  sasUrl: {
                    type: 'string',
                    description: 'Full URL with SAS token',
                  },
                  blobUrl: {
                    type: 'string',
                    description: 'Public blob URL',
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized',
        },
      },
    },
  },
};
