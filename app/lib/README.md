# App Library (lib/) - Restructured & Optimized

This folder contains the core business logic, utilities, and services for the SDG Innovation Commons application. It has been completely restructured to follow senior-level engineering practices with clear separation of concerns, modularity, and maintainability.

## 📁 Folder Structure

```
lib/
├── config/              # Application configuration and constants
│   ├── constants.ts     # Centralized constants (URLs, limits, platform configs)
│   └── index.ts         # Config barrel export
│
├── services/            # Business logic and external service integrations
│   ├── auth.ts          # Authentication & session management
│   ├── database.ts      # PostgreSQL connection management with pooling
│   ├── email.ts         # Email sending service (nodemailer)
│   ├── http.ts          # HTTP client with cookie forwarding
│   └── index.ts         # Services barrel export
│
├── types/               # TypeScript type definitions
│   ├── common.ts        # Common types (DBKey, PostProps, etc.)
│   ├── auth.ts          # Authentication-related types
│   ├── platform.ts      # Platform-specific types
│   ├── data.ts          # Data layer types
│   └── index.ts         # Types barrel export
│
├── utils/               # Pure utility functions
│   ├── string.ts        # String manipulation (URL validation, slugify, etc.)
│   ├── array.ts         # Array operations (groupBy, unique, sortBy, etc.)
│   ├── date.ts          # Date formatting and manipulation
│   ├── platform.ts      # Platform mapping utilities
│   ├── privacy.ts       # PII scrubbing and data privacy
│   ├── sdg.ts           # SDG-related utilities
│   ├── media.ts         # Image/video extraction utilities
│   └── index.ts         # Utils barrel export
│
├── data/                # Data access layer (existing, to be refactored)
├── analytics/           # Analytics tracking (existing)
├── helpers/             # Legacy helpers (to be migrated)
├── db-schema/           # SQL migrations and schema files
│
├── index.ts             # Main barrel export for the entire lib
└── README.md            # This file
```

## 🎯 Design Principles

### 1. **Separation of Concerns**
- **Config**: Environment variables and constants
- **Services**: Business logic and external integrations
- **Types**: Type definitions and interfaces
- **Utils**: Pure, reusable utility functions

### 2. **Modularity**
- Each module has a single, well-defined responsibility
- Modules are independently testable
- Clear dependencies between modules

### 3. **Type Safety**
- Comprehensive TypeScript types throughout
- Proper type exports and imports
- Interface-driven design

### 4. **Documentation**
- JSDoc comments on all public APIs
- Module-level documentation
- Usage examples in comments

### 5. **Backward Compatibility**
- Legacy exports maintained in `index.ts`
- Gradual migration path from old structure

## 📦 Import Examples

### New Modular Imports (Recommended)

```typescript
// Import specific utilities
import { isURL, slugify, truncate } from '@/app/lib/utils/string';
import { groupBy, unique, sortBy } from '@/app/lib/utils/array';
import { formatDate, getRelativeTime } from '@/app/lib/utils/date';

// Import services
import { query, transaction } from '@/app/lib/services/database';
import { getSession, isAdmin } from '@/app/lib/services/auth';
import { sendEmail, sendWelcomeEmail } from '@/app/lib/services/email';
import { httpGet, httpPost } from '@/app/lib/services/http';

// Import types
import type { SessionInfo, PlatformType, DBKey } from '@/app/lib/types';

// Import config
import { BASE_URL, PAGE_LIMIT, COMMONS_PLATFORMS } from '@/app/lib/config';
```

### Legacy Imports (Still Supported)

```typescript
// Old import style still works
import { query as dbQuery } from '@/app/lib/db';
import { getSession } from '@/app/lib/session';
import get from '@/app/lib/data/get';

// These are aliased to the new structure
```

## 🔄 Migration Guide

### For Developers Using the Library

1. **Update imports gradually**: New imports are co-located by functionality
2. **Use barrel exports**: Import from `/lib` or `/lib/utils` instead of deep imports
3. **Leverage types**: Import from `/lib/types` for all type definitions
4. **Follow examples**: Check JSDoc comments for usage patterns

### From Old to New

| Old Import | New Import |
|------------|------------|
| `@/app/lib/db` | `@/app/lib/services/database` |
| `@/app/lib/session` | `@/app/lib/services/auth` |
| `@/app/lib/helpers/utils` | `@/app/lib/utils` (specific module) |
| `@/app/lib/definitions` | `@/app/lib/types` |
| `@/app/lib/data/get` | `@/app/lib/services/http` |

## 🧪 Testing

Each module is designed to be independently testable:

```typescript
// Example: Testing string utilities
import { isURL, slugify } from '@/app/lib/utils/string';

test('isURL validates URLs correctly', () => {
  expect(isURL('https://example.com')).toBe(true);
  expect(isURL('not-a-url')).toBe(false);
});

test('slugify converts text to slug', () => {
  expect(slugify('Hello World!')).toBe('hello-world');
});
```

## 📚 Key Modules

### Database Service (`services/database.ts`)
- Connection pooling with singleton pattern
- Transaction support
- Type-safe queries
- Automatic SSL detection for Azure/production

### Auth Service (`services/auth.ts`)
- Session management
- API authentication (session + bearer tokens)
- Authorization helpers (isAdmin, canAccessResource)
- JWT token generation

### HTTP Service (`services/http.ts`)
- Centralized HTTP client
- Cookie forwarding
- Error handling with custom HttpError class
- Convenience methods (httpGet, httpPost, etc.)

### Email Service (`services/email.ts`)
- Transactional emails
- Template support
- Development mode logging
- Admin notifications

### Utils
- **String**: URL validation, slugification, password validation
- **Array**: groupBy, unique, sortBy, chunk, flatten
- **Date**: Formatting, relative time, date arithmetic
- **Platform**: Platform mapping, shortkey conversion
- **Privacy**: PII scrubbing, email masking
- **SDG**: SDG extraction, label mapping, filtering
- **Media**: Image/video extraction from pads

## 🚀 Benefits of New Structure

1. **Easier to Navigate**: Clear folder structure by responsibility
2. **Better Discoverability**: Related functions are grouped together
3. **Improved Maintainability**: Single responsibility per module
4. **Enhanced Testing**: Each module can be tested in isolation
5. **Type Safety**: Comprehensive TypeScript types
6. **Better Documentation**: JSDoc comments throughout
7. **Reduced Coupling**: Clear dependencies between modules
8. **Future-Proof**: Easy to extend and refactor

## 📖 Additional Resources

- **Type Definitions**: See `types/` folder for all interfaces
- **Configuration**: See `config/constants.ts` for all configurable values
- **Services**: See individual service files for API documentation
- **Utils**: Each util module has detailed JSDoc comments

## 🔧 Maintenance

### Adding New Functionality

1. **Determine Category**: Is it a service, utility, type, or config?
2. **Create Module**: Add new file in appropriate folder
3. **Export**: Add to corresponding `index.ts` barrel export
4. **Document**: Add JSDoc comments
5. **Test**: Create unit tests

### Deprecating Old Code

1. **Create New Version**: Implement in new structure
2. **Add Legacy Export**: Maintain backward compatibility in main `index.ts`
3. **Mark as Deprecated**: Add `@deprecated` JSDoc tag
4. **Migrate Usage**: Update all imports gradually
5. **Remove**: After migration is complete

---

**Note**: This restructuring maintains backward compatibility while providing a modern, scalable architecture for future development.
