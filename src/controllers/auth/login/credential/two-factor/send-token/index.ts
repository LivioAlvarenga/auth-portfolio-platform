import { tokenValidation } from '@/schemas'
import { makeTwoFactorSendTokenUseCase } from '@/use-cases/auth/login/credential/two-factor/make-two-factor'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export async function twoFactorSendToken(req: NextRequest) {
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

      const parsedUserId = tokenValidation.parse(body.userId)

      const twoFactorSendTokenUseCase = makeTwoFactorSendTokenUseCase()

      const { message, userId, status } =
        await twoFactorSendTokenUseCase.execute({
          userId: parsedUserId,
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
        '💥 Unexpected error during data sanitization in api/v1/public/auth/login/credential/two-factor/send-token',
        error,
      )

      const firstError = error.errors[0]?.message || 'Erro de validação.'
      return NextResponse.json({ message: firstError }, { status: 400 })
    }
    console.error(
      '💥 Unexpected error in api/v1/public/auth/login/credential/two-factor/send-token',
      error,
    )
    return NextResponse.json({ message: 'Erro inesperado.' }, { status: 500 })
  }
}
