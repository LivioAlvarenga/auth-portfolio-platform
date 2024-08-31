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
import type { AdapterUser } from '@auth/core/adapters'
import PostgresAdapter from '@auth/pg-adapter'
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
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

        // We store `name` in a cookie for the same reason, allowing the `LoginGoogleUseCase` to access it server-side.
        if (profile?.name) {
          CookieRepository.setCookie({
            name: 'authjs.google-name',
            value: profile.name,
          })
        }

        // Remove `email_verified` and `picture` from the profile object before returning it.
        // This leaves the responsibility of handling these fields to our case use (`LoginGoogleUseCase`).
        profile.email_verified = undefined
        profile.picture = undefined
        profile.name = undefined

        return profile
      },
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        // We store `picture` in a cookie for the same reason, allowing the `LoginGithubUseCase` to access it server-side.
        if (profile?.avatar_url) {
          CookieRepository.setCookie({
            name: 'authjs.github-picture',
            value: profile.avatar_url,
          })
        }

        // We store `name` in a cookie for the same reason, allowing the `LoginGithubUseCase` to access it server-side.
        if (profile?.name) {
          CookieRepository.setCookie({
            name: 'authjs.github-name',
            value: profile.name,
          })
        }

        return {
          id: profile.id.toString(),
          name: undefined,
          email: profile.email,
          image: undefined,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const userSession: AdapterUser = {
        id: user.id,
        name: user.nick_name || user.name,
        role: user.role,
        email: user.email,
        emailVerified: null,
        image: user.image,
        profile_completion_score: user.profile_completion_score,
        two_factor_enabled: user.two_factor_enabled,
      }

      session = {
        expires: session.expires,
        sessionToken: session.sessionToken,
        userId: user.id,
        user: userSession,
      }

      return session
    },
    async jwt() {
      return null
    },
  },
})
