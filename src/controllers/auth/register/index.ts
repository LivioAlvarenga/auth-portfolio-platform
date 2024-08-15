import {
  emailValidation,
  fullNameValidation,
  nickNameValidation,
  passwordValidation,
  tokenValidation,
} from '@/schemas'
import {
  makeGetRegisterUserUseCase,
  makeRegisterUserUseCase,
} from '@/use-cases/auth/register/make-register'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const registerSchema = z.object({
  name: fullNameValidation.optional(),
  nick_name: nickNameValidation.optional(),
  email: emailValidation,
  password: passwordValidation.optional(),
})

export async function register(req: NextRequest) {
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

      // Sanitize body
      const parsedData = registerSchema.parse(body)

      const registerUseCase = makeRegisterUserUseCase()

      const { message, userId, status } =
        await registerUseCase.execute(parsedData)

      return NextResponse.json(
        {
          message,
          userId,
        },
        { status },
      )
    }

    if (req.method === 'GET') {
      const token = req.nextUrl.searchParams.get('token')

      // Sanitize token
      const { data } = tokenValidation.safeParse(token)
      if (!data) {
        return NextResponse.json(
          { message: 'Token inválido.' },
          { status: 400 },
        )
      }

      const getRegisterUseCase = makeGetRegisterUserUseCase()

      const { message, user, status } = await getRegisterUseCase.execute({
        userId: data,
      })

      return NextResponse.json(
        {
          message,
          user,
        },
        { status },
      )
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(
        '💥 Unexpected error during data sanitization in api/v1/auth/register',
        error,
      )

      const firstError = error.errors[0]?.message || 'Erro de validação.'
      return NextResponse.json({ message: firstError }, { status: 400 })
    }
    console.error('💥 Unexpected error in api/v1/auth/register', error)
    return NextResponse.json({ message: 'Erro inesperado.' }, { status: 500 })
  }
}
