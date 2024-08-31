import { NextCookieRepository } from '@/repositories/nextjs/next-cookie-repository'
import { tokenValidation } from '@/schemas'
import { makeTwoFactorToggleUseCase } from '@/use-cases/auth/login/credential/two-factor/toggle/make-two-factor-toggle'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const twoFactorToggleSchema = z.object({
  userId: tokenValidation,
  sessionToken: tokenValidation,
})

const CookieRepository = new NextCookieRepository()

export async function twoFactorToggle(req: NextRequest) {
  const allowedMethods = ['PATCH']
  if (!allowedMethods.includes(req.method)) {
    return NextResponse.json(
      { error: `method "${req.method}" not allowed` },
      { status: 405 },
    )
  }

  try {
    if (req.method === 'PATCH') {
      const body = await req.json()

      const sessionTokenCookie = CookieRepository.getCookie(
        'authjs.session-token',
      )

      const sessionToken = sessionTokenCookie?.value || ''

      // Sanitize body
      const parsedData = twoFactorToggleSchema.parse({
        userId: body.userId,
        sessionToken,
      })

      const twoFactorToggleUseCase = makeTwoFactorToggleUseCase()

      const { message, userId, status } =
        await twoFactorToggleUseCase.execute(parsedData)

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
        '💥 Unexpected error during data sanitization in api/v1/private/auth/login/credential/two-factor/toggle',
        error,
      )

      const firstError = error.errors[0]?.message || 'Erro de validação.'
      return NextResponse.json({ message: firstError }, { status: 400 })
    }
    console.error(
      '💥 Unexpected error in api/v1/private/auth/login/credential/two-factor/toggle',
      error,
    )
    return NextResponse.json({ message: 'Erro inesperado.' }, { status: 500 })
  }
}
