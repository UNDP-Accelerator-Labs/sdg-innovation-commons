/**
 * Admin User Management API endpoints documentation
 */
export const adminUsersPaths = {
  '/api/admin/check': {
    get: {
      tags: ['Admin - Users'],
      summary: 'Check admin status',
      description: 'Verify if the current user has admin privileges',
      security: [{ cookieAuth: [] }],
      responses: {
        200: {
          description: 'Admin status',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  isAdmin: {
                    type: 'boolean',
                  },
                  rights: {
                    type: 'integer',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/api/admin/users/promote': {
    post: {
      tags: ['Admin - Users'],
      summary: 'Promote user to admin',
      description: 'Grant admin rights to a user (super admin only)',
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['uuid'],
              properties: {
                uuid: {
                  type: 'string',
                  format: 'uuid',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'User promoted successfully',
        },
        403: {
          description: 'Forbidden',
        },
      },
    },
  },
  '/api/admin/users/demote': {
    post: {
      tags: ['Admin - Users'],
      summary: 'Demote admin user',
      description: 'Remove admin rights from a user (super admin only)',
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['uuid'],
              properties: {
                uuid: {
                  type: 'string',
                  format: 'uuid',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'User demoted successfully',
        },
        403: {
          description: 'Forbidden',
        },
      },
    },
  },
  '/api/admin/users/deactivate': {
    post: {
      tags: ['Admin - Users'],
      summary: 'Deactivate user account',
      description: 'Deactivate a user account (admin only)',
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['uuid'],
              properties: {
                uuid: {
                  type: 'string',
                  format: 'uuid',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'User deactivated',
        },
        403: {
          description: 'Forbidden',
        },
      },
    },
  },
  '/api/admin/users/reactivate': {
    post: {
      tags: ['Admin - Users'],
      summary: 'Reactivate user account',
      description: 'Reactivate a deactivated user account (admin only)',
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['uuid'],
              properties: {
                uuid: {
                  type: 'string',
                  format: 'uuid',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'User reactivated',
        },
        403: {
          description: 'Forbidden',
        },
      },
    },
  },
  '/api/admin/users/update': {
    post: {
      tags: ['Admin - Users'],
      summary: 'Update user information',
      description: 'Update user profile information (admin only)',
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['uuid'],
              properties: {
                uuid: {
                  type: 'string',
                  format: 'uuid',
                },
                email: {
                  type: 'string',
                  format: 'email',
                },
                name: {
                  type: 'string',
                },
                iso3: {
                  type: 'string',
                  description: 'Country ISO3 code',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'User updated successfully',
        },
        403: {
          description: 'Forbidden',
        },
      },
    },
  },
};
