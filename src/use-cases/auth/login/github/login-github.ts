import { AvatarRepository } from '@/repositories/avatar-repository'
import { CookieRepository } from '@/repositories/cookie-repository'
import { ImageRepository } from '@/repositories/image-repository'
import { SessionRepository } from '@/repositories/session-repository'
import { UserRepository } from '@/repositories/user-repository'
import { calculateProfileCompletionScore } from '@/use-cases/utils/profile-completion-fields'
import { resizeAndConvertImage } from '@/utils/image'

interface LoginGithubUseCaseRequest {
  device: string
  sessionToken: string
  avatarUrl?: string
}

interface LoginGithubUseCaseResponse {
  status: number
  message: string
  userId?: string
}

export class LoginGithubUseCase {
  constructor(
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository,
    private avatarRepository: AvatarRepository,
    private cookieRepository: CookieRepository,
    private imageRepository: ImageRepository,
  ) {}

  async execute({
    device,
    sessionToken,
    avatarUrl,
  }: LoginGithubUseCaseRequest): Promise<LoginGithubUseCaseResponse> {
    // 1. useCase - delete all expired sessions or null deviceIdentifier
    await this.sessionRepository.deleteExpiredSessions()

    // 2. useCase - get session, user and account from database and update device, if not found delete session from database
    let user = null
    const session = await this.sessionRepository.getSessionByToken(sessionToken)

    if (session) {
      await this.sessionRepository.updateDeviceIdentifier(sessionToken, device)

      user = await this.userRepository.getUserById(session.userId)
    } else {
      return {
        status: 404,
        message: 'Sessão não encontrada.',
      }
    }

    // 3. useCase - check if email was verified and update emailVerified and email_verified_provider
    if (user && !user.emailVerified) {
      await this.userRepository.updateUser(user.id, {
        emailVerified: new Date(),
        email_verified_provider: 'github',
      })
    }

    // 4. useCase - get avatarUrl, resize, save in bucket, add url in avatars table, update users.image with avatarUrl if not exists
    if (avatarUrl && user) {
      const resizeImage = await resizeAndConvertImage({ url: avatarUrl })

      const fileName = `${user.id}-github-avatar.jpeg`
      const avatarPath = await this.imageRepository.uploadImage({
        imageBuffer: resizeImage,
        imageName: fileName,
        overwrite: true,
        filePath: 'avatars',
      })

      const avatar = await this.avatarRepository.getAvatarByProvider('github')

      if (avatarPath && !avatar) {
        await this.avatarRepository.create({
          userId: user.id,
          url: avatarPath,
          provider: 'github',
        })
      }

      if (avatarPath && avatar) {
        await this.avatarRepository.updateAvatarById(avatar.id, {
          userId: user.id,
          url: avatarPath,
          provider: 'github',
        })
      }

      if (avatarPath && !user.image) {
        await this.userRepository.updateUser(user.id, {
          image: avatarPath,
        })
      }
    }

    // 5. useCase - delete cookies
    this.cookieRepository.deleteCookie('authjs.github-picture')

    // 6. useCase - Calculate the profile_completion_score
    if (user) {
      const userData = await this.userRepository.getUserById(user.id)
      if (userData) {
        const profileCompletionScore = calculateProfileCompletionScore(userData)

        await this.userRepository.updateProfileCompletionScore(
          user.id,
          profileCompletionScore,
        )
      }
    }

    return {
      status: 201,
      message: 'Usuário logado com sucesso!',
      userId: user?.id,
    }
  }
}
