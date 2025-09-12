import { ImageResponse } from '@vercel/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || 'SDG Commons'
  const subtitle = searchParams.get('subtitle') || ''

  try {
    return new ImageResponse(
      (
        <div style={{
          display: 'flex',
          width: '1200px',
          height: '630px',
          background: '#0b3d91',
          color: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontFamily: 'Inter, sans-serif',
          padding: 48,
        }}>
          <div style={{ fontSize: 48, fontWeight: 700, textAlign: 'center', lineHeight: 1.1 }}>
            {title}
          </div>
          {subtitle && <div style={{ marginTop: 20, fontSize: 28, opacity: 0.9, textAlign: 'center' }}>{subtitle}</div>}
        </div>
      ),
      { width: 1200, height: 630 }
    )
  } catch (err) {
    return new Response('Failed to generate image', { status: 500 })
  }
}