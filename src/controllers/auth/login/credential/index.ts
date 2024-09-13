import { getClientIp } from '@/lib/ipinfo'
import { emailValidation, ipValidation, passwordValidation } from '@/schemas'
import { makeLoginCredentialUseCase } from '@/use-cases/auth/login/credential/make-login-credential'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const loginSchema = z.object({
  email: emailValidation,
  password: passwordValidation,
  device: z.string().toLowerCase().optional(),
  ip: ipValidation,
})

export async function loginCredential(req: NextRequest) {
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

      // Get client IP address from the request headers or socket
      const ip = getClientIp(req)

      // Sanitize body
      const parsedData = loginSchema.parse({ ...body, ip })

      const loginUseCase = makeLoginCredentialUseCase()

      const { message, userId, status } = await loginUseCase.execute(parsedData)

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
        '💥 Unexpected error during data sanitization in api/v1/auth/login/credential',
        error,
      )

      const firstError = error.errors[0]?.message || 'Erro de validação.'
      return NextResponse.json({ message: firstError }, { status: 400 })
    }
    console.error('💥 Unexpected error in api/v1/auth/login/credential', error)
    return NextResponse.json({ message: 'Erro inesperado.' }, { status: 500 })
  }
}
