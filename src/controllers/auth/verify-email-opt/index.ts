import { tokenValidation } from '@/schemas'

import {
  makeGetVerifyEmailOptUseCase,
  makeVerifyEmailOptUseCase,
} from '@/use-cases/auth/verify-email-opt/make-verify-email-opt'
import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'

export async function verifyEmailOpt(req: NextRequest) {
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
      const parsedUserId = tokenValidation.parse(body.userId)

      const verifyEmailOptUseCase = makeVerifyEmailOptUseCase()

      const { message, userId, status } = await verifyEmailOptUseCase.execute({
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

    if (req.method === 'GET') {
      const token = req.nextUrl.searchParams.get('token')
      const opt = req.nextUrl.searchParams.get('opt')

      // Sanitize token
      const parsedToken = tokenValidation.parse(token)
      const parsedOpt = tokenValidation.parse(opt)

      if (!parsedOpt || !parsedToken) {
        return NextResponse.json(
          { message: 'Código OPT inválido.' },
          { status: 400 },
        )
      }

      const getVerifyEmailOptUseCase = makeGetVerifyEmailOptUseCase()

      const { message, userId, status } =
        await getVerifyEmailOptUseCase.execute({
          userId: parsedToken,
          opt: parsedOpt,
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
        '💥 Unexpected error during data sanitization in api/v1/auth/verifyEmailOpt',
        error,
      )

      const firstError = error.errors[0]?.message || 'Erro de validação.'
      return NextResponse.json({ message: firstError }, { status: 400 })
    }
    console.error('💥 Unexpected error in api/v1/auth/verifyEmailOpt', error)
    return NextResponse.json({ message: 'Erro inesperado.' }, { status: 500 })
  }
}
