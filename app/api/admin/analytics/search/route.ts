// API endpoint to fetch search analytics data for admin dashboard
import { NextRequest, NextResponse } from 'next/server';
import { query as dbQuery } from '@/app/lib/db';
import getSession from '@/app/lib/session';

export async function GET(request: NextRequest) {
  try {
    // Check admin permissions
    const session = await getSession();
    const rights = session?.rights || 0;
    if (!session || rights < 4) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'summary';
    const platform = searchParams.get('platform');
    const days = parseInt(searchParams.get('days') || '30');
    const limit = parseInt(searchParams.get('limit') || '100');

    let result;

    // Check if search analytics tables exist
    try {
      await dbQuery('general', 'SELECT 1 FROM search_analytics LIMIT 1', []);
    } catch (tableError: any) {
      if (tableError.message && tableError.message.includes('does not exist')) {
        return NextResponse.json({
          success: false,
          error: 'Search analytics not configured',
          hint: 'Run database migration: node run_search_analytics_migration.js',
          stats: { total_searches: 0, unique_queries: 0, unique_users: 0, platforms_searched: 0, avg_results_per_search: 0 },
          wordcloud: [],
          summary: [],
          trends: []
        });
      }
      throw tableError;
    }

    switch (type) {
      case 'platforms':
        // Get available platforms that have search data
        let platformsQuery = `
          SELECT 
            platform,
            COUNT(*) as search_count,
            COUNT(DISTINCT query) as unique_queries,
            COUNT(DISTINCT user_uuid) as unique_users,
            MAX(searched_at) as latest_search
          FROM search_analytics 
          WHERE platform IS NOT NULL 
            AND platform != ''
            AND searched_at >= NOW() - INTERVAL '${days} days'
          GROUP BY platform
          ORDER BY search_count DESC
        `;

        result = await dbQuery('general', platformsQuery, []);
        
        return NextResponse.json({
          success: true,
          platforms: result.rows.map((row: any) => ({
            name: row.platform,
            searchCount: row.search_count,
            uniqueQueries: row.unique_queries,
            uniqueUsers: row.unique_users,
            latestSearch: row.latest_search
          }))
        });

      case 'wordcloud':
        // Get word frequency data for word cloud
        let wordcloudQuery = `
          SELECT 
            word,
            platform,
            frequency,
            days_used
          FROM search_word_frequency 
          WHERE 1=1
        `;
        const wordcloudParams: any[] = [];
        let paramIndex = 1;

        if (platform) {
          wordcloudQuery += ` AND platform = $${paramIndex++}`;
          wordcloudParams.push(platform);
        }

        if (days > 0) {
          wordcloudQuery += ` AND last_used >= NOW() - INTERVAL '${days} days'`;
        }

        wordcloudQuery += ` ORDER BY frequency DESC LIMIT $${paramIndex}`;
        wordcloudParams.push(limit);

        result = await dbQuery('general', wordcloudQuery, wordcloudParams);
        
        return NextResponse.json({
          success: true,
          wordcloud: result.rows.map((row: any) => ({
            text: row.word,
            size: row.frequency,
            platform: row.platform,
            daysUsed: row.days_used
          }))
        });

      case 'summary':
        // Get search summary statistics
        let summaryQuery = `
          SELECT 
            query,
            platform,
            search_type,
            search_count,
            avg_results,
            unique_users,
            first_searched,
            last_searched
          FROM search_analytics_summary 
          WHERE 1=1
        `;
        const summaryParams: any[] = [];
        let summaryParamIndex = 1;

        if (platform) {
          summaryQuery += ` AND platform = $${summaryParamIndex++}`;
          summaryParams.push(platform);
        }

        if (days > 0) {
          summaryQuery += ` AND last_searched >= NOW() - INTERVAL '${days} days'`;
        }

        summaryQuery += ` ORDER BY search_count DESC LIMIT $${summaryParamIndex}`;
        summaryParams.push(limit);

        result = await dbQuery('general', summaryQuery, summaryParams);
        
        return NextResponse.json({
          success: true,
          summary: result.rows
        });

      case 'trends':
        // Get search trends over time
        let trendsQuery = `
          SELECT 
            DATE(searched_at) as search_date,
            platform,
            COUNT(*) as daily_searches,
            COUNT(DISTINCT query) as unique_queries,
            COUNT(DISTINCT user_uuid) as unique_users
          FROM search_analytics 
          WHERE searched_at >= NOW() - INTERVAL '${days} days'
        `;
        const trendsParams: any[] = [];
        let trendsParamIndex = 1;

        if (platform) {
          trendsQuery += ` AND platform = $${trendsParamIndex++}`;
          trendsParams.push(platform);
        }

        trendsQuery += `
          GROUP BY DATE(searched_at), platform
          ORDER BY search_date DESC, platform
        `;

        result = await dbQuery('general', trendsQuery, trendsParams);
        
        return NextResponse.json({
          success: true,
          trends: result.rows
        });

      case 'stats':
        // Get overall statistics
        let statsQuery = `
          SELECT 
            COUNT(*) as total_searches,
            COUNT(DISTINCT query) as unique_queries,
            COUNT(DISTINCT user_uuid) as unique_users,
            COUNT(DISTINCT platform) as platforms_searched,
            AVG(results_count) as avg_results_per_search,
            MIN(searched_at) as first_search,
            MAX(searched_at) as latest_search
          FROM search_analytics
          WHERE searched_at >= NOW() - INTERVAL '${days} days'
        `;
        const statsParams: any[] = [];

        if (platform) {
          statsQuery += ` AND platform = $1`;
          statsParams.push(platform);
        }

        result = await dbQuery('general', statsQuery, statsParams);
        
        return NextResponse.json({
          success: true,
          stats: result.rows[0]
        });

      default:
        return NextResponse.json(
          { error: 'Invalid analytics type' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error fetching search analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch search analytics' },
      { status: 500 }
    );
  }
}
