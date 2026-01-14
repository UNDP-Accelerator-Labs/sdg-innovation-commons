import { geoEquirectangular } from 'd3-geo';
import { query as dbQuery } from '@/app/lib/db';

interface GeoJSONFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: any;
  };
  properties?: any;
}

interface GeoJSON {
  type: string;
  features: GeoJSONFeature[];
}

interface ProjectionResult {
  data: GeoJSON;
  projection: any;
  projsize: number;
}

interface GeoKwargs {
  projection?: any;
  geojson?: GeoJSON;
  loadbase?: boolean;
  projsize?: number;
  zoom?: boolean;
}

async function getBasemap(): Promise<GeoJSON> {
  const result = await dbQuery(
    'general',
    `SELECT ST_AsGeoJSON(wkb_geometry)::json AS geojson 
     FROM adm0 
     WHERE name <> 'Antarctica'`,
    []
  );

  return {
    type: 'FeatureCollection',
    features: result.rows.map((d: any) => ({
      type: 'Feature',
      geometry: d.geojson,
    })),
  };
}

async function setProjection(kwargs: GeoKwargs) {
  let { geojson, loadbase, projsize } = kwargs;

  let basemap = geojson;
  if (loadbase) {
    basemap = await getBasemap();
    if (!geojson) geojson = basemap;
  }

  if (!projsize) projsize = 1960;
  
  const projection = geoEquirectangular()
    .fitSize([projsize, projsize], basemap as any)
    .translate([projsize / 2, projsize / 2]);

  return { geojson, projection, projsize };
}

function projectCoordinates(coords: any, projection: any): any {
  if (Array.isArray(coords) && coords.every((c: any) => Array.isArray(c))) {
    return coords.map((c: any) => projectCoordinates(c, projection));
  } else {
    return projection(coords);
  }
}

export default async function projectGeo(kwargs: GeoKwargs): Promise<ProjectionResult> {
  const { projection, geojson, projsize } = await setProjection(kwargs);

  if (!geojson) {
    throw new Error('No geojson data provided');
  }

  const { features, ...properties } = geojson;
  const projected: any = {};

  projected.features = features?.map((d: GeoJSONFeature) => {
    const { geometry, ...featureProperties } = d;

    const obj: any = {
      geometry: {
        type: geometry.type,
        coordinates: projectCoordinates(geometry.coordinates, projection),
      },
    };

    return Object.assign(obj, featureProperties);
  });

  Object.assign(projected, properties);
  
  return { data: projected, projection, projsize: projsize! };
}
