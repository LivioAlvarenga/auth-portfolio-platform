import { passwordValidation, tokenValidation } from '@/schemas'
import { makeResetPasswordUseCase } from '@/use-cases/auth/reset-password/make-reset-password'

import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

const resetPasswordSchema = z.object({
  password: passwordValidation,
  identifier: tokenValidation,
})

export async function resetPassword(req: NextRequest) {
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
      const parsedData = resetPasswordSchema.parse(body)

      const resetPasswordUseCase = makeResetPasswordUseCase()

      const { message, userId, status } =
        await resetPasswordUseCase.execute(parsedData)

      return NextResponse.json({ message, userId }, { status })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(
        '💥 Unexpected error during data sanitization in api/v1/auth/reset-password',
        error,
      )

      const firstError = error.errors[0]?.message || 'Erro de validação.'
      return NextResponse.json({ message: firstError }, { status: 400 })
    }
    console.error('💥 Unexpected error in api/v1/auth/reset-password', error)
    return NextResponse.json({ message: 'Erro inesperado.' }, { status: 500 })
  }
}
