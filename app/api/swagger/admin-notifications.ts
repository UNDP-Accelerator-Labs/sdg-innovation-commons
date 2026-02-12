/**
 * Admin Notifications API endpoints documentation
 */
export const adminNotificationsPaths = {
  '/api/admin/notifications': {
    get: {
      tags: ['Admin - Notifications'],
      summary: 'Get notifications',
      description: 'Retrieve system notifications (admin only)',
      security: [{ cookieAuth: [] }],
      parameters: [
        {
          name: 'type',
          in: 'query',
          description: 'Filter by notification type',
          schema: {
            type: 'string',
            enum: ['info', 'warning', 'error', 'success'],
          },
        },
        {
          name: 'limit',
          in: 'query',
          description: 'Number of notifications to return',
          schema: {
            type: 'integer',
            default: 10,
          },
        },
      ],
      responses: {
        200: {
          description: 'List of notifications',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    type: { type: 'string' },
                    level: { type: 'string' },
                    payload: { type: 'object' },
                    created_at: { type: 'string', format: 'date-time' },
                    expires_at: { type: 'string', format: 'date-time' },
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
    post: {
      tags: ['Admin - Notifications'],
      summary: 'Create notification',
      description: 'Create a system notification (admin only)',
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['type', 'message'],
              properties: {
                type: {
                  type: 'string',
                  enum: ['info', 'warning', 'error', 'success'],
                  description: 'Notification type',
                },
                level: {
                  type: 'string',
                  enum: ['system', 'user', 'admin'],
                  default: 'user',
                  description: 'Notification level',
                },
                message: {
                  type: 'string',
                  description: 'Notification message',
                },
                target_users: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'uuid',
                  },
                  description: 'Specific users to notify (optional)',
                },
                expires_at: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Expiration timestamp (optional)',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Notification created',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  created_at: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        403: {
          description: 'Forbidden',
        },
        400: {
          description: 'Invalid request',
        },
      },
    },
  },
  '/api/admin/notifications/send-email': {
    post: {
      tags: ['Admin - Notifications'],
      summary: 'Send email notification',
      description: 'Send an email notification to users (admin only)',
      security: [{ cookieAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['recipients', 'subject', 'message'],
              properties: {
                recipients: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'email',
                  },
                  description: 'Email recipients',
                },
                subject: {
                  type: 'string',
                  description: 'Email subject',
                },
                message: {
                  type: 'string',
                  description: 'Email message (HTML supported)',
                },
                cc: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'email',
                  },
                  description: 'CC recipients (optional)',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Email sent successfully',
        },
        403: {
          description: 'Forbidden',
        },
        400: {
          description: 'Invalid request',
        },
      },
    },
  },
};
