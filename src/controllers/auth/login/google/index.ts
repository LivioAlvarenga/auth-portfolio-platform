import { makeLoginGoogleUseCase } from '@/use-cases/auth/login/google/make-login-google'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const loginGoogleSchema = z.object({
  device: z.string().toLowerCase(),
})

export async function loginGoogle(req: NextRequest) {
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
      const parsedData = loginGoogleSchema.parse(body)

      const loginGoogleUseCase = makeLoginGoogleUseCase()

      const { message, userId, status } =
        await loginGoogleUseCase.execute(parsedData)

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
        '💥 Unexpected error during data sanitization in api/v1/auth/login/google',
        error,
      )

      const firstError = error.errors[0]?.message || 'Erro de validação.'
      return NextResponse.json({ message: firstError }, { status: 400 })
    }
    console.error('💥 Unexpected error in api/v1/auth/login/google', error)
    return NextResponse.json({ message: 'Erro inesperado.' }, { status: 500 })
  }
}
