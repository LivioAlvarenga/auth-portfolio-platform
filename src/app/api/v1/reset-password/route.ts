import { emailValidation, passwordValidation } from '@/schemas'
import { makeResetPasswordUseCase } from '@/use-cases/factories/make-reset-password-use-case'
import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

const userPasswordPutSchema = z.object({
  token: z.string().uuid(),
  password: passwordValidation,
  email: emailValidation,
})

async function userPassword(req: NextRequest) {
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
      const parsedData = userPasswordPutSchema.parse(body)

      const resetPasswordUseCase = makeResetPasswordUseCase()

      const { message, userId, status } =
        await resetPasswordUseCase.execute(parsedData)

      return NextResponse.json({ message, userId }, { status })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(
        '💥 Unexpected error during data sanitization in api/v1/user-password',
        error,
      )

      const firstError = error.errors[0]?.message || 'Erro de validação.'
      return NextResponse.json({ message: firstError }, { status: 400 })
    }
    console.error('💥 Unexpected error in api/v1/user-password', error)
    return NextResponse.json({ message: 'Erro inesperado.' }, { status: 500 })
  }
}

export {
  userPassword as DELETE,
  userPassword as GET,
  userPassword as PATCH,
  userPassword as POST,
  userPassword as PUT,
}
