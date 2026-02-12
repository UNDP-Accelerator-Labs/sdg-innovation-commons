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
          background: 'linear-gradient(135deg, #0b3d91 0%, #1a5bbd 100%)',
          color: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontFamily: 'Inter, sans-serif',
          padding: 48,
          position: 'relative',
        }}>
          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            top: 40,
            left: 40,
            fontSize: 24,
            fontWeight: 600,
            opacity: 0.9,
          }}>
            SDG Commons
          </div>
          
          {/* Main content */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: '900px',
          }}>
            <div style={{ 
              fontSize: 56, 
              fontWeight: 700, 
              textAlign: 'center', 
              lineHeight: 1.2,
              marginBottom: subtitle ? 24 : 0,
            }}>
              {title}
            </div>
            {subtitle && (
              <div style={{ 
                marginTop: 20, 
                fontSize: 32, 
                opacity: 0.95, 
                textAlign: 'center',
                lineHeight: 1.4,
              }}>
                {subtitle}
              </div>
            )}
          </div>

          {/* UNDP branding at bottom */}
          <div style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 18,
            opacity: 0.8,
          }}>
            Powered by UNDP Accelerator Labs
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  } catch (err) {
    return new Response('Failed to generate image', { status: 500 })
  }
}