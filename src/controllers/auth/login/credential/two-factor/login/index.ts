import { tokenValidation } from '@/schemas'
import { makeTwoFactorLoginUseCase } from '@/use-cases/auth/login/credential/two-factor/make-two-factor'

import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

const twoFactorLoginSchema = z.object({
  userId: tokenValidation,
  opt: tokenValidation,
  device: z.string().toLowerCase().optional(),
})

export async function twoFactorLogin(req: NextRequest) {
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

      const parsedData = twoFactorLoginSchema.parse(body)

      const twoFactorLoginUseCase = makeTwoFactorLoginUseCase()

      const { message, userId, status } =
        await twoFactorLoginUseCase.execute(parsedData)

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
        '💥 Unexpected error during data sanitization in api/v1/public/auth/login/credential/two-factor/login',
        error,
      )

      const firstError = error.errors[0]?.message || 'Erro de validação.'
      return NextResponse.json({ message: firstError }, { status: 400 })
    }
    console.error(
      '💥 Unexpected error in api/v1/public/auth/login/credential/two-factor/login',
      error,
    )
    return NextResponse.json({ message: 'Erro inesperado.' }, { status: 500 })
  }
}
