import { NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import getSession from "@/app/lib/session";
import DOMPurify from "isomorphic-dompurify";

function validateSections(sections: any): { valid: boolean; message?: string } {
  if (sections === null || typeof sections === "undefined")
    return { valid: true };
  if (!Array.isArray(sections))
    return { valid: false, message: "sections must be an array" };
  if (sections.length > 50)
    return { valid: false, message: "too many sections (max 50)" };

  const allowedTypes = new Set(["txt", "list", "img"]);

  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    if (!s || typeof s !== "object")
      return { valid: false, message: `section[${i}] must be an object` };
    if (s.title && typeof s.title !== "string")
      return { valid: false, message: `section[${i}].title must be a string` };
    if (!Array.isArray(s.items))
      return { valid: false, message: `section[${i}].items must be an array` };
    if (s.items.length > 200)
      return {
        valid: false,
        message: `section[${i}] has too many items (max 200)`,
      };

    for (let j = 0; j < s.items.length; j++) {
      const it = s.items[j];
      if (!it || typeof it !== "object")
        return {
          valid: false,
          message: `section[${i}].items[${j}] must be an object`,
        };
      if (!it.type || typeof it.type !== "string")
        return {
          valid: false,
          message: `section[${i}].items[${j}].type missing or invalid`,
        };
      if (!allowedTypes.has(it.type))
        return {
          valid: false,
          message: `section[${i}].items[${j}].type must be one of ${Array.from(allowedTypes).join(",")}`,
        };

      if (it.type === "txt") {
        if (typeof it.txt !== "string")
          return {
            valid: false,
            message: `section[${i}].items[${j}].txt must be a string`,
          };
        if (it.txt.length > 20000)
          return {
            valid: false,
            message: `section[${i}].items[${j}].txt too long`,
          };
      }

      if (it.type === "list") {
        if (!Array.isArray(it.items))
          return {
            valid: false,
            message: `section[${i}].items[${j}].items must be an array`,
          };
        if (it.items.some((x: any) => typeof x !== "string"))
          return {
            valid: false,
            message: `section[${i}].items[${j}].items must be array of strings`,
          };
      }

      if (it.type === "img") {
        if (typeof it.src !== "string")
          return {
            valid: false,
            message: `section[${i}].items[${j}].src must be a string`,
          };
      }
    }
  }
  return { valid: true };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug");
    const list = url.searchParams.get("list");
    const limitParam = url.searchParams.get("limit");
    const offsetParam = url.searchParams.get("offset");

    if (slug) {
      const res = await query(
        "general",
        "SELECT * FROM collections WHERE slug = $1 LIMIT 1",
        [slug]
      );
      if (!res?.rows?.length)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

      const row = res.rows[0];
      const result = {
        slug: row.slug,
        title: row.title,
        description: row.description,
        content: row.content,
        creator_name: row.creator_name,
        main_image: row.main_image,
        sections: row.sections,
        highlights: row.highlights,
        boards: row.boards,
        id: row.id,
        created_at: row.created_at,
        updated_at: row.updated_at,
      };

      return NextResponse.json(result);
    }

    // Support listing public collections: consider a collection "public" if it has at least one attached board
    if (list === "public") {
      const limit = Math.min(100, Number(limitParam) || 12);
      const offset = Math.max(0, Number(offsetParam) || 0);
      // Include collections that either have public boards attached or have been approved (highlights.published = true)
      const sql = `SELECT slug, title, description, main_image, sections, highlights, boards, id, created_at, updated_at
                   FROM collections
                   WHERE highlights->> 'published' = 'true'
                   ORDER BY updated_at DESC
                   LIMIT $1 OFFSET $2`;
      const res = await query("general", sql, [limit, offset]);
      const rows = (res?.rows || []).map((r: any) => ({
        slug: r.slug,
        title: r.title,
        description: r.description,
        main_image: r.main_image,
        sections: r.sections,
        highlights: r.highlights,
        boards: r.boards,
        id: r.id,
        created_at: r.created_at,
        updated_at: r.updated_at,
      }));
      return NextResponse.json(rows);
    }

    return NextResponse.json(
      { error: "missing slug or unsupported list parameter" },
      { status: 400 }
    );
  } catch (e) {
    console.error("GET /api/collections error", e);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // server-side session/auth
    const session = await getSession();
        //Only contributors with right 2 and above are able to create next practices boards
    if (!session || (session?.rights ?? 0) < 2) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      slug,
      title,
      description,
      content,
      main_image,
      sections,
      highlights,
      boards,
      submit_for_review,
    } = body || {};

    if (!slug)
      return NextResponse.json({ error: "missing slug" }, { status: 400 });

    // validate sections shape
    const secValidation = validateSections(sections);
    if (!secValidation.valid) {
      return NextResponse.json(
        { error: "invalid sections", message: secValidation.message },
        { status: 400 }
      );
    }

    // normalize boards to integer array or null
    let boardsArr: number[] | null = null;
    if (Array.isArray(boards) && boards.length) {
      boardsArr = boards
        .map((b: any) => Number(b))
        .filter(
          (n: number) =>
            Number.isFinite(n) && Number(n) > 0 && Number.isInteger(n)
        );
      if (!boardsArr.length) boardsArr = null;
      // limit number of boards attached
      if (boardsArr && boardsArr.length > 50)
        return NextResponse.json(
          { error: "too many boards (max 50)" },
          { status: 400 }
        );
    }

    const creator_name = session.name || session.uuid || null;

    // sanitize description and sections (txt items) to avoid XSS in stored HTML
    const allowedTags = [
      "b",
      "i",
      "em",
      "strong",
      "u",
      "a",
      "p",
      "br",
      "ul",
      "ol",
      "li",
      "h1",
      "h2",
      "h3",
      "h4",
      "blockquote",
      "code",
      "pre",
      "span",
    ];
    const allowedAttrs = ["href", "target", "rel"];

    const cleanDescription = description
      ? DOMPurify.sanitize(String(description), {
          ALLOWED_TAGS: allowedTags,
          ALLOWED_ATTR: allowedAttrs,
        })
      : null;

    let sanitizedSections: any = null;
    if (Array.isArray(sections)) {
      sanitizedSections = sections.map((s: any) => {
        const sec: any = {};
        if (s.title) sec.title = String(s.title);
        sec.items = (s.items || [])
          .map((it: any) => {
            if (!it || typeof it !== "object") return null;
            const type = String(it.type || "txt");
            if (type === "txt") {
              const raw = String(it.txt || "");
              const clean = DOMPurify.sanitize(raw, {
                ALLOWED_TAGS: allowedTags,
                ALLOWED_ATTR: allowedAttrs,
              });
              return { type: "txt", txt: clean };
            }
            if (type === "list") {
              const items = Array.isArray(it.items)
                ? it.items.map((x: any) => String(x))
                : [];
              return { type: "list", items };
            }
            if (type === "img") {
              return { type: "img", src: String(it.src || "") };
            }
            return null;
          })
          .filter(Boolean);
        return sec;
      });
    }

    // Get existing highlights for updates to preserve them when not explicitly modifying
    let existingHighlights: any = null;
    try {
      const existingRes = await query(
        "general", 
        "SELECT highlights FROM collections WHERE slug = $1", 
        [slug]
      );
      if (existingRes?.rows?.length > 0) {
        existingHighlights = existingRes.rows[0].highlights;
      }
    } catch (e) {
      // Ignore error, treat as new collection
    }

    // Build highlights to store: if the client explicitly requested submit-for-review, mark awaiting_review.
    let finalHighlights: any = null;
    if (submit_for_review) {
      // When submitting for review, use existing highlights as base or provided highlights
      const base = highlights && typeof highlights === "object" 
        ? highlights 
        : (existingHighlights && typeof existingHighlights === "object" ? existingHighlights : {});
      finalHighlights = {
        ...base,
        awaiting_review: true,
        published: false,
        status: "awaiting_review",
        submitted_by: creator_name,
        creator_uuid: session?.uuid || null,
        submitted_at: new Date().toISOString(),
        comments: Array.isArray(base.comments) ? base.comments : [],
      };
    } else if (highlights && typeof highlights === "object") {
      // When highlights are explicitly provided, use them
      finalHighlights = {
        ...highlights,
        status: "draft",
        submitted_by: creator_name,
        creator_uuid: session?.uuid || null,
      };
    } else if (existingHighlights) {
      // When no highlights provided but existing collection has highlights, preserve them
      finalHighlights = existingHighlights;
    } else {
      // New collection with no highlights
      finalHighlights = null;
    }

    // Upsert by slug; server sets creator_name if inserting (or leaves existing creator_name on update if null)
    const sql = `INSERT INTO collections (slug, title, description, content, creator_name, main_image, sections, highlights, boards)
                 VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb,$9)
                 ON CONFLICT (slug) DO UPDATE SET
                   title = EXCLUDED.title,
                   description = EXCLUDED.description,
                   content = EXCLUDED.content,
                   creator_name = COALESCE(collections.creator_name, EXCLUDED.creator_name),
                   main_image = EXCLUDED.main_image,
                   sections = EXCLUDED.sections,
                   highlights = EXCLUDED.highlights,
                   boards = EXCLUDED.boards,
                   updated_at = NOW()
                 RETURNING *`;

    const params = [
      slug,
      title || null,
      cleanDescription,
      content || null,
      creator_name,
      main_image || null,
      sanitizedSections ? JSON.stringify(sanitizedSections) : null,
      finalHighlights ? JSON.stringify(finalHighlights) : null,
      boardsArr,
    ];

    const res = await query("general", sql, params as any[]);
    const row = res?.rows?.[0];
    if (!row)
      return NextResponse.json({ error: "upsert failed" }, { status: 500 });

    // Only notify admins when the user explicitly submitted for review
    const needsReview = !!submit_for_review;
    if (submit_for_review) {
      try {
        const { createNotification } = await import(
          "@/app/lib/data/platform-api"
        );
        await createNotification({
          type: "collection_review",
          level: "action_required",
          payload: {
            slug: row.slug,
            title: row.title,
            creator: creator_name,
            id: row.id,
            url: `/next-practice/${row.slug}`,
          },
          metadata: {
            adminUrl: `/next-practice/${row.slug}`,
          },
          actor_uuid: session?.uuid || null,
        });
      } catch (e) {
        console.warn("Failed to create review notification", e);
      }
    }

    return NextResponse.json({
      slug: row.slug,
      id: row.id,
      needs_review: needsReview,
    });
  } catch (e) {
    console.error("POST /api/collections error", e);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
