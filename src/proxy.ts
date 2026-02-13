import { getSessionCookie } from 'better-auth/cookies'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const sessionCookie = getSessionCookie(request)

  if (pathname.startsWith('/user') && !sessionCookie) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (pathname === '/login' && sessionCookie) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/user/:path*', '/login'],
}
