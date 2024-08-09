import { PgAccountRepository } from '@/repositories/pg/pg-account-repository'
import { PgUserRepository } from '@/repositories/pg/pg-user-repository'
import { PgVerificationTokenRepository } from '@/repositories/pg/pg-verification-token-repository'
import { GetRegisterUseCase } from './get-register'
import { RegisterUseCase } from './register'

export function makeRegisterUserUseCase() {
  const userRepository = new PgUserRepository()
  const accountRepository = new PgAccountRepository()
  const verificationTokenRepository = new PgVerificationTokenRepository()

  const useCase = new RegisterUseCase(
    userRepository,
    accountRepository,
    verificationTokenRepository,
  )

  return useCase
}

export function makeGetRegisterUserUseCase() {
  const userRepository = new PgUserRepository()

  const useCase = new GetRegisterUseCase(userRepository)

  return useCase
}
