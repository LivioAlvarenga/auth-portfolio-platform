import { PgSessionRepository } from '@/repositories/pg/pg-session-repository'
import { PgUserRepository } from '@/repositories/pg/pg-user-repository'
import { UpdateLocationConsentUseCase } from './update-location-consent'

export function makeUpdateLocationConsentUseCase() {
  const userRepository = new PgUserRepository()
  const sessionRepository = new PgSessionRepository()

  const useCase = new UpdateLocationConsentUseCase(
    userRepository,
    sessionRepository,
  )

  return useCase
}
