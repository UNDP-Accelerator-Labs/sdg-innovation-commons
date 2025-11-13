// Server-side admin users page with pagination and search
import React from "react";
import getSession from "@/app/lib/session";
import { unauthorized } from "next/navigation";
import Navigation from "@/app/ui/components/Navbar";
import Footer from "@/app/ui/components/Footer";
import { query as dbQuery } from "@/app/lib/db";
import UserAction from "../components/UserAction.client";
import { Button } from "@/app/ui/components/Button";
import { Pagination } from "@/app/ui/components/Pagination";
import { MenuItem } from "@headlessui/react";
import DropDown from "@/app/ui/components/DropDown";

interface Props {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: Props) {
  const session = await getSession();
  const rights = session?.rights || 0;
  if (!session || rights < 4) return unauthorized();

  // `searchParams` may be a promise in Next.js dynamic routes — await it before using properties
  const sp = await (searchParams || ({} as any));
  const q = typeof sp?.q === "string" ? (sp.q as string) : "";
  const page = Number(typeof sp?.page === "string" ? sp.page : "1") || 1;
  const limit = Number(typeof sp?.limit === "string" ? sp.limit : "10") || 10;
  const offset = (page - 1) * limit;

  // build search where clause
  const whereClauses: string[] = [];
  const params: any[] = [];
  if (q && q.trim().length > 0) {
    const like = `%${q.trim()}%`;
    params.push(like, like, like);
    // cast uuid to text so ILIKE works on uuid columns in some DBs
    whereClauses.push(
      `(name ILIKE $${params.length - 2} OR email ILIKE $${params.length - 1} OR uuid::text ILIKE $${params.length})`
    );
  }
  const whereSql = whereClauses.length
    ? `WHERE ${whereClauses.join(" AND ")}`
    : "";

  // total count
  let total = 0;
  try {
    const countRes = await dbQuery(
      "general",
      `SELECT COUNT(*)::int AS count FROM users ${whereSql}`,
      params
    );
    total = countRes.rows?.[0]?.count || 0;
  } catch (e) {
    console.error("Failed to count users", e);
  }

  // fetch users
  let users: any[] = [];
  try {
    // detect whether `deleted` column exists to avoid SQL errors on some schemas
    let hasDeletedCol = false;
    try {
      const colRes = await dbQuery(
        "general",
        `SELECT 1 FROM information_schema.columns WHERE table_name = $1 AND column_name = $2 LIMIT 1`,
        ["users", "deleted"]
      );
      hasDeletedCol = (colRes.rows || []).length > 0;
    } catch (probeErr) {
      console.warn(
        "Failed to probe users.deleted column, proceeding without it",
        probeErr
      );
      hasDeletedCol = false;
    }

    // detect country-like columns so we can select and display country/iso3
    let countrySelectExpr = ''; // empty means no country available
    try {
      const colsRes = await dbQuery(
        'general',
        `SELECT column_name FROM information_schema.columns WHERE table_name = $1 AND column_name IN ('country','iso3','meta','country_code')`,
        ['users']
      );
      const cols = (colsRes.rows || []).map((r: any) => r.column_name);
      if (cols.includes('country')) {
        countrySelectExpr = 'country';
      } else if (cols.includes('iso3')) {
        countrySelectExpr = 'iso3';
      } else if (cols.includes('meta')) {
        // meta may be jsonb containing an iso3 field
        countrySelectExpr = "meta->>'iso3' AS iso3";
      } else if (cols.includes('country_code')) {
        countrySelectExpr = 'country_code';
      }
    } catch (e) {
      console.warn('Failed to probe country-like columns', e);
    }

    // add limit/offset params
    const qParams = [...params, limit, offset];
    const limitPlaceholder = `$${qParams.length - 1}`;
    const offsetPlaceholder = `$${qParams.length}`;

    // include country/iso3 select if available
    const baseCols = hasDeletedCol
      ? "uuid, name, email, rights, created_at, deleted"
      : "uuid, name, email, rights, created_at";
    const selectCols = countrySelectExpr ? `${baseCols}, ${countrySelectExpr}` : baseCols;
    const usersQuery = `SELECT ${selectCols} FROM users ${whereSql} ORDER BY created_at DESC NULLS LAST LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}`;

    const usersRes = await dbQuery("general", usersQuery, qParams);
    users = (usersRes.rows || []).map((r: any) =>
      // attach normalized country fields for ease of rendering
      (hasDeletedCol ? r : { ...r, deleted: false })
    );
  } catch (e) {
    console.error("Failed to fetch users", e);
  }

