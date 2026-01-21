import { NextRequest, NextResponse } from 'next/server';
import { query as dbQuery } from '@/app/lib/db';
import projectGeo from '@/app/lib/helpers/map/geo';
import { topology } from 'topojson-server';
import { feature, quantize } from 'topojson-client';
import { presimplify } from 'topojson-simplify';

interface MapRequestParams {
  projsize?: number;
  background_color?: string;
  base_color?: string;
  layers?: any[];
  simplification?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const kwargs: MapRequestParams = body;

    let { projsize } = kwargs;
    if (!projsize) projsize = 1200;
    else projsize = +projsize;
    kwargs.projsize = projsize;

    // Create a query string hash for caching
    const queryString = Object.keys(kwargs)
      .sort((a, b) => a.localeCompare(b))
      .map((k) => {
        const v = (kwargs as any)[k];
        if (Array.isArray(v)) {
          const sVs = v
            .map((sv) => {
              if (typeof sv === 'object') {
                return Object.keys(sv)
                  .sort((a, b) => a.localeCompare(b))
                  .map((sk) => {
                    return `${sk}_${(sv[sk] || '')
                      ?.toString()
                      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
                      .replace(/\s+/, '')}`;
                  })
                  .join('_');
              } else
                return (sv || '')
                  ?.toString()
                  .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
                  .replace(/\s+/, '');
            })
            .join('_');
          return `${k}_${sVs}`;
        } else if (typeof v === 'object') {
          const sVs = Object.keys(v)
            .sort((a, b) => a.localeCompare(b))
            .map((sk) => {
              return `${sk}_${(v[sk] || '')
                ?.toString()
                .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
                .replace(/\s+/, '')}`;
            })
            .join('_');
          return `${k}_${sVs}`;
        } else
          return `${k}_${(v || '')
            ?.toString()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
            .replace(/\s+/, '')}`;
      })
      .join('_');

    // Check if the file already exists
    const existingFile = await dbQuery(
      'general',
      `SELECT filename FROM generated_maps WHERE query_string = $1`,
      [queryString]
    );

    if (existingFile.rows.length > 0) {
      const file = existingFile.rows[0].filename;
      return NextResponse.json({ status: 200, file });
    }

    // Need to generate the file
    const { data: basemap, projection } = await projectGeo({
      loadbase: true,
      zoom: false,
      projsize,
    });

    let topo_basemap = topology({ basemap: basemap as any });
    topo_basemap = quantize(topo_basemap as any, 1e3) as any;
    const simplifiedBasemap = feature(
      presimplify(topo_basemap as any),
      topo_basemap.objects.basemap
    );

    // Dynamic import to avoid loading canvas at build time
    const { default: renderMap } = await import('@/app/lib/helpers/map/render');
    const { status, file, message } = await renderMap({
      basemap: simplifiedBasemap,
      projection,
      projsize,
      ...kwargs,
    });

    if (status === 200 && file) {
      // Store the file reference in the database
      await dbQuery(
        'general',
        `INSERT INTO generated_maps (filename, query_string) VALUES ($1, $2)`,
        [file, queryString]
      );

      return NextResponse.json({ status: 200, file });
    } else {
      return NextResponse.json(
        {
          status: 500,
          message: message || 'An error occurred and the image file could not be generated',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('POST /api/map error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    
    const kwargs: MapRequestParams = {
      projsize: searchParams.get('projsize') ? Number(searchParams.get('projsize')) : undefined,
      background_color: searchParams.get('background_color') || undefined,
      base_color: searchParams.get('base_color') || undefined,
      layers: searchParams.get('layers') ? JSON.parse(searchParams.get('layers')!) : undefined,
      simplification: searchParams.get('simplification') ? Number(searchParams.get('simplification')) : undefined,
    };

    // Convert to POST request logic
    return POST(
      new NextRequest(req.url, {
        method: 'POST',
        body: JSON.stringify(kwargs),
        headers: req.headers,
      })
    );
  } catch (error) {
    console.error('GET /api/map error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
