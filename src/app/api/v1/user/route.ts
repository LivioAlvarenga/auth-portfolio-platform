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
  nickName: nickNameValidation.optional(),
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

      // 2. useCase - check if email already exists
      const { email } = parsedData
      const userEmailResult = await database.query({
        text: 'SELECT * FROM users WHERE email = $1',
        values: [email],
      })

      if (userEmailResult.rows.length > 0) {
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

      const userResult = await database.query({
        text: `INSERT INTO users (email, password_hash, name, nick_name) VALUES ($1, $2, $3, $4) RETURNING id, email, name, nick_name`,
        values: [email, hashedPassword, parsedData.name, parsedData.nickName],
      })

      const newUser = userResult.rows[0]

      return NextResponse.json(
        {
          message: 'Usuário criado com sucesso!',
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            nickName: newUser.nick_name,
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
