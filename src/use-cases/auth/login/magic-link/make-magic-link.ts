import { NextCookieRepository } from '@/repositories/nextjs/next-cookie-repository'
import { PgAccountRepository } from '@/repositories/pg/pg-account-repository'
import { PgSessionRepository } from '@/repositories/pg/pg-session-repository'
import { PgUserRepository } from '@/repositories/pg/pg-user-repository'
import { PgVerificationTokenRepository } from '@/repositories/pg/pg-verification-token-repository'
import { GetRequestMagicLinkUseCase } from './request/get-request-magic-link'
import { RequestMagicLinkUseCase } from './request/post-request-magic-link'
import { VerifyMagicLinkUseCase } from './verify/post-verify-magic-link'

export function makeRequestMagicLinkUseCase() {
  const userRepository = new PgUserRepository()
  const accountRepository = new PgAccountRepository()
  const verificationTokenRepository = new PgVerificationTokenRepository()

  const useCase = new RequestMagicLinkUseCase(
    userRepository,
    accountRepository,
    verificationTokenRepository,
  )

  return useCase
}

export function makeGetRequestMagicLinkUseCase() {
  const verificationTokenRepository = new PgVerificationTokenRepository()

  const useCase = new GetRequestMagicLinkUseCase(verificationTokenRepository)

  return useCase
}

export function makeVerifyMagicLinkUseCase() {
  const userRepository = new PgUserRepository()
  const sessionRepository = new PgSessionRepository()
  const verificationTokenRepository = new PgVerificationTokenRepository()
  const cookieRepository = new NextCookieRepository()

  const useCase = new VerifyMagicLinkUseCase(
    userRepository,
    sessionRepository,
    verificationTokenRepository,
    cookieRepository,
  )

  return useCase
}
