import { NextRequest, NextResponse } from 'next/server';
import { query as dbQuery } from '@/app/lib/db';

// Disable caching for this API route
export const dynamic = 'force-dynamic';

interface ArticlesRequestParams {
  id?: string | string[];
  url?: string | string[];
  pinboard?: string;
  page?: string;
  limit?: string;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    // Parse query parameters
    const params: ArticlesRequestParams = {
      id: searchParams.getAll('id'),
      url: searchParams.getAll('url'),
      pinboard: searchParams.get('pinboard') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
    };

    // Normalize `id` and `url` into arrays
    let idList: number[] = params.id 
      ? (Array.isArray(params.id) ? params.id : [params.id]).map(Number)
      : [];
    let urlList: string[] = params.url
      ? (Array.isArray(params.url) ? params.url : [params.url])
      : [];

    let pagination: { limit?: number; offset?: number } = {};
    let totalRecords = 0;

    // Handle pinboard query
    if (params.pinboard && +params.pinboard) {
      const pageNum = parseInt(params.page || '1', 10);
      const pageLimit = parseInt(params.limit || '10', 10);
      const offset = (pageNum - 1) * pageLimit;

      pagination = { limit: pageLimit, offset };

      // Fetch total count of records
      const countResult = await dbQuery(
        'general',
        `
        SELECT COUNT(*) AS total
        FROM pinboard_contributions a
        JOIN pinboards b ON a.pinboard = b.id
        WHERE b.id = $1 AND a.db = 5
        `,
        [params.pinboard]
      );
      totalRecords = parseInt(countResult.rows[0]?.total || '0', 10);

      if (!totalRecords) {
        return NextResponse.json({ 
          message: 'No related articles found', 
          data: [] 
        });
      }

      // Fetch article IDs from pinboard
      const articleIdsResult = await dbQuery(
        'general',
        `
        SELECT a.pad 
        FROM pinboard_contributions a
        JOIN pinboards b ON a.pinboard = b.id
        WHERE b.id = $1 AND a.db = 5
        ${params.limit ? 'LIMIT $2 OFFSET $3' : ''}
        `,
        params.limit ? [params.pinboard, pageLimit, offset] : [params.pinboard]
      );

      idList = articleIdsResult.rows.map((row: any) => row.pad);
    }

    // Ensure at least one of `id` or `url` is provided
    if (idList.length === 0 && urlList.length === 0) {
      return NextResponse.json(
        { error: "At least one 'id' or 'url' must be provided." },
        { status: 400 }
      );
    }

    // Fetch articles from blog database
    const articlesResult = await dbQuery(
      'blogs',
      `
      SELECT 
        a.id, 
        a.url, 
        a.article_type, 
        a.title, 
        a.iso3, 
        a.posted_date, 
        a.posted_date_str, 
        a.parsed_date, 
        a.language, 
        a.created_at, 
        c.html_content,
        regexp_replace(
          regexp_replace(COALESCE(b.content, c.html_content), E'\\n', ' ', 'g'),
          E'<iframe[^>]*>.*?</iframe>',
          '',
          'gi'
        ) AS content
      FROM articles a
      LEFT JOIN article_content b ON b.article_id = a.id 
      LEFT JOIN article_html_content c ON c.article_id = a.id
      WHERE (array_length($1::int[], 1) > 0 AND a.id = ANY ($1::int[]))
         OR (array_length($2::text[], 1) > 0 AND a.url = ANY ($2::text[]))
      `,
      [idList, urlList]
    );

    const results = articlesResult.rows;

    // Extract IDs from the first query results
    const articleIds = results.map((item: any) => item.id);

    // Fetch related pinboard data using the extracted IDs
    const relatedDataResult = await dbQuery(
      'general',
      `
      SELECT 
        id as pinboard_id, 
        title, 
        b.pad as article_id
      FROM pinboards a
      JOIN pinboard_contributions b ON b.pinboard = a.id
      WHERE b.pad = ANY ($1::int[])
        AND a.status >= 1
      `,
      [articleIds]
    );

    const relatedData = relatedDataResult.rows;

    // Merge the related data into the first query results
    const mergedResults = results.map((item: any) => {
      // Find matching related data by article_id
      const relatedItems = relatedData.filter(
        (rel: any) => rel.article_id === item.id
      );
      return {
        totalRecords: totalRecords ? totalRecords : results?.length,
        page: params.page ? parseInt(params.page, 10) : 1,
        limit: params.limit ? parseInt(params.limit, 10) : results?.length,
        ...item,
        pinboards: relatedItems,
      };
    });

    return NextResponse.json(mergedResults);
  } catch (err) {
    console.error('Database query failed:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
