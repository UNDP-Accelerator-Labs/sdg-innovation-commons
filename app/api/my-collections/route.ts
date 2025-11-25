import { NextResponse } from 'next/server'
import { query } from '@/app/lib/db'
import getSession from '@/app/lib/session'

export async function GET(req: Request) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json([], { status: 200 })

    const creator = session.username || session.uuid || null
    // admins (rights >= 4) should see all draft collections for review
    if ((session?.rights ?? 0) >= 4) {
      const res = await query('general', `
        SELECT slug, title, description, main_image, sections, highlights, boards,
            id, creator_name, created_at, updated_at
        FROM collections
        WHERE 
        (
            boards IS NULL
            OR highlights ->> 'status' = 'draft'
            OR highlights ->> 'status' = 'awaiting_review'
            OR highlights ->> 'published' = 'false'
        )
        ORDER BY updated_at DESC;
        `)
      const rows = res?.rows || []
      return NextResponse.json(rows)
    }

    if (!creator) return NextResponse.json([], { status: 200 })

    const res = await query('general', 'SELECT slug, title, description, main_image, sections, highlights, boards, id, created_at, updated_at FROM collections WHERE creator_name = $1 OR highlights ->> creator_uuid = $2 ORDER BY updated_at DESC', [creator, session.uuid])
    const rows = res?.rows || []
    return NextResponse.json(rows)
  } catch (e) {
    console.error('GET /api/my-collections error', e)
    return NextResponse.json([], { status: 500 })
  }
}
