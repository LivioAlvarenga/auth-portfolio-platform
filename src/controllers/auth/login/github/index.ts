import { NextCookieRepository } from '@/repositories/nextjs/next-cookie-repository'
import { makeLoginGithubUseCase } from '@/use-cases/auth/login/github/make-login-github'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const loginGithubSchema = z.object({
  device: z.string().toLowerCase(),
  sessionToken: z.string().uuid(), // get sessionToken from cookie
  avatarUrl: z.string().url().optional(), // get avatarUrl from cookie
  name: z.string().optional(), // get name from cookie
})

const CookieRepository = new NextCookieRepository()

export async function loginGithub(req: NextRequest) {
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

      const sessionTokenCookie = CookieRepository.getCookie(
        'authjs.session-token',
      )

      const sessionToken = sessionTokenCookie?.value || ''

      const avatarUrlCookie = CookieRepository.getCookie(
        'authjs.github-picture',
      )

      const avatarUrl = avatarUrlCookie?.value || undefined

      const nameCookie = CookieRepository.getCookie('authjs.github-name')

      const name = nameCookie?.value || undefined

      // Sanitize body
      const parsedData = loginGithubSchema.parse({
        device: body.device,
        sessionToken,
        avatarUrl,
        name,
      })

      const loginGithubUseCase = makeLoginGithubUseCase()

      const { message, userId, status } =
        await loginGithubUseCase.execute(parsedData)

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
        '💥 Unexpected error during data sanitization in api/v1/auth/login/github',
        error,
      )

      const firstError = error.errors[0]?.message || 'Erro de validação.'
      return NextResponse.json({ message: firstError }, { status: 400 })
    }
    console.error('💥 Unexpected error in api/v1/auth/login/github', error)
    return NextResponse.json({ message: 'Erro inesperado.' }, { status: 500 })
  }
}
