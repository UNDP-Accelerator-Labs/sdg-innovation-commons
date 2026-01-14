// API endpoint to record search analytics
import { NextRequest, NextResponse } from 'next/server';
import { query as dbQuery } from '@/app/lib/db';
import getSession from '@/app/lib/session';

export async function POST(request: NextRequest) {
  try {
    // Check if request has content
    const contentLength = request.headers.get('content-length');
    if (!contentLength || contentLength === '0') {
      return NextResponse.json(
        { error: 'Empty request body' },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    // Handle case where body is null or undefined
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Request body must be a valid JSON object' },
        { status: 400 }
      );
    }

    const {
      query: searchQuery,
      platform,
      searchType = 'general',
      resultsCount = 0,
      pageNumber = 1,
      filters = null,
      referrerUrl,
      searchPageUrl
    } = body;

    // Validate required fields
    if (!searchQuery || typeof searchQuery !== 'string' || searchQuery.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Get user session (optional)
    const session = await getSession();
    const userUuid = session?.uuid || null;

    // Get user IP and user agent
    // Extract IP address and remove port if present
    let userIp: string | null = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                 request.headers.get('x-real-ip') || 
                 request.headers.get('cf-connecting-ip') ||
                 request.headers.get('x-client-ip') ||
                 '';
    
    // Remove port from IP address if present (e.g., "88.97.207.222:63316" -> "88.97.207.222")
    if (userIp && userIp.includes(':') && !userIp.includes('[')) {
      // IPv4 with port - remove port
      userIp = userIp.split(':')[0];
    } else if (userIp && userIp.includes('[') && userIp.includes(']:')) {
      // IPv6 with port - extract IPv6 address
      const match = userIp.match(/\[([^\]]+)\]/);
      userIp = match ? match[1] : userIp;
    }
    
    // Convert empty string, localhost IPs, or invalid IP to null
    if (!userIp || userIp.trim() === '' || userIp === '::1' || userIp === '127.0.0.1' || userIp === 'localhost') {
      userIp = null;
    }
    
    const userAgent = request.headers.get('user-agent') || null;

    // Insert search record
    const insertQuery = `
      INSERT INTO search_analytics (
        query, 
        platform, 
        search_type, 
        user_uuid, 
        user_ip, 
        user_agent, 
        results_count, 
        page_number, 
        filters, 
        referrer_url, 
        search_page_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, searched_at
    `;

    const values = [
      searchQuery.trim(),
      platform || null,
      searchType,
      userUuid,
      userIp,
      userAgent,
      resultsCount,
      pageNumber,
      filters ? JSON.stringify(filters) : null,
      referrerUrl || null,
      searchPageUrl || null
    ];

    try {
      const result = await dbQuery('general', insertQuery, values);
      
      if (result.rows && result.rows.length > 0) {
        return NextResponse.json({
          success: true,
          id: result.rows[0].id,
          searchedAt: result.rows[0].searched_at
        });
      } else {
        throw new Error('Failed to insert search record');
      }
    } catch (dbError: any) {
      // Handle case where table doesn't exist yet
      if (dbError.message && dbError.message.includes('does not exist')) {
        console.warn('Search analytics table not found. Run migration: node run_search_analytics_migration.js');
        return NextResponse.json({
          success: false,
          error: 'Search analytics not configured',
          hint: 'Run database migration'
        }, { status: 503 });
      }
      throw dbError; // Re-throw other database errors
    }

  } catch (error) {
    console.error('Error recording search analytics:', error);
    console.error('Request details:', {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
      contentType: request.headers.get('content-type')
    });
    return NextResponse.json(
      { error: 'Failed to record search analytics' },
      { status: 500 }
    );
  }
}
