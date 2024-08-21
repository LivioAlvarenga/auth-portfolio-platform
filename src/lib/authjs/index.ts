/*
O AuthJs criar rotas como:
http://localhost:3000/api/auth/signin - Usado para fazer login
http://localhost:3000/api/auth/signout - Usado para fazer logout
http://localhost:3000/api/auth/session - Usado para obter a sessão do usuário
http://localhost:3000/api/auth/providers - Usado para obter os providers disponíveis
http://localhost:3000/api/auth/callback - Usado para lidar com Callbacks de provedores de autenticação
http://localhost:3000/api/auth/csrf - Usado para obter um token CSRF
http://localhost:3000/api/auth/verify-request - Usado para enviar um email de verificação
http://localhost:3000/api/auth/error - Usado para lidar com erros de autenticação
*/

import { database } from '@/infra/database'
import { NextCookieRepository } from '@/repositories/nextjs/next-cookie-repository'
import PostgresAdapter from '@auth/pg-adapter'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

const DAYS_30_IN_SECONDS = 30 * 24 * 60 * 60
const DAY_IN_SECONDS = 24 * 60 * 60

const CookieRepository = new NextCookieRepository()

export const {
  handlers,
  auth,
  signIn, // para usar singIn in server, para usar signIn in client use signIn de next-auth/react
  signOut, // para usar signOut in server, para usar signOut in client use signOut de next-auth/react
} = NextAuth({
  // Configure personalizações das paginas aqui
  pages: {
    signIn: '/login', // redirect http://localhost:3000/api/auth/signin para http://localhost:3000/login
  },
  adapter: PostgresAdapter(database.pool),
  session: {
    strategy: 'database',
    maxAge: parseInt(process.env.AUTH_SESSION_MAX_AGES!) || DAYS_30_IN_SECONDS,
    updateAge: DAY_IN_SECONDS,
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true, // Allows users to link their Google account to an existing account
      profile(profile) {
        // We are removing `email_verified` and `picture` from the profile object because Auth.js already processes these properties.
        // By removing them here, we delegate the responsibility of handling these properties to the `LoginGoogleUseCase`.
        // This ensures that our case use logic (LoginGoogleUseCase) has full control over these specific properties.

        // We store `email_verified` in a cookie to ensure that this information is accessible in the `LoginGoogleUseCase`.
        if (profile?.email_verified) {
          CookieRepository.setCookie({
            name: 'authjs.google-email-verified',
            value: profile.email_verified.toString(),
          })
        }

        // We store `picture` in a cookie for the same reason, allowing the `LoginGoogleUseCase` to access it server-side.
        if (profile?.picture) {
          CookieRepository.setCookie({
            name: 'authjs.google-picture',
            value: profile.picture,
          })
        }

        // Remove `email_verified` and `picture` from the profile object before returning it.
        // This leaves the responsibility of handling these fields to our case use (`LoginGoogleUseCase`).
        profile.email_verified = undefined
        profile.picture = undefined

        return profile
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const userSession = {
        id: user.id,
        name: user.nick_name || user.name,
        role: user.role,
        email: user.email,
        image: user.image,
      }
      // @ts-ignore
      session.user = userSession
      // @ts-ignore
      delete session.id // @ts-ignore
      delete session.expires // @ts-ignore
      delete session.sessionToken // @ts-ignore
      delete session.userId // @ts-ignore
      delete session.device_identifier // @ts-ignore
      delete session.created_at // @ts-ignore
      delete session.updated_at

      return session
    },
    async jwt() {
      return null
    },
  },
})
