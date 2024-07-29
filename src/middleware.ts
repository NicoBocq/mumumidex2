import { NextRequest, NextResponse } from 'next/server'
import NextAuth, { Session } from 'next-auth'

import authConfig from '@/config/auth'

const { auth: middleware } = NextAuth(authConfig)

export default middleware((req: NextRequest & { auth: Session | null }) => {
  const session = req.auth
  const pathname = req.nextUrl.pathname

  if (pathname === '/' || pathname === '/login') {
    return NextResponse.next()
  }

  if (!session) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon|login|$).*)'],
}
