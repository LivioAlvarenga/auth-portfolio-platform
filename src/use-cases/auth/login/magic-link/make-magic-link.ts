import { PgAccountRepository } from '@/repositories/pg/pg-account-repository'
import { PgUserRepository } from '@/repositories/pg/pg-user-repository'
import { PgVerificationTokenRepository } from '@/repositories/pg/pg-verification-token-repository'
import { GetRequestMagicLinkUseCase } from './request/get-request-magic-link'
import { RequestMagicLinkUseCase } from './request/post-request-magic-link'

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
