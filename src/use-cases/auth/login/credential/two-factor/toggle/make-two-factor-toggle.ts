import { PgSessionRepository } from '@/repositories/pg/pg-session-repository'
import { PgUserRepository } from '@/repositories/pg/pg-user-repository'
import { TwoFactorToggleUseCase } from './two-factor-toggle'

export function makeTwoFactorToggleUseCase() {
  const userRepository = new PgUserRepository()
  const sessionRepository = new PgSessionRepository()

  const useCase = new TwoFactorToggleUseCase(userRepository, sessionRepository)

  return useCase
}
