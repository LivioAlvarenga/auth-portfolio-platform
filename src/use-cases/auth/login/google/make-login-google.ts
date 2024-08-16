import { PgSessionRepository } from '@/repositories/pg/pg-session-repository'
import { PgUserRepository } from '@/repositories/pg/pg-user-repository'
import { LoginGoogleUseCase } from './login-google'

export function makeLoginGoogleUseCase() {
  const userRepository = new PgUserRepository()
  const sessionRepository = new PgSessionRepository()

  const useCase = new LoginGoogleUseCase(userRepository, sessionRepository)

  return useCase
}
