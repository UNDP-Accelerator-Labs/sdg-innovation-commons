// Server-side admin content moderation page with pagination and search
import React from "react";
import getSession from "@/app/lib/session";
import { unauthorized } from "next/navigation";
import Navigation from "@/app/ui/components/Navbar";
import Footer from "@/app/ui/components/Footer";
import { query as dbQuery } from "@/app/lib/db";
import { Button } from "@/app/ui/components/Button";
import { Pagination } from "@/app/ui/components/Pagination";
import Link from "next/link";
import { ChevronLeft, Flag } from 'lucide-react';
import AdminActions from './AdminActions';
import SearchFilters from './SearchFilters';
import FlagDetailsModal from './FlagDetailsModal';

const REASON_LABELS: Record<string, string> = {
  inappropriate_content: 'Inappropriate Content',
  spam: 'Spam or Promotional Content',
  harassment: 'Harassment or Abuse',
  misinformation: 'Misinformation or False Claims',
  copyright_violation: 'Copyright Violation',
  other: 'Other'
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
  dismissed: 'bg-gray-100 text-gray-800 border-gray-200'
};

export default async function AdminContentPage(props: any) {
  const session = await getSession();
  const rights = session?.rights || 0;
  if (!session || rights < 4) return unauthorized();

  const sp = await (props?.searchParams || ({} as any));
  const q = typeof sp?.q === "string" ? (sp.q as string) : "";
  const status = typeof sp?.status === "string" ? (sp.status as string) : "";
  const page = Number(typeof sp?.page === "string" ? sp.page : "1") || 1;
  const limit = Number(typeof sp?.limit === "string" ? sp.limit : "10") || 10;
  const offset = (page - 1) * limit;

  // Build search where clause
  const whereClauses: string[] = [];
  const params: any[] = [];
  
  if (q && q.trim().length > 0) {
    const like = `%${q.trim()}%`;
    params.push(like, like, like);
    whereClauses.push(
      `(cf.content_title ILIKE $${params.length - 2} OR cf.reason ILIKE $${params.length - 1} OR cf.description ILIKE $${params.length})`
    );
  }
  
  if (status && status.trim().length > 0) {
    params.push(status);
    whereClauses.push(`cf.status = $${params.length}`);
  }
  
  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

  // Total count and statistics
  let total = 0;
  let stats = {
    pending: 0,
    reviewed: 0,
    resolved: 0,
    dismissed: 0
  };

  try {
    const countRes = await dbQuery(
      "general",
      `SELECT COUNT(*)::int AS count FROM content_flags_with_latest_action cf
       LEFT JOIN users u ON cf.reporter_uuid = u.uuid
       LEFT JOIN users au ON cf.admin_uuid = au.uuid
       ${whereSql}`,
      params
    );
    total = countRes.rows?.[0]?.count || 0;

    // Get status statistics (only when no filters are applied for accurate overview)
    if (!q && !status) {
      const statsRes = await dbQuery(
        "general",
        `SELECT 
          status,
          COUNT(*)::int AS count
         FROM content_flags 
         WHERE action_type = 'flag'
         GROUP BY status`,
        []
      );
      
      statsRes.rows?.forEach((row: any) => {
        if (row.status in stats) {
          stats[row.status as keyof typeof stats] = row.count;
        }
      });
    }
  } catch (e) {
    console.error("Failed to count content flags", e);
  }

  // Fetch flags
  let flags: any[] = [];
  try {
    const qParams = [...params, limit, offset];
    const limitPlaceholder = `$${qParams.length - 1}`;
    const offsetPlaceholder = `$${qParams.length}`;

    const flagsQuery = `
      SELECT 
        cf.*,
        u.name as reporter_name,
        u.email as reporter_email,
        au.name as admin_name
      FROM content_flags_with_latest_action cf
      LEFT JOIN users u ON cf.reporter_uuid = u.uuid
      LEFT JOIN users au ON cf.admin_uuid = au.uuid
      ${whereSql}
      ORDER BY cf.created_at DESC 
      LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}
    `;

    const flagsRes = await dbQuery("general", flagsQuery, qParams);
    flags = flagsRes.rows || [];
  } catch (e) {
    console.error("Failed to fetch content flags", e);
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      <Navigation />
      <div className="grid-bg">
         <main className="max-w-6xl mx-auto py-12 my-10">
          <div className="mb-12 flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <h1 className="text-4xl mb-2 font-bold">
                <>Content </>
                <span className="slanted-bg red">
                  <span>Moderation</span>
                </span>
              </h1>
              <p className="text-gray-600">
                Review and manage flagged content reported by users.
              </p>
            </div>

            <div className="mt-6 sm:mt-0">
              <Button>
                <ChevronLeft className="size-4 mr-2" />
                <Link href="/admin">Back to Dashboard</Link>
              </Button>
            </div>
          </div>

          {/* Statistics Cards (only show when no filters applied) */}
          {!q && !status && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border-2 border-black rounded p-4">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pending Review</div>
              </div>
              <div className="bg-white border-2 border-black rounded p-4">
                <div className="text-2xl font-bold text-blue-600">{stats.reviewed}</div>
                <div className="text-sm text-gray-600">Under Review</div>
              </div>
              <div className="bg-white border-2 border-black rounded p-4">
                <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
                <div className="text-sm text-gray-600">Resolved</div>
              </div>
              <div className="bg-white border-2 border-black rounded p-4">
                <div className="text-2xl font-bold text-gray-600">{stats.dismissed}</div>
                <div className="text-sm text-gray-600">Dismissed</div>
              </div>
            </div>
          )}


          {/* Search and filter bar */}
          <SearchFilters 
            initialQ={q}
            initialStatus={status}
            initialLimit={limit}
            initialPage={page}
          />

          {/* Clear filters button */}
          {(q || status) && (
            <div className="mb-4 flex justify-end">
              <Button className="text-sm">
                <Link href="/admin/content">Clear All Filters</Link>
              </Button>
            </div>
          )}

          <div className="bg-white border-2 border-black border-solid rounded shadow-sm overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Content Title</th>
                  <th className="p-3">Reporter</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Reported Date</th>
                  <th className="p-3">Details</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {flags.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        No flagged content found
                      </p>
                      <p>
                        {q || status ? 
                          "Try adjusting your search criteria or filters." :
                          page > 1 && total > 0 ?
                          "This page doesn't contain any results. Try going back to an earlier page." :
                          "All reported content has been reviewed or there are no reports yet."
                        }
                      </p>
                      {page > 1 && total > 0 && (
                        <div className="mt-4">
                          <Button>
                            <Link href="/admin/content">Go to First Page</Link>
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  flags.map((flag) => {
                    // Use the display_url from the database view (guaranteed to have a value)
                    const contentUrl = flag.content_url;

                    return (
                      <tr key={flag.id} className="border-t hover:bg-gray-50">
                        {/* Content Title */}
                        <td className="p-3 align-top">
                          <div className="max-w-xs">
                            <div className="font-medium text-gray-900">
                              {contentUrl ? (
                                <Link
                                  href={contentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                  title="View content in new tab"
                                >
                                  {flag.content_title || `${flag.content_type} #${flag.content_id}`}
                                </Link>
                              ) : (
                                <span>{flag.content_title || `${flag.content_type} #${flag.content_id}`}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        
                        {/* Reporter */}
                        <td className="p-3 align-top text-sm text-gray-600">
                          <div>{flag.reporter_name || 'Anonymous'}</div>
                          {flag.reporter_email && (
                            <div className="text-xs text-gray-500">{flag.reporter_email}</div>
                          )}
                        </td>
                        
                        {/* Status */}
                        <td className="p-3 align-top">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[flag.status]}`}>
                            {flag.status}
                          </span>
                        </td>
                        
                        {/* Reported Date */}
                        <td className="p-3 align-top text-sm text-gray-600">
                          {flag.created_at ? new Date(flag.created_at).toLocaleDateString() : ""}
                        </td>
                        
                        {/* Details Button */}
                        <td className="p-3 align-top">
                          <FlagDetailsModal flag={flag} />
                        </td>
                        
                        {/* Actions */}
                        <td className="p-3 align-top">
                          <div className="flex flex-col items-start gap-1">
                            <AdminActions flag={flag} />
                            {flag.total_actions > 0 && (
                              <div className="text-xs text-gray-500">
                                {flag.total_actions} action{flag.total_actions > 1 ? 's' : ''} taken
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="bg-white border-2 border-black rounded-lg p-4">
                <Pagination page={+page} totalPages={totalPages} />
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
