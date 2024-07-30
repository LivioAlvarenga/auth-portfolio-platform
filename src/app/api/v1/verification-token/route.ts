import { database } from '@/infra/database'
import { emailValidation } from '@/schemas'
import { addHours, isAfter } from 'date-fns'
import { NextResponse, type NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

const verificationTokenSchema = z.object({
  email: emailValidation,
})

async function verificationToken(req: NextRequest) {
  const allowedMethods = ['POST', 'GET']
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
      const parsedData = verificationTokenSchema.parse(body)

      // 2. useCase - check if email already exists in database
      const { email } = parsedData
      const emailExistsInDatabaseResult = await database.query({
        text: `SELECT * FROM users WHERE email = $1`,
        values: [email],
      })

      const emailExistsInDatabase = emailExistsInDatabaseResult.rows[0]

      if (!emailExistsInDatabase) {
        return NextResponse.json(
          {
            message:
              'Não foi possível criar o token, pois o email fornecido não existe.',
          },
          { status: 404 },
        )
      }

      // 3. useCase - create token uuid and save it to database
      const token = uuidv4()
      const now = new Date()
      const expires = addHours(now, 24)

      await database.query({
        text: `INSERT INTO verification_token (identifier, token, expires) VALUES ($1, $2, $3)`,
        values: [emailExistsInDatabase.email, token, expires],
      })

      return NextResponse.json(
        {
          message: 'Token criado com sucesso.',
          token,
        },
        { status: 201 },
      )
    }

    if (req.method === 'GET') {
      const token = req.nextUrl.searchParams.get('token')

      // 1. useCase - check if token exists
      if (!token) {
        return NextResponse.json(
          { message: 'Token não fornecido.' },
          { status: 400 },
        )
      }

      // 2. useCase - check if token is valid
      const tokenResult = await database.query({
        text: `SELECT identifier, expires FROM verification_token WHERE token = $1`,
        values: [token],
      })

      const tokenData = tokenResult.rows[0]

      if (!tokenData) {
        return NextResponse.json(
          { message: 'Token inválido ou expirado.' },
          { status: 404 },
        )
      }

      const { identifier, expires } = tokenData

      const now = new Date()
      if (isAfter(now, new Date(expires))) {
        return NextResponse.json(
          { message: 'Token inválido ou expirado.' },
          { status: 404 },
        )
      }

      // 3. useCase - get user data by identifier and return it
      const userResult = await database.query({
        text: `SELECT name, nick_name, email FROM users WHERE email = $1`,
        values: [identifier],
      })

      const userData = userResult.rows[0]

      return NextResponse.json(
        {
          name: userData.name,
          nick_name: userData.nick_name,
          email: userData.email,
          expires,
        },
        { status: 200 },
      )
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(
        '💥 Unexpected error during data sanitization in api/v1/verification-token',
        error,
      )

      const firstError = error.errors[0]?.message || 'Erro de validação.'
      return NextResponse.json({ message: firstError }, { status: 400 })
    }
    console.error('💥 Unexpected error in api/v1/verification-token', error)
    return NextResponse.json({ message: 'Erro inesperado.' }, { status: 500 })
  }
}

export {
  verificationToken as DELETE,
  verificationToken as GET,
  verificationToken as PATCH,
  verificationToken as POST,
  verificationToken as PUT,
}
