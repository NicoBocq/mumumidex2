import { getSessionCookie } from 'better-auth/cookies'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname === '/' || pathname === '/login') {
    return NextResponse.next()
  }

  const sessionCookie = getSessionCookie(request)
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - Any path with a dot (e.g. icon.png, opengraph-image.png)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|opengraph-image|icon|apple-icon|login|.*\\..*|$).*)',
  ],
}
