import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  adapter: prisma ? (PrismaAdapter(prisma) as any) : undefined,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'placeholder_google_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder_google_client_secret',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null
        return {
          id: `user-${Date.now()}`,
          name: credentials.email.split('@')[0],
          email: credentials.email,
          role: credentials.role || 'CANDIDATE'
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role || 'CANDIDATE'
      }
      if (trigger === 'update' && session?.role) {
        token.role = session.role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.id || token.sub;
        (session.user as any).role = token.role || 'CANDIDATE'
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'hyrtica_production_secret_key_2026',
}
