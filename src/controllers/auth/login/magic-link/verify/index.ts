import { tokenValidation } from '@/schemas'
import { makeVerifyMagicLinkUseCase } from '@/use-cases/auth/login/magic-link/make-magic-link'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const verifyMagicLinkSchema = z.object({
  token: z.object({
    identifier: tokenValidation,
    token: tokenValidation,
    token_type: z.string(),
    expires: z.string(),
  }),
  device: z.string().toLowerCase(),
})

export async function verifyMagicLink(req: NextRequest) {
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
      const parsedData = verifyMagicLinkSchema.parse(body)

      const verifyMagicLinkUseCase = makeVerifyMagicLinkUseCase()

      const { message, userId, status } =
        await verifyMagicLinkUseCase.execute(parsedData)

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
        '💥 Unexpected error during data sanitization in api/v1/auth/login/magic-link/verify',
        error,
      )

      const firstError = error.errors[0]?.message || 'Erro de validação.'
      return NextResponse.json({ message: firstError }, { status: 400 })
    }
    console.error(
      '💥 Unexpected error in api/v1/auth/login/magic-link/verify',
      error,
    )
    return NextResponse.json({ message: 'Erro inesperado.' }, { status: 500 })
  }
}
