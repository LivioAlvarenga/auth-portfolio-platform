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
import PostgresAdapter from '@auth/pg-adapter'
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

const DAYS_30_IN_SECONDS = 30 * 24 * 60 * 60
const DAY_IN_SECONDS = 24 * 60 * 60

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
      allowDangerousEmailAccountLinking: true, // permite que o usuário vincule sua conta do Google a uma conta existente
    }),
  ],
  callbacks: {
    async session({ session }) {
      return session
    },
    async jwt() {
      return null
    },
    async signIn({ account, profile, user }) {
      // console.log('🚀 ~ signIn ~ user:', user)
      // console.log('🚀 ~ signIn ~ profile:', profile)
      // console.log('🚀 ~ signIn ~ account:', account)

      return true
    },
  },
  events: {
    async linkAccount(message) {
      // const { user, account, profile } = message
      // const userByEmailInDb = await database.query({
      //   text: 'SELECT * FROM users WHERE email = $1',
      //   values: [user.email],
      // })
      // // Apos cadastrar o usuário no banco de dados e criar o link com account vamos verificar para o Provider Google se o email ja foi verificado
      // if (
      //   account.provider === 'google' &&
      //   profile.emailVerified &&
      //   userByEmailInDb.rows[0].email === user.email
      // ) {
      //   // Atualize o emailVerified e email_verified_provider do usuário no banco de dados
      //   const timestamp = new Date()
      //   await database.query({
      //     text: 'UPDATE users SET "emailVerified" = $1, email_verified_provider = $2 WHERE email = $3',
      //     values: [timestamp, account.provider, user.email],
      //   })
      // }
    },
  },
})
