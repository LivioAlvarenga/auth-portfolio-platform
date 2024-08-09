import { PgUserRepository } from '@/repositories/pg/pg-user-repository'
import { PgVerificationTokenRepository } from '@/repositories/pg/pg-verification-token-repository'
import { GetVerifyEmailOptUseCase } from './get-verify-email-opt'
import { VerifyEmailOptUseCase } from './verify-email-opt'

export function makeVerifyEmailOptUseCase() {
  const userRepository = new PgUserRepository()
  const verificationTokenRepository = new PgVerificationTokenRepository()

  const useCase = new VerifyEmailOptUseCase(
    userRepository,
    verificationTokenRepository,
  )

  return useCase
}

export function makeGetVerifyEmailOptUseCase() {
  const userRepository = new PgUserRepository()
  const verificationTokenRepository = new PgVerificationTokenRepository()

  const useCase = new GetVerifyEmailOptUseCase(
    userRepository,
    verificationTokenRepository,
  )

  return useCase
}
