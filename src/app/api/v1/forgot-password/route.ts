import { emailValidation } from '@/schemas'
import { makeForgotPasswordUseCase } from '@/use-cases/forgot-password/make-forgot-password'

import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

async function forgotPassword(req: NextRequest) {
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
      const parsedEmail = emailValidation.parse(body.email)

      const forgotPasswordUseCase = makeForgotPasswordUseCase()

      const { message, userId, status } = await forgotPasswordUseCase.execute({
        email: parsedEmail,
      })

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
        '💥 Unexpected error during data sanitization in api/v1/forgot-password',
        error,
      )

      const firstError = error.errors[0]?.message || 'Erro de validação.'
      return NextResponse.json({ message: firstError }, { status: 400 })
    }
    console.error('💥 Unexpected error in api/v1/forgot-password', error)
    return NextResponse.json({ message: 'Erro inesperado.' }, { status: 500 })
  }
}

export {
  forgotPassword as DELETE,
  forgotPassword as GET,
  forgotPassword as PATCH,
  forgotPassword as POST,
  forgotPassword as PUT,
}
