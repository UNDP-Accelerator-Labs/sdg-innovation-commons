import { NextResponse } from 'next/server'
import getSession from '@/app/lib/session'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ rights: 0 }, { status: 200 })
    return NextResponse.json({ rights: session.rights || 0, username: session.name || null }, { status: 200 })
  } catch (e) {
    console.error('GET /api/admin/check error', e)
    return NextResponse.json({ rights: 0 }, { status: 200 })
  }
}