  // fetch country map
  let countryMap: { [key: string]: string } = {};
  try {
    const countryRes = await dbQuery(
      "general",
      `SELECT COALESCE(iso_a3, adm0_a3, NULL) AS iso3, name FROM adm0`
    );
    countryMap = (countryRes.rows || []).reduce((acc: any, row: any) => {
      acc[row.iso3.toLowerCase()] = row.name;
      return acc;
    }, {});
  } catch (e) {
    console.error("Failed to fetch countries", e);
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      <Navigation />
      <div className="grid-bg">
      <main className="max-w-6xl mx-auto py-12">
        <div className="mb-8 mt-5 pt-8">
          <h1 className="text-4xl mb-2 font-bold">
            <>User </>
            <span className="slanted-bg blue">
              <span>Management</span>
            </span>
          </h1>
          <p className="text-gray-600">
            Search, paginate and manage user rights and status.
          </p>
        </div>

        {/* Search bar */}
        <form
          id="search-form"
          method="get"
          action="/admin/users"
          className="section-header relative pb-[40px] lg:pb-[40px]"
        >
          <div className="group col-span-9 flex flex-row items-stretch lg:col-span-4">
            <input
              type="text"
              name="q"
              defaultValue={q || ""}
              placeholder="Search by name, email or uuid"
              id="admin-search-bar"
              className="grow !border-r-0 border-black bg-white"
            />
            <Button type="submit" className="grow-0 border-l-0">
              Search
            </Button>
          </div>
          <div className="col-span-5 col-start-5 flex flex-row gap-x-2 md:col-span-2 md:col-start-8 lg:col-span-3 lg:col-end-10">
            <DropDown label="Results per page">
              <MenuItem
                as="a"
                className="w-full bg-white text-start hover:bg-lime-yellow"
                href={`/admin/users?q=${encodeURIComponent(q)}&limit=10&page=1`}
              >
                <div className="block border-none bg-inherit p-4 text-base text-inherit">
                  10
                </div>
              </MenuItem>
              <MenuItem
                as="a"
                className="w-full bg-white text-start hover:bg-lime-yellow"
                href={`/admin/users?q=${encodeURIComponent(q)}&limit=20&page=1`}
              >
                <div className="block border-none bg-inherit p-4 text-base text-inherit">
                  20
                </div>
              </MenuItem>
              <MenuItem
                as="a"
                className="w-full bg-white text-start hover:bg-lime-yellow"
                href={`/admin/users?q=${encodeURIComponent(q)}&limit=50&page=1`}
              >
                <div className="block border-none bg-inherit p-4 text-base text-inherit">
                  50
                </div>
              </MenuItem>
            </DropDown>
          </div>
        </form>

        <div className="bg-white border-2 border-black border-solid rounded shadow-sm overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Country</th>
                <th className="p-3">Rights</th>
                <th className="p-3">Status</th>
                <th className="p-3">Joined</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.uuid} className="border-t hover:bg-gray-50">
                    <td className="p-3 align-top">{u.name || u.uuid}</td>
                    <td className="p-3 align-top text-sm text-gray-600">
                      {u.email}
                    </td>
                    <td className="p-3 align-top text-sm text-gray-600">
                      {(() => {
                        // prefer iso3-like fields, fallbacks to country_code or raw country
                        const code = (u.iso3 || u.country || u.country_code || (u.meta && u.meta?.iso3)) || '';
                        return code ? countryMap[code.toLowerCase()] || code : '';
                      })()}
                    </td>
                    <td className="p-3 align-top">{u.rights}</td>
                    <td className="p-3 align-top">
                      {u.deleted ? "Deactivated" : "Active"}
                    </td>
                    <td className="p-3 align-top text-sm text-gray-500">
                      {u.created_at
                        ? new Date(u.created_at).toLocaleString()
                        : ""}
                    </td>
                    <td className="p-3 align-top">
                      <UserAction
                        uuid={u.uuid}
                        rights={u.rights}
                        deleted={u.deleted}
                        name={u.name}
                        email={u.email}
                        country={u.country || u.iso3 || (u.meta && u.meta.iso3) || u.country_code || ""}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination mt-4">
          <div className="col-start-2 flex w-full justify-center">
            <Pagination page={+page} totalPages={totalPages} />
          </div>
        </div>
      </main>
      </div>
      <Footer />
    </div>
  );
}
