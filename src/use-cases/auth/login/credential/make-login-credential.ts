import { NextCookieRepository } from '@/repositories/nextjs/next-cookie-repository'
import { PgSessionRepository } from '@/repositories/pg/pg-session-repository'
import { PgUserRepository } from '@/repositories/pg/pg-user-repository'
import { PgVerificationTokenRepository } from '@/repositories/pg/pg-verification-token-repository'
import { LoginCredentialUseCase } from './login-credential'

export function makeLoginCredentialUseCase() {
  const userRepository = new PgUserRepository()
  const sessionRepository = new PgSessionRepository()
  const verificationTokenRepository = new PgVerificationTokenRepository()
  const cookieRepository = new NextCookieRepository()

  const useCase = new LoginCredentialUseCase(
    userRepository,
    sessionRepository,
    verificationTokenRepository,
    cookieRepository,
  )

  return useCase
}
