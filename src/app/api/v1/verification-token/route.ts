import { database } from '@/infra/database'
import { webserver } from '@/infra/webserver'
import { emailValidation, tokenValidation } from '@/schemas'
import { sendEmail } from '@/utils/email'
import { generateOTP } from '@/utils/password'
import { addDays } from 'date-fns'
import { NextResponse, type NextRequest } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'

const verificationTokenPostSchema = z.object({
  email: emailValidation,
  opt: z.boolean().default(false),
  dayExpires: z.number().default(1),
  tokenType: z.string().optional(),
})

const verificationTokenGetSchema = z.object({
  email: emailValidation,
  token: tokenValidation,
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
      const parsedData = verificationTokenPostSchema.parse(body)

      // 2. useCase - check if email already exists in database
      const { email, opt, dayExpires, tokenType } = parsedData
      const emailExistsInDatabaseResult = await database.query({
        text: `
          SELECT
            u.id,
            u.email,
            u.name,
            u.nick_name,
            t.token,
            t.token_type,
            t.expires
          FROM
            users u
            LEFT JOIN verification_token t ON u.id = t.identifier AND t.token_type = $2
          WHERE
            u.email = $1
          ORDER BY
            t.created_at DESC
          LIMIT 1
        `,
        values: [email, tokenType],
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

      // 3. useCase - create token uuid / OPT and save it to database
      const token = opt ? generateOTP() : uuidv4()
      const now = new Date()
      const expires = addDays(now, dayExpires)

      if (emailExistsInDatabase.token) {
        await database.query({
          text: `
            UPDATE verification_token
            SET token = $1, expires = $2, updated_at = NOW()
            WHERE identifier = $3 AND token_type = $4
          `,
          values: [token, expires, emailExistsInDatabase.id, tokenType],
        })
      } else {
        await database.query({
          text: `
          INSERT INTO verification_token (identifier, token, expires, token_type) VALUES ($1, $2, $3, $4)`,
          values: [emailExistsInDatabase.id, token, expires, tokenType],
        })
      }

      // 4. useCase - send email with opt
      if (opt) {
        await sendEmail({
          type: 'VERIFICATION_EMAIL_WITH_OTP',
          data: {
            opt: token,
            url: `${webserver.host}/verify-email-opt?email=${email}&token=${token}`,
          },
          to: email,
          userId: emailExistsInDatabase.id,
        })
      }

      return NextResponse.json(
        {
          message: 'Token criado com sucesso.',
          token,
          email,
          userId: emailExistsInDatabase.id,
          name: emailExistsInDatabase.name,
          nickName: emailExistsInDatabase.nick_name,
        },
        { status: 201 },
      )
    }

    if (req.method === 'GET') {
      // 1. useCase - check if email and token or opt exists in query
      const email = req.nextUrl.searchParams.get('email')
      const token = req.nextUrl.searchParams.get('token')

      if (!email || !token) {
        return NextResponse.json(
          { message: 'Email e token são obrigatórios.' },
          { status: 400 },
        )
      }

      // 2. useCase - sanitize query
      const parsedData = verificationTokenGetSchema.parse({
        email,
        token,
      })

      // 3. useCase - check if token/opt is valid
      const tokenResult = await database.query({
        text: `
          SELECT identifier, expires
          FROM verification_token
          WHERE token = $1
            AND identifier = $2
            AND expires > NOW()
        `,
        values: [parsedData.token, parsedData.email],
      })

      const tokenData = tokenResult.rows[0]

      if (!tokenData) {
        return NextResponse.json(
          { message: 'Token inválido ou expirado.' },
          { status: 404 },
        )
      }

      // 4. useCase - update columns emailVerified and email_verified_provider in users table
      const updateResult = await database.query({
        text: `
          UPDATE users
          SET "emailVerified" = NOW(),
              email_verified_provider = 'credential'
          WHERE email = $1
        `,
        values: [parsedData.email],
      })

      if (updateResult.rowCount === 0) {
        return NextResponse.json(
          { message: 'Email não encontrado ou já verificado.' },
          { status: 404 },
        )
      }

      // 5. useCase - delete token from database
      const deleteResult = await database.query({
        text: `
          DELETE FROM verification_token
          WHERE token = $1
            AND identifier = $2
        `,
        values: [parsedData.token, parsedData.email],
      })

      if (deleteResult.rowCount === 0) {
        return NextResponse.json(
          { message: 'Erro ao deletar o token.' },
          { status: 500 },
        )
      }

      return NextResponse.json(
        { message: 'Email verificado com sucesso.' },
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
