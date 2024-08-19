import { NextCookieRepository } from '@/repositories/nextjs/next-cookie-repository'
import { PgAccountRepository } from '@/repositories/pg/pg-account-repository'
import { PgAvatarRepository } from '@/repositories/pg/pg-avatar-repository'
import { PgSessionRepository } from '@/repositories/pg/pg-session-repository'
import { PgUserRepository } from '@/repositories/pg/pg-user-repository'
import { SupabaseImageRepository } from '@/repositories/supabase/supabase-image-repository'
import { LoginGoogleUseCase } from './login-google'

export function makeLoginGoogleUseCase() {
  const userRepository = new PgUserRepository()
  const sessionRepository = new PgSessionRepository()
  const accountRepository = new PgAccountRepository()
  const avatarRepository = new PgAvatarRepository()
  const cookieRepository = new NextCookieRepository()
  const imageRepository = new SupabaseImageRepository()

  const useCase = new LoginGoogleUseCase(
    userRepository,
    sessionRepository,
    accountRepository,
    avatarRepository,
    cookieRepository,
    imageRepository,
  )

  return useCase
}
