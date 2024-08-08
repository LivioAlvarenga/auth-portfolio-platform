import {
  emailValidation,
  fullNameValidation,
  nickNameValidation,
  passwordValidation,
} from '@/schemas'
import { makeRegisterUserUseCase } from '@/use-cases/factories/make-register-use-case'
import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

const registerSchema = z.object({
  name: fullNameValidation.optional(),
  nick_name: nickNameValidation.optional(),
  email: emailValidation,
  password: passwordValidation.optional(),
})

async function register(req: NextRequest) {
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(
        '💥 Unexpected error during data sanitization in api/v1/register',
        error,
      )

      const firstError = error.errors[0]?.message || 'Erro de validação.'
      return NextResponse.json({ message: firstError }, { status: 400 })
    }
    console.error('💥 Unexpected error in api/v1/register', error)
    return NextResponse.json({ message: 'Erro inesperado.' }, { status: 500 })
  }
}

export {
  register as DELETE,
  register as GET,
  register as PATCH,
  register as POST,
  register as PUT,
}
