import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getSessionCookie } from 'better-auth/cookies'

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
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon|login|$).*)'],
}
