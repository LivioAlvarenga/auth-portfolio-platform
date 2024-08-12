import { PgAccountRepository } from '@/repositories/pg/pg-account-repository'
import { PgUserRepository } from '@/repositories/pg/pg-user-repository'
import { GetRegisterUseCase } from './get-register'
import { RegisterUseCase } from './register'

export function makeRegisterUserUseCase() {
  const userRepository = new PgUserRepository()
  const accountRepository = new PgAccountRepository()

  const useCase = new RegisterUseCase(userRepository, accountRepository)

  return useCase
}

export function makeGetRegisterUserUseCase() {
  const userRepository = new PgUserRepository()

  const useCase = new GetRegisterUseCase(userRepository)

  return useCase
}
