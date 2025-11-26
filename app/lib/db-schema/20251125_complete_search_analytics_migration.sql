-- Complete Search Analytics Migration
-- This migration creates the complete search analytics system including:
-- 1. Main search_analytics table with correct column names for API compatibility
-- 2. All necessary indexes for performance
-- 3. All views including API-expected views (search_analytics_summary, search_word_frequency)
-- 4. Utility functions and triggers
-- 
-- Run this after dropping the existing search_analytics table and related objects

-- Create search analytics table for tracking user search behavior
CREATE TABLE search_analytics (
    id SERIAL PRIMARY KEY,
    query TEXT NOT NULL,
    platform VARCHAR(50),
    search_type VARCHAR(50) DEFAULT 'general',
    user_uuid UUID,
    user_ip INET,
    user_agent TEXT,
    results_count INTEGER DEFAULT 0,
    page_number INTEGER DEFAULT 1,
    filters JSONB DEFAULT '{}',
    referrer_url TEXT,
    search_page_url TEXT,
    searched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_search_analytics_query ON search_analytics(query);
CREATE INDEX idx_search_analytics_platform ON search_analytics(platform);
CREATE INDEX idx_search_analytics_user_uuid ON search_analytics(user_uuid);
CREATE INDEX idx_search_analytics_searched_at ON search_analytics(searched_at);
CREATE INDEX idx_search_analytics_created_at ON search_analytics(created_at);
CREATE INDEX idx_search_analytics_query_searched_at ON search_analytics(query, searched_at);
CREATE INDEX idx_search_analytics_platform_searched_at ON search_analytics(platform, searched_at);
CREATE INDEX idx_search_analytics_query_text ON search_analytics USING GIN(to_tsvector('english', query));
CREATE INDEX idx_search_analytics_platform_query ON search_analytics(platform, query);

-- Create GIN index for JSONB fields for efficient filtering
CREATE INDEX idx_search_analytics_filters ON search_analytics USING GIN(filters);

-- Create view for popular search terms
CREATE VIEW popular_search_terms AS
SELECT 
    LOWER(TRIM(query)) as normalized_query,
    query as original_query,
    COUNT(*) as search_count,
    COUNT(DISTINCT user_uuid) as unique_users,
    AVG(results_count) as avg_results_count,
    MAX(searched_at) as last_searched,
    MIN(searched_at) as first_searched
FROM search_analytics 
WHERE query IS NOT NULL AND TRIM(query) != ''
GROUP BY LOWER(TRIM(query)), query
ORDER BY search_count DESC;

-- Create view for search analytics by platform
CREATE VIEW search_analytics_by_platform AS
SELECT 
    platform,
    COUNT(*) as total_searches,
    COUNT(DISTINCT LOWER(TRIM(query))) as unique_queries,
    COUNT(DISTINCT user_uuid) as unique_users,
    AVG(results_count) as avg_results_count,
    DATE_TRUNC('day', searched_at) as search_date
FROM search_analytics 
WHERE platform IS NOT NULL
GROUP BY platform, DATE_TRUNC('day', searched_at)
ORDER BY search_date DESC, total_searches DESC;

-- Create view for daily search trends
CREATE VIEW daily_search_trends AS
SELECT 
    DATE_TRUNC('day', searched_at) as search_date,
    COUNT(*) as total_searches,
    COUNT(DISTINCT LOWER(TRIM(query))) as unique_queries,
    COUNT(DISTINCT user_uuid) as unique_users,
    COUNT(DISTINCT platform) as platforms_used,
    AVG(results_count) as avg_results_count
FROM search_analytics 
GROUP BY DATE_TRUNC('day', searched_at)
ORDER BY search_date DESC;

-- Create view for zero-result searches (important for improving search experience)
CREATE VIEW zero_result_searches AS
SELECT 
    LOWER(TRIM(query)) as normalized_query,
    query as original_query,
    platform,
    COUNT(*) as occurrence_count,
    COUNT(DISTINCT user_uuid) as unique_users,
    MAX(searched_at) as last_occurrence,
    filters
FROM search_analytics 
WHERE results_count = 0 AND query IS NOT NULL AND TRIM(query) != ''
GROUP BY LOWER(TRIM(query)), query, platform, filters
ORDER BY occurrence_count DESC, last_occurrence DESC;

-- Create view for search performance metrics
CREATE VIEW search_performance_metrics AS
SELECT 
    platform,
    DATE_TRUNC('hour', searched_at) as time_bucket,
    COUNT(*) as searches_per_hour,
    AVG(results_count) as avg_results_count,
    COUNT(CASE WHEN results_count = 0 THEN 1 END) as zero_result_count,
    ROUND(
        (COUNT(CASE WHEN results_count > 0 THEN 1 END)::DECIMAL / COUNT(*)) * 100, 
        2
    ) as success_rate
FROM search_analytics 
WHERE searched_at >= NOW() - INTERVAL '7 days'
GROUP BY platform, DATE_TRUNC('hour', searched_at)
ORDER BY time_bucket DESC;

-- Create view for search analytics summary (expected by API)
CREATE VIEW search_analytics_summary AS
SELECT 
    query,
    COALESCE(platform, 'unknown') as platform,
    COALESCE(search_type, 'general') as search_type,
    COUNT(*) as search_count,
    AVG(results_count) as avg_results,
    COUNT(DISTINCT user_uuid) as unique_users,
    MIN(searched_at) as first_searched,
    MAX(searched_at) as last_searched
FROM search_analytics 
WHERE query IS NOT NULL AND TRIM(query) != ''
GROUP BY query, platform, search_type
ORDER BY search_count DESC;

-- Create view for word frequency analysis (expected by API)
CREATE VIEW search_word_frequency AS
WITH word_extraction AS (
    SELECT 
        COALESCE(platform, 'unknown') as platform,
        LOWER(TRIM(unnest(string_to_array(query, ' ')))) as word,
        searched_at
    FROM search_analytics 
    WHERE query IS NOT NULL AND TRIM(query) != ''
), word_stats AS (
    SELECT 
        word,
        platform,
        COUNT(*) as frequency,
        COUNT(DISTINCT DATE(searched_at)) as days_used,
        MAX(searched_at) as last_used
    FROM word_extraction
    WHERE LENGTH(word) > 2 -- Filter out very short words
      AND word NOT IN ('the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'man', 'end', 'few', 'got', 'lot', 'own', 'say', 'she', 'too', 'use')
    GROUP BY word, platform
)
SELECT 
    word,
    platform,
    frequency,
    days_used,
    last_used,
    ROUND((frequency::DECIMAL / GREATEST(days_used, 1)), 2) as avg_daily_frequency
FROM word_stats
WHERE frequency >= 2 -- Only include words used at least twice
ORDER BY frequency DESC;

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_search_analytics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for automatically updating updated_at
CREATE TRIGGER update_search_analytics_updated_at_trigger
    BEFORE UPDATE ON search_analytics
    FOR EACH ROW
    EXECUTE FUNCTION update_search_analytics_updated_at();

-- Grant permissions (adjust based on your database user setup)
-- GRANT SELECT, INSERT, UPDATE ON search_analytics TO your_app_user;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Add comments for documentation
COMMENT ON TABLE search_analytics IS 'Tracks all user search queries and related metadata for analytics and optimization';
COMMENT ON COLUMN search_analytics.query IS 'The actual search query entered by the user';
COMMENT ON COLUMN search_analytics.platform IS 'The platform where the search was performed (solutions, accelerators, etc.)';
COMMENT ON COLUMN search_analytics.search_type IS 'Type of search performed (general, advanced, etc.)';
COMMENT ON COLUMN search_analytics.user_uuid IS 'UUID of the authenticated user (if logged in)';
COMMENT ON COLUMN search_analytics.user_ip IS 'IP address of the user performing the search';
COMMENT ON COLUMN search_analytics.user_agent IS 'Browser user agent string for device/browser analytics';
COMMENT ON COLUMN search_analytics.results_count IS 'Number of results returned for this search';
COMMENT ON COLUMN search_analytics.page_number IS 'Page number of search results viewed';
COMMENT ON COLUMN search_analytics.filters IS 'JSON object containing applied filters (SDGs, location, type, etc.)';
COMMENT ON COLUMN search_analytics.referrer_url IS 'URL of the page that referred to the search page';
COMMENT ON COLUMN search_analytics.search_page_url IS 'URL of the search page where the query was performed';
COMMENT ON COLUMN search_analytics.searched_at IS 'Timestamp when the search was performed';

-- View comments
COMMENT ON VIEW search_analytics_summary IS 'Summary view of search analytics data grouped by query and platform - used by admin API';
COMMENT ON VIEW search_word_frequency IS 'Word frequency analysis from search queries - used for word cloud visualization';
COMMENT ON VIEW popular_search_terms IS 'Popular search terms with usage statistics';
COMMENT ON VIEW search_analytics_by_platform IS 'Search analytics aggregated by platform and date';
COMMENT ON VIEW daily_search_trends IS 'Daily search trends across all platforms';
COMMENT ON VIEW zero_result_searches IS 'Searches that returned zero results - useful for improving search experience';
COMMENT ON VIEW search_performance_metrics IS 'Search performance metrics by platform and time';



