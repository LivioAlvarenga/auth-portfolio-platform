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
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

export const {
  handlers: { GET, POST },
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
  },
  providers: [
    Credentials({
      // Para usar a tela de login padrão do NextAuth configure aqui os inputs credentials: { email: {label:'', ...}, password: {} }
      // Use authorize para validar as credenciais
      authorize(credentials) {
        console.log('❗❗❗credentials', credentials)
        // pegue email e senha de credentials
        // veja se o email existe no banco de dados
        // veja se a senha está correta
        // se estiver tudo certo retorne o usuário

        // chame aqui a rota /api/user?email=credentials.email&password=credentials.password
        // na rota /api/user faça a validação do email e senha
        // se o status for 200 retorne o usuário
        // ira adicionar o usuário no session e um token no cookie
        // se o status for 400 retorne null
        return { id: 'uuid', name: 'Livio', email: 'livioalvarenga@gmail.com' }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true, // permite que o usuário vincule sua conta do Google a uma conta existente
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          emailVerified: profile.email_verified,
          name: profile.name,
          image: profile.picture,
        }
      },
    }),
  ],
  callbacks: {
    // session({ session }) {
    //   console.log('⚡ Callback session:')
    //   return session
    // },
    // signIn() {
    //   console.log('❗ Callback signIn:')
    //   return true
    // },
    // jwt({ token }) {
    //   console.log('🟢 Callback JWT:')
    //   return token
    // },
    // authorized() {
    //   console.log('🌟 Callback authorized:')
    //   return true
    // },
  },
  events: {
    async linkAccount(message) {
      const { user, account, profile } = message

      const userByEmailInDb = await database.query({
        text: 'SELECT * FROM users WHERE email = $1',
        values: [user.email],
      })

      // Apos cadastrar o usuário no banco de dados e criar o link com account vamos verificar para o Provider Google se o email ja foi verificado
      if (
        account.provider === 'google' &&
        profile.emailVerified &&
        userByEmailInDb.rows[0].email === user.email
      ) {
        // Atualize o emailVerified e email_verified_provider do usuário no banco de dados
        const timestamp = new Date()
        await database.query({
          text: 'UPDATE users SET "emailVerified" = $1, email_verified_provider = $2 WHERE email = $3',
          values: [timestamp, account.provider, user.email],
        })
      }
    },
  },
})
