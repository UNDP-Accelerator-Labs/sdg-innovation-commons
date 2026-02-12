import { NextRequest, NextResponse } from 'next/server';
import { query as dbQuery } from '@/app/lib/db';
import { safeArr } from '@/app/lib/helpers';

interface RegionsRequestParams {
  countries?: string | string[];
  regions?: string | string[];
  language?: string;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const params: RegionsRequestParams = {
      countries: searchParams.getAll('countries'),
      regions: searchParams.getAll('regions'),
      language: searchParams.get('language') || 'en',
    };

    return await processRegionsRequest(params);
  } catch (error) {
    console.error('GET /api/regions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function processRegionsRequest(params: RegionsRequestParams) {
  let { countries, regions } = params;

  // Normalize to arrays
  const countriesArr = countries ? (Array.isArray(countries) ? countries : [countries]) : undefined;
  const regionsArr = regions ? (Array.isArray(regions) ? regions : [regions]) : undefined;

  // Build filters
  const filters: string[] = [];
  const filterParams: string[] = [];

  if (countriesArr && countriesArr.length > 0) {
    filters.push(`c.iso3 IN (${countriesArr.map((_, i) => `$${filterParams.length + i + 1}`).join(', ')})`);
    filterParams.push(...safeArr(countriesArr, '000'));
  }
  
  if (regionsArr && regionsArr.length > 0) {
    filters.push(`c.bureau IN (${regionsArr.map((_, i) => `$${filterParams.length + i + 1}`).join(', ')})`);
    filterParams.push(...safeArr(regionsArr, '000'));
  }

  const filterStr = filters.length > 0 ? filters.join(' AND ') : 'TRUE';

  try {
    const query = `
      SELECT DISTINCT (b.abbv) AS undp_region, b.name AS undp_region_name 
      FROM bureaux b
      LEFT JOIN countries c
        ON c.bureau = b.abbv
      WHERE TRUE
        AND ${filterStr}
    `;

    const result = await dbQuery('general', query, filterParams);

    return NextResponse.json(result.rows.length > 0 ? result.rows : []);
  } catch (error) {
    console.error('Error processing regions request:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
