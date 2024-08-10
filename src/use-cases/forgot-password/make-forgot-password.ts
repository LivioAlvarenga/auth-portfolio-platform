import { PgUserRepository } from '@/repositories/pg/pg-user-repository'
import { PgVerificationTokenRepository } from '@/repositories/pg/pg-verification-token-repository'
import { ForgotPasswordUseCase } from './forgot-password'

export function makeForgotPasswordUseCase() {
  const userRepository = new PgUserRepository()
  const verificationTokenRepository = new PgVerificationTokenRepository()

  const useCase = new ForgotPasswordUseCase(
    userRepository,
    verificationTokenRepository,
  )

  return useCase
}
