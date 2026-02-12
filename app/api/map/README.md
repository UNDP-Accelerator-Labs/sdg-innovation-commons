# Map Generation API

Endpoint for generating world maps with data overlays.

## Installation

Before using this endpoint, install the required dependencies:

```bash
pnpm add d3-geo d3-scale d3-array canvas topojson-server topojson-client topojson-simplify uuid
pnpm add -D @types/d3-geo @types/d3-scale @types/d3-array
```

## Endpoints

### POST /api/map

Generate a world map with custom styling and data layers.

### GET /api/map

Alternative endpoint that accepts query parameters (converted to POST internally).

## Request Parameters

```typescript
{
  projsize?: number;          // Image size (square), default: 1200px
  background_color?: string;  // Background/ocean color, default: 'transparent'
  base_color?: string;        // Landmass color, default: 'rgba(102,117,127,.25)'
  simplification?: number;    // Topology simplification level, default: 10
  layers?: Array<{
    lat: number;             // Latitude (required)
    lng: number;             // Longitude (required)
    count: number;           // Data value affecting point size (required)
    type: 'point';           // Layer type (required)
    color?: string;          // Point color, default: '#32bee1'
    label?: string;          // Label (not yet implemented)
  }>;
}
```

## Response

```typescript
{
  status: 200,
  file: string  // URL to the generated map image in Azure Blob Storage
}
```

## Features

- **Caching**: Generated maps are cached in the database to avoid regeneration
- **Azure Storage**: Maps are stored in Azure Blob Storage 'maps' container
- **Point Overlays**: Support for adding data points with size based on count
- **Custom Styling**: Configurable colors and sizes

## Database Schema

The endpoint uses the `generated_maps` table:

```sql
CREATE TABLE generated_maps (
  id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  query_string TEXT NOT NULL UNIQUE
);
```

## Environment Variables

Required:

- `AZURE_STORAGE_CONNECTION_STRING` - Azure Blob Storage connection string
- `NEXT_PUBLIC_BASE_URL` (optional) - Base URL for the application

## Example Usage

```typescript
import worldMap from "@/app/lib/data/world-map";

const result = await worldMap({
  projsize: 1080,
  base_color: "#000000",
  background_color: "transparent",
  layers: [
    {
      lat: 40.7128,
      lng: -74.006,
      count: 100,
      type: "point",
      color: "#32bee1",
    },
  ],
});

console.log(result.file); // URL to generated map
```

## Notes

- Only `point` layer type is currently supported
- Labels are not yet implemented
- Map projection: Equirectangular (d3.geoEquirectangular)
- Basemap excludes Antarctica
