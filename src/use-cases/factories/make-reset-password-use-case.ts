import { PgUserRepository } from '@/repositories/pg/pg-user-repository'
import { PgVerificationTokenRepository } from '@/repositories/pg/pg-verification-token-repository'
import { ResetPasswordUseCase } from '../reset-password'

export function makeResetPasswordUseCase() {
  const userRepository = new PgUserRepository()
  const verificationTokenRepository = new PgVerificationTokenRepository()

  const useCase = new ResetPasswordUseCase(
    userRepository,
    verificationTokenRepository,
  )

  return useCase
}
