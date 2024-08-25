import { NextCookieRepository } from '@/repositories/nextjs/next-cookie-repository'
import { PgAvatarRepository } from '@/repositories/pg/pg-avatar-repository'
import { PgSessionRepository } from '@/repositories/pg/pg-session-repository'
import { PgUserRepository } from '@/repositories/pg/pg-user-repository'
import { SupabaseImageRepository } from '@/repositories/supabase/supabase-image-repository'
import { LoginGithubUseCase } from './login-github'

export function makeLoginGithubUseCase() {
  const userRepository = new PgUserRepository()
  const sessionRepository = new PgSessionRepository()
  const avatarRepository = new PgAvatarRepository()
  const cookieRepository = new NextCookieRepository()
  const imageRepository = new SupabaseImageRepository()

  const useCase = new LoginGithubUseCase(
    userRepository,
    sessionRepository,
    avatarRepository,
    cookieRepository,
    imageRepository,
  )

  return useCase
}
