import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { toast } from 'sonner'

import { linkOAuthAccount } from './actions/auth'
import authConfig from './config/auth'
import prisma from './config/db'

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  events: {
    async linkAccount({ user }) {
      if (user.id) await linkOAuthAccount({ userId: user.id })
    },
  },
  callbacks: {
    jwt({ token }) {
      return token
    },
    session({ session, token }) {
      session.user.id = token.sub as string
      return session
    },
    async signIn({ user }) {
      if (!user.id) return false
      return true
    },
  },
  adapter: PrismaAdapter(prisma),
  ...authConfig,
})
