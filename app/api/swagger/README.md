# Swagger API Documentation - Modular Structure

This directory contains the modular Swagger/OpenAPI documentation for the SDG Innovation Commons API.

## Structure

The documentation is split into logical modules for easier maintenance:

```
app/api/swagger/
├── index.ts                    # Main aggregator - combines all modules
├── schemas.ts                  # Shared data schemas
├── tags.ts                     # Tags API endpoints
├── collections.ts              # Collections API endpoints
├── boards.ts                   # Boards API endpoints
├── analytics.ts                # Analytics API endpoints
├── content.ts                  # Content flagging endpoints
├── uploads.ts                  # File upload endpoints
├── admin-users.ts              # Admin user management endpoints
├── admin-content.ts            # Admin content moderation endpoints
├── admin-analytics.ts          # Admin analytics endpoints
├── admin-exports.ts            # Admin data export endpoints
└── admin-notifications.ts      # Admin notification endpoints
```

## Adding New API Endpoints

To add documentation for a new API endpoint:

### 1. Create a new module file (if needed)

If your endpoints belong to a new category, create a new file:

```typescript
// app/api/swagger/my-new-feature.ts
export const myNewFeaturePaths = {
  '/api/my-endpoint': {
    get: {
      tags: ['My Feature'],
      summary: 'Get something',
      description: 'Detailed description',
      parameters: [
        {
          name: 'id',
          in: 'query',
          required: true,
          schema: { type: 'integer' },
        },
      ],
      responses: {
        200: {
          description: 'Success',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
};
```

### 2. Add to index.ts

Import and merge your new module in `index.ts`:

```typescript
import { myNewFeaturePaths } from './my-new-feature';

// Add to tags array
tags: [
  // ... existing tags
  {
    name: 'My Feature',
    description: 'Description of my feature',
  },
],

// Merge in paths
paths: {
  // ... existing paths
  ...myNewFeaturePaths,
},
```

### 3. Add schemas (if needed)

If you need new shared schemas, add them to `schemas.ts`:

```typescript
export const schemas = {
  // ... existing schemas
  MyNewSchema: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
    },
  },
};
```

Then reference it in your endpoint:

```typescript
schema: {
  $ref: '#/components/schemas/MyNewSchema',
}
```

## Best Practices

1. **One file per logical API group** - Keep related endpoints together
2. **Descriptive names** - Use clear, consistent naming for files and exports
3. **Complete documentation** - Include descriptions, parameters, request/response schemas
4. **Use schemas** - Extract common schemas to `schemas.ts` and reference them
5. **Security markers** - Always mark endpoints that require authentication with `security: [{ cookieAuth: [] }]`
6. **Response codes** - Document all possible response codes (200, 400, 401, 403, 404, 500)
7. **Examples** - Add example values where helpful

## OpenAPI/Swagger Specification

We use OpenAPI 3.0.0 specification. Key elements:

### Path Definition
```typescript
'/api/endpoint': {
  get: {
    tags: ['Category'],
    summary: 'Short description',
    description: 'Longer description with details',
    parameters: [...],
    responses: {...},
  },
}
```

### Parameters
```typescript
parameters: [
  {
    name: 'param_name',
    in: 'query' | 'path' | 'header',
    required: true | false,
    description: 'What this parameter does',
    schema: {
      type: 'string' | 'integer' | 'boolean',
      enum: ['option1', 'option2'], // optional
      default: 'value', // optional
    },
  },
]
```

### Request Body
```typescript
requestBody: {
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['field1'],
        properties: {
          field1: { type: 'string' },
          field2: { type: 'integer' },
        },
      },
    },
  },
}
```

### Responses
```typescript
responses: {
  200: {
    description: 'Success message',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/SchemaName',
        },
      },
    },
  },
  400: {
    description: 'Error message',
  },
}
```

## Testing Documentation

1. Start the development server: `pnpm dev`
2. Visit: http://localhost:3000/api-docs
3. Test endpoints using the "Try it out" feature
4. Verify all parameters and responses are correctly documented

## Maintenance

- **Regular updates** - Keep documentation in sync with API changes
- **Version control** - Document breaking changes in version updates
- **Review** - Review documentation when reviewing API code changes
- **Validation** - Use the Swagger UI to validate documentation correctness

## Resources

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [OpenAPI Examples](https://github.com/OAI/OpenAPI-Specification/tree/main/examples)
