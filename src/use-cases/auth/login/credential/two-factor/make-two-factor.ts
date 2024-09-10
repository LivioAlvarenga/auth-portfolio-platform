import { NextCookieRepository } from '@/repositories/nextjs/next-cookie-repository'
import { PgSessionRepository } from '@/repositories/pg/pg-session-repository'
import { PgUserRepository } from '@/repositories/pg/pg-user-repository'
import { PgVerificationTokenRepository } from '@/repositories/pg/pg-verification-token-repository'
import { TwoFactorLoginUseCase } from './login/two-factor-login'
import { TwoFactorSendTokenUseCase } from './send-token/two-factor-send-token'
import { TwoFactorToggleUseCase } from './toggle/two-factor-toggle'

export function makeTwoFactorToggleUseCase() {
  const userRepository = new PgUserRepository()
  const sessionRepository = new PgSessionRepository()

  const useCase = new TwoFactorToggleUseCase(userRepository, sessionRepository)

  return useCase
}

export function makeTwoFactorSendTokenUseCase() {
  const userRepository = new PgUserRepository()
  const verificationTokenRepository = new PgVerificationTokenRepository()

  const useCase = new TwoFactorSendTokenUseCase(
    userRepository,
    verificationTokenRepository,
  )

  return useCase
}

export function makeTwoFactorLoginUseCase() {
  const userRepository = new PgUserRepository()
  const verificationTokenRepository = new PgVerificationTokenRepository()
  const sessionRepository = new PgSessionRepository()
  const cookieRepository = new NextCookieRepository()

  const useCase = new TwoFactorLoginUseCase(
    userRepository,
    verificationTokenRepository,
    sessionRepository,
    cookieRepository,
  )

  return useCase
}
