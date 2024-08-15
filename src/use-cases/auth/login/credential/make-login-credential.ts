import { PgSessionRepository } from '@/repositories/pg/pg-session-repository'
import { PgUserRepository } from '@/repositories/pg/pg-user-repository'
import { LoginCredentialUseCase } from './login-credential'

export function makeLoginCredentialUseCase() {
  const userRepository = new PgUserRepository()
  const sessionRepository = new PgSessionRepository()

  const useCase = new LoginCredentialUseCase(userRepository, sessionRepository)

  return useCase
}
