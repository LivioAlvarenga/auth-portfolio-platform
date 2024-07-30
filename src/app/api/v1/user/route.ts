import { database } from '@/infra/database'
import { hashPassword } from '@/lib/bcrypt'
import {
  emailValidation,
  fullNameValidation,
  nickNameValidation,
  passwordValidation,
} from '@/schemas'
import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

const userSchema = z.object({
  name: fullNameValidation.optional(),
  nick_name: nickNameValidation.optional(),
  email: emailValidation,
  password: passwordValidation.optional(),
})

async function user(req: NextRequest) {
  const allowedMethods = ['POST']
  if (!allowedMethods.includes(req.method)) {
    return NextResponse.json(
      { error: `method "${req.method}" not allowed` },
      { status: 405 },
    )
  }

  try {
    if (req.method === 'POST') {
      const body = await req.json()

      // 1. useCase - sanitize body
      const parsedData = userSchema.parse(body)

      // 2. useCase - check if email already exists to credential provider
      const { email } = parsedData
      const userAndProvidersByEmailResult = await database.query({
        text: `
          SELECT
            u.id,
            u.name,
            u.nick_name,
            u.email,
            u."emailVerified",
            u.email_verified_provider,
            u.image,
            u.password_hash,
            u.role,
            u.created_at,
            u.updated_at,
            json_agg(a.provider) AS providers
          FROM users u
          LEFT JOIN accounts a ON u.id = a."userId"
          WHERE u.email = $1
          GROUP BY u.id
        `,
        values: [email],
      })

      const userAndProvidersByEmail = userAndProvidersByEmailResult.rows[0]

      if (
        userAndProvidersByEmail &&
        userAndProvidersByEmail.providers.includes('credential')
      ) {
        return NextResponse.json(
          { message: 'E-mail já cadastrado.' },
          { status: 400 },
        )
      }

      // 3. useCase - hash password before saving
      const { password } = parsedData
      const hashedPassword = await hashPassword(password!)

      // 4. useCase - save user to database with minimal data (name, email, password_hash)
      if (!parsedData.name || !email || !hashedPassword) {
        return NextResponse.json(
          { message: 'Dados insuficientes para o cadastro.' },
          { status: 400 },
        )
      }

      // 5. useCase - insert user to database if user does not exist Or update user if user exists (if user start with provider !== credential)
      let userResult
      if (userAndProvidersByEmail) {
        userResult = await database.query({
          text: `UPDATE users SET password_hash = $2, name = $3, nick_name = $4 WHERE email = $1 RETURNING id, email, name, nick_name`,
          values: [
            email,
            hashedPassword,
            parsedData.name,
            parsedData.nick_name,
          ],
        })
      } else {
        userResult = await database.query({
          text: `INSERT INTO users (email, password_hash, name, nick_name) VALUES ($1, $2, $3, $4) RETURNING id, email, name, nick_name`,
          values: [
            email,
            hashedPassword,
            parsedData.name,
            parsedData.nick_name,
          ],
        })
      }

      // 6. useCase - Create account for user with provider credential in accounts table
      const newUser = userResult.rows[0]

      const accountResult = await database.query({
        text: `
          INSERT INTO accounts ("userId", type, provider, "providerAccountId")
          VALUES ($1, $2, $3, $4) RETURNING id
        `,
        values: [newUser.id, 'credential', 'credential', newUser.id],
      })

      return NextResponse.json(
        {
          message: 'Usuário criado com sucesso!',
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            nick_name: newUser.nick_name,
          },
          account: {
            id: accountResult.rows[0].id,
            provider: 'credential',
          },
        },
        { status: 201 },
      )
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(
        '💥 Unexpected error during data sanitization in api/v1/user',
        error,
      )

      const firstError = error.errors[0]?.message || 'Erro de validação.'
      return NextResponse.json({ message: firstError }, { status: 400 })
    }
    console.error('💥 Unexpected error in api/v1/user', error)
    return NextResponse.json({ message: 'Erro inesperado.' }, { status: 500 })
  }
}

export { user as DELETE, user as GET, user as PATCH, user as POST, user as PUT }
