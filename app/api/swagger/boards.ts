/**
 * Boards API endpoints documentation
 */
export const boardsPaths = {
  '/api/boards': {
    get: {
      tags: ['Boards'],
      summary: 'Search boards',
      description: 'Search for pinboards by query string',
      parameters: [
        {
          name: 'q',
          in: 'query',
          description: 'Search query',
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
                  $ref: '#/components/schemas/Board',
                },
              },
            },
          },
        },
        500: {
          description: 'Server error',
        },
      },
    },
  },
};
