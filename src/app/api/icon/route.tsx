import type { NextRequest } from 'next/server'
import { renderIcon, renderIconSvg } from '@/lib/icon-renderer'

const ALLOWED_SIZES = [32, 180, 192, 512]

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  if (searchParams.get('format') === 'svg') {
    return new Response(renderIconSvg(), {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  }

  const size = Number(searchParams.get('size') || 512)

  if (!ALLOWED_SIZES.includes(size)) {
    return new Response('Invalid size', { status: 400 })
  }

  return renderIcon(size)
}
