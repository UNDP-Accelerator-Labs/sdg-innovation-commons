import React from "react";
import Navigation from "@/app/ui/components/Navbar";
import Footer from "@/app/ui/components/Footer";
import { query as dbQuery } from "@/app/lib/db";
import getSession from "@/app/lib/session";
import { unauthorized } from "next/navigation";
import { Button } from '@/app/ui/components/Button';

import StatsClient from "./components/StatsClient.client";
import Link from "next/link";

export default async function AdminPage() {
  const session = await getSession();
  const currentRights = session?.rights || 0;
  if (!session || currentRights < 4) return unauthorized();

  let recentSignups: any[] = [];
  // Server-side metrics to populate the summary cards immediately
  let totalUsers = 0;
  let newUsers30 = 0;
  let contentLive = 0;
  let contentDraft = 0;
  try {
    // detect country-like column on users table
    let countrySelectExpr = '';
    try {
      const colsRes = await dbQuery(
        'general',
        `SELECT column_name FROM information_schema.columns WHERE table_name = $1 AND column_name IN ('country','iso3','meta','country_code')`,
        ['users']
      );
      const cols = (colsRes.rows || []).map((r: any) => r.column_name);
      if (cols.includes('country')) countrySelectExpr = 'country';
      else if (cols.includes('iso3')) countrySelectExpr = 'iso3';
      else if (cols.includes('meta')) countrySelectExpr = "meta->>'iso3' AS iso3";
      else if (cols.includes('country_code')) countrySelectExpr = 'country_code';
    } catch (e) {
      console.warn('Failed to probe country-like columns for recent signups', e);
    }

    const selectCols = countrySelectExpr ? `uuid, name, email, rights, created_at, ${countrySelectExpr}` : 'uuid, name, email, rights, created_at';
    const res = await dbQuery(
      'general',
      `SELECT ${selectCols} FROM users ORDER BY created_at DESC LIMIT 10`
    );
    recentSignups = (res.rows || []).map((r: any) => r);
  } catch (e) {
    console.error("Failed to fetch recent signups", e);
  }

  // fetch country map from adm0 for name lookup
  let countryMap: { [key: string]: string } = {};
  try {
    // probe which iso3-like column exists on adm0
    const colProbe = await dbQuery('general', `
      SELECT column_name FROM information_schema.columns WHERE table_name = $1
      AND column_name IN ('iso_a3','adm0_a3','adm0_a3')
    `, ['adm0']);
    const cols = (colProbe.rows || []).map((r: any) => r.column_name);
    let adm0IsoCol = '';
    if (cols.includes('iso_a3')) adm0IsoCol = 'iso_a3';
    else if (cols.includes('adm0_a3')) adm0IsoCol = 'adm0_a3';
    else if (cols.includes('iso3')) adm0IsoCol = 'iso3';

    const sel = adm0IsoCol ? `${adm0IsoCol} AS iso3, name` : `name`; // if no iso col, we'll only select name
    const countryRes = await dbQuery('general', `SELECT ${sel} FROM adm0`);
    countryMap = (countryRes.rows || []).reduce((acc: any, row: any) => {
      if (row.iso3) acc[String(row.iso3).toLowerCase()] = row.name;
      return acc;
    }, {});
  } catch (e) {
    console.error('Failed to fetch adm0 country map', e);
  }

  // populate metrics
  try {
    const tot = await dbQuery(
      "general",
      `SELECT COUNT(*)::int AS count FROM users`
    );
    totalUsers = tot.rows?.[0]?.count || 0;

    const nu = await dbQuery(
      "general",
      `SELECT COUNT(*)::int AS count FROM users WHERE created_at >= now() - interval '30 days'`
    );
    newUsers30 = nu.rows?.[0]?.count || 0;

    // Aggregate blogs/publications as live content (relevance >= 2)
    try {
      const b = await dbQuery(
        "blogs",
        `SELECT COUNT(*)::int AS count FROM articles WHERE relevance >= 2 AND (article_type = 'blog' OR article_type = 'publication')`
      );
      contentLive += Number(b.rows?.[0]?.count || 0);
    } catch (e) {
      console.warn("Failed to query blogs DB for admin metrics", e);
    }

    // count pads across known DBs and classify by status: 3 or 2 => live (published+preprint), others => draft
    const padDbs: Array<{ key: any; table?: string }> = [
      { key: "solutions", table: "pads" },
      { key: "experiment", table: "pads" },
      { key: "learningplan", table: "pads" },
    ];
    for (const db of padDbs) {
      try {
        const r = await dbQuery(db.key as any, `SELECT status, COUNT(*)::int AS count FROM ${db.table} GROUP BY status`);
        (r.rows || []).forEach((row: any) => {
          const s = Number(row.status);
          const cnt = Number(row.count) || 0;
          if (s === 3 || s === 2) contentLive += cnt; // published or preprint
          else contentDraft += cnt;
        });
      } catch (e) {
        console.warn("Failed to query pads counts for", db.key, e);
      }
    }
  } catch (e) {
    console.error("Failed to populate admin metrics", e);
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      <Navigation />

      <div className="grid-bg">
        <main className="max-w-6xl mx-auto py-12">
          <div className="mb-8 mt-5 pt-8">
            <h1 className="text-4xl mb-2 font-bold">
              <>Admin </>
              <span className="slanted-bg blue">
                <span>Dashboard</span>
              </span>
            </h1>
            <p className="text-gray-600">
              Overview of platform metrics, activity and quick management links.
            </p>
          </div>

          {/* Summary metric cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white border-2 border-black border-solid p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Total users
                  </p>
                  <p className="text-3xl font-bold mt-2">{totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
              <div className="h-1 w-16 bg-[#d2f960]"></div>
              <p className="mt-4 text-xs text-gray-500">
                Quick snapshot across platform
              </p>
            </div>

            <div className="bg-white border-2 border-black border-solid p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">New (30d)</p>
                  <p className="text-3xl font-bold mt-2">{newUsers30}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 flex items-center justify-center">
                  <span className="text-2xl">➕</span>
                </div>
              </div>
              <div className="h-1 w-16 bg-[#0072bc]"></div>
              <p className="mt-4 text-xs text-gray-500">Recent signups trend</p>
            </div>

            <div className="bg-white border-2 border-black border-solid p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Content (Live)
                  </p>
                  <p className="text-3xl font-bold mt-2">{contentLive}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-50 flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
              </div>
              <div className="h-1 w-16 bg-[#d2f960]"></div>
              <p className="mt-4 text-xs text-gray-500">
                Published + preprint across platforms
              </p>
            </div>

            <div className="bg-white border-2 border-solid border-black p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Content (Drafts)
                  </p>
                  <p className="text-3xl font-bold mt-2">{contentDraft}</p>
                </div>
                <div className="w-12 h-12 bg-pink-50 flex items-center justify-center">
                  <span className="text-2xl">📝</span>
                </div>
              </div>
              <div className="h-1 w-16 bg-[#0072bc]"></div>
              <p className="mt-4 text-xs text-gray-500">
                All draft content across platforms
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <div className="lg:col-span-2 bg-white border-2 border-black border-solid p-8">
              <div className="mb-6 pb-4 border-b-2 border-gray-200">
                <h3 className="font-bold text-xl">Activity & Trends</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Overview of user signups in last 30 days
                </p>
              </div>
              <StatsClient />
            </div>

            <div className="bg-white border-2 border-black border-solid p-8">
              <div className="mb-6 pb-4 border-b-2 border-gray-200">
                <h3 className="font-bold text-xl">Recent Signups</h3>
                <p className="text-sm text-gray-600 mt-1">Latest 10 users</p>
              </div>
              <div className="overflow-auto max-h-300">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="pb-3 font-bold text-xs text-gray-600">
                        Name
                      </th>
                      <th className="pb-3 font-bold text-xs text-gray-600">
                        Country
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSignups.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="py-4 text-gray-500">
                          No recent signups
                        </td>
                      </tr>
                    ) : (
                      recentSignups.map((u: any) => (
                        <tr key={u.uuid} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3">{u.name || u.uuid}</td>
                          <td className="py-3 font-medium">
                            {(() => {
                              const code = (u.iso3 || u.country || u.country_code || (u.meta && u.meta?.iso3)) || '';
                              return code ? (countryMap[code.toLowerCase()] || code) : '';
                            })()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <a
                  href="/admin/users"
                  className="text-sm text-[#0072bc] font-medium hover:underline"
                >
                  View all users →
                </a>
              </div>
            </div>
          </section>

          {/* Quick links / utilities */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border-2 border-black border-solid p-6">
              <h4 className="font-bold text-lg mb-2">User management</h4>
              <p className="text-sm text-gray-600 mb-4">
                Promote, demote or deactivate users.
              </p>
              <div className="h-1 w-12 bg-[#d2f960] mb-4"></div>
              <Button className="">
                <Link href="/admin/users">Manage Users</Link>
              </Button>
            </div>

            <div className="bg-white border-2 border-black border-solid p-6">
              <h4 className="font-bold text-lg mb-2">Content moderation</h4>
              <p className="text-sm text-gray-600 mb-4">
                Review and manage flagged content reported by users.
              </p>
              <div className="h-1 w-12 bg-[#ff6b6b] mb-4"></div>
              <Button className="">
                <Link href="/admin/content">Review Reports</Link>
              </Button>
            </div>

            <div className="bg-white border-2 border-black border-solid p-6">
              <h4 className="font-bold text-lg mb-2">Notifications</h4>
              <p className="text-sm text-gray-600 mb-4">
                View system-wide admin notifications and informational
                messages.
              </p>
              <div className="h-1 w-12 bg-[#0072bc] mb-4"></div>
              <Button className="">
                <Link href="/admin/notifications">View Notifications</Link>
              </Button>
            </div>

            <div className="bg-white border-2 border-black border-solid p-6">
              <h4 className="font-bold text-lg mb-2">Analytics & exports</h4>
              <p className="text-sm text-gray-600 mb-4">
                Export reports or examine logs.
              </p>
              <div className="h-1 w-12 bg-[#d2f960] mb-4"></div>
              <Button className="">
                <Link href="/admin/analytics">Open Analytics</Link>
              </Button>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
