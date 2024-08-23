import { emailValidation, tokenValidation } from '@/schemas'
import {
  makeGetRequestMagicLinkUseCase,
  makeRequestMagicLinkUseCase,
} from '@/use-cases/auth/login/magic-link/make-request-magic-link'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const requestMagicLinkSchema = z.object({
  email: emailValidation,
})

export async function requestMagicLink(req: NextRequest) {
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
      const parsedData = requestMagicLinkSchema.parse(body)

      const requestMagicLinkUseCase = makeRequestMagicLinkUseCase()

      const { message, userId, status } =
        await requestMagicLinkUseCase.execute(parsedData)

      return NextResponse.json(
        {
          message,
          userId,
        },
        { status },
      )
    }

    if (req.method === 'GET') {
      const tokenId = req.nextUrl.searchParams.get('token')

      // Sanitize token
      const parsedData = tokenValidation.parse(tokenId)

      const getRequestMagicLinkUseCase = makeGetRequestMagicLinkUseCase()

      const { message, token, status } =
        await getRequestMagicLinkUseCase.execute({ tokenId: parsedData })

      return NextResponse.json(
        {
          message,
          token,
        },
        { status },
      )
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(
        '💥 Unexpected error during data sanitization in api/v1/auth/login/request-magic-link',
        error,
      )

      const firstError = error.errors[0]?.message || 'Erro de validação.'
      return NextResponse.json({ message: firstError }, { status: 400 })
    }
    console.error(
      '💥 Unexpected error in api/v1/auth/login/request-magic-link',
      error,
    )
    return NextResponse.json({ message: 'Erro inesperado.' }, { status: 500 })
  }
}
