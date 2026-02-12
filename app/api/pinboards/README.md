# Pinboards API

Comprehensive API endpoints for managing pinboards (boards) in the SDG Innovation Commons platform.

## Base Path

`/api/pinboards`

## Endpoints

### 1. List/Get Pinboards

**GET/POST** `/api/pinboards`

Retrieves pinboards based on query parameters. Returns either:

- List of pinboards (when no `pinboard` or multiple IDs provided)
- Detailed single pinboard with pads (when single `pinboard` ID provided)

#### Parameters

| Parameter   | Type                              | Description                                                                                                                            |
| ----------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `pinboard`  | string/string[]                   | Single pinboard ID or array of IDs. Comma-separated values accepted in GET requests                                                    |
| `page`      | number                            | Page number for pagination                                                                                                             |
| `limit`     | number                            | Items per page (default: 10)                                                                                                           |
| `space`     | 'private' \| 'published' \| 'all' | Filter by visibility: <br>- `private`: User's own pinboards<br>- `published`: Public pinboards (status > 2)<br>- `all`: Both (default) |
| `databases` | string/string[]                   | Filter by database/platform. Array of db IDs or shorthand names. Comma-separated values accepted                                       |
| `search`    | string                            | Search in title and description                                                                                                        |

#### Response Format

**Multiple Pinboards:**

```json
{
  "count": 25,
  "data": [
    {
      "pinboard_id": 123,
      "title": "Climate Solutions",
      "description": "Collection of climate-related pads",
      "date": "2026-01-01T00:00:00Z",
      "status": 3,
      "counts": [
        { "pinboard_id": 123, "platform": "solutions", "count": 15 },
        { "pinboard_id": 123, "platform": "experiments", "count": 8 }
      ],
      "total": 23,
      "contributors": 5,
      "creator": {
        "name": "John Doe",
        "iso3": "USA",
        "id": "uuid-123",
        "isUNDP": true
      },
      "is_contributor": true
    }
  ]
}
```

**Single Pinboard:**

```json
{
  "pinboard_id": 123,
  "title": "Climate Solutions",
  "description": "Collection of climate-related pads",
  "date": "2026-01-01T00:00:00Z",
  "status": 3,
  "counts": [...],
  "total": 23,
  "contributors": 5,
  "pads": [
    {"pad_id": 456, "platform": "solutions"},
    {"pad_id": 789, "platform": "experiments"}
  ],
  "creator": {...},
  "is_contributor": true
}
```

#### Pagination

- **List mode**: `page` and `limit` apply to the list of pinboards
- **Single pinboard mode**: `page` and `limit` apply to the pads within the pinboard

---

### 2. Create Pinboard

**POST** `/api/pinboards/create`

Creates a new pinboard or returns existing one if title + owner combination exists.

#### Request Body

```json
{
  "title": "My New Board",
  "description": "Optional description",
  "mobilization": "optional-mobilization-id",
  "status": 1,
  "display_filters": false,
  "display_map": false,
  "display_fullscreen": false,
  "slideshow": false
}
```

#### Response

```json
{
  "success": true,
  "message": "Board created successfully.",
  "pinboard": {
    "id": 123,
    "title": "My New Board",
    "description": "Optional description",
    "date": "2026-01-08T00:00:00Z"
  }
}
```

---

### 3. Delete Pinboard

**POST/DELETE** `/api/pinboards/delete`

Deletes one or more pinboards and their contributions. Only owners, contributors, or super users can delete.

#### Request Body

```json
{
  "pinboard": 123
}
```

or

```json
{
  "pinboard": [123, 456, 789]
}
```

#### Response

```json
{
  "success": true,
  "message": "Pinboard and related contributions deleted successfully."
}
```

---

### 4. Request Collaboration

**POST** `/api/pinboards/request-collaboration`

Sends a collaboration request to the board owner and existing contributors.

#### Request Body

```json
{
  "pinboard_id": 123
}
```

#### Response

```json
{
  "success": true,
  "message": "Collaboration request sent successfully."
}
```

#### Behavior

- Checks if user is already a collaborator or owner
- Super users (rights > 2) are automatically granted access
- Sends email to board owner and all contributors
- Sends confirmation email to requester

---

### 5. Handle Collaboration Decision

**POST** `/api/pinboards/collaboration-decision`

Approves or denies a collaboration request. Only board owners and existing contributors can make decisions.

#### Request Body

```json
{
  "pinboard_id": 123,
  "decision": "approve",
  "requestor_email": "user@example.com"
}
```

- `decision`: `"approve"` or `"deny"`

#### Response

```json
{
  "success": true,
  "message": "The user (user@example.com) has been granted collaborator access to the board."
}
```

#### Behavior

- Validates requester authorization (owner or contributor)
- For `approve`: Adds requestor as contributor and sends success email
- For `deny`: Sends denial email to requestor
- Checks if user is already a contributor before adding

---

## Access Control

### Pinboard Status Values

- `1`: Draft (private)
- `2`: Under review
- `3+`: Published (public)

### Permissions

- **Owner**: Full access to their pinboards
- **Contributor**: Access to pinboards they're added to
- **Super User** (rights > 2): Access to all published pinboards
- **Public**: Access to published pinboards only (status > 2)

### Special Notes

- `is_contributor` flag indicates if current user has edit access
- Super users can see all published boards but cannot access drafts unless they're contributors
- Pagination in single pinboard mode uses PostgreSQL array slice notation `[start:end]`

---

## Database Schema Dependencies

### Tables Used

- `pinboards`: Main pinboard data
- `pinboard_contributions`: Pads included in pinboards
- `pinboard_contributors`: Users with access to pinboards
- `users`: User information
- `extern_db`: Database/platform references

### Key Constraints

- `unique_pinboard_owner`: Ensures unique title per owner
- Access control via owner, contributors, and status fields

---

## Example Usage

### Get all user's pinboards (paginated)

```
GET /api/pinboards?space=all&page=1&limit=20
```

### Get single pinboard with pads

```
GET /api/pinboards?pinboard=123&page=1&limit=10
```

### Search published pinboards

```
GET /api/pinboards?space=published&search=climate&databases=solutions,experiments
```

### Create new pinboard

```
POST /api/pinboards/create
{
  "title": "Innovation Collection",
  "description": "Best practices",
  "status": 1
}
```

### Request collaboration

```
POST /api/pinboards/request-collaboration
{
  "pinboard_id": 123
}
```
