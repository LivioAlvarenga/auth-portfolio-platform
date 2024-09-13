import { getLocationDataFromIP } from '@/lib/ipinfo'
import { CookieRepository } from '@/repositories/cookie-repository'
import { SessionRepository } from '@/repositories/session-repository'
import { UserRepository } from '@/repositories/user-repository'
import { VerificationTokenRepository } from '@/repositories/verification-token-repository'
import { calculateProfileCompletionScore } from '@/use-cases/utils/profile-completion-fields'
import { v4 } from 'uuid'

interface VerifyMagicLinkUseCaseRequest {
  token: {
    identifier: string
    token: string
    token_type: string
    expires: string
  }
  device: string
  ip: string
}

interface VerifyMagicLinkUseCaseResponse {
  status: number
  message: string
  userId?: string
}

const DAYS_30_IN_SECONDS = 30 * 24 * 60 * 60
const DAYS_30_IN_MILLISECONDS =
  parseInt(process.env.AUTH_SESSION_MAX_AGES!) * 1000 ||
  DAYS_30_IN_SECONDS * 1000

export class VerifyMagicLinkUseCase {
  constructor(
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository,
    private verificationTokenRepository: VerificationTokenRepository,
    private cookieRepository: CookieRepository,
  ) {}

  async execute({
    token: { token },
    device,
    ip,
  }: VerifyMagicLinkUseCaseRequest): Promise<VerifyMagicLinkUseCaseResponse> {
    // 1. useCase - delete all expired tokens
    await this.verificationTokenRepository.deleteExpiredTokens()

    // 2. useCase - delete all expired sessions
    await this.sessionRepository.deleteExpiredSessions()

    // 3. useCase - check if token exists in database
    const verificationToken =
      await this.verificationTokenRepository.getValidTokenByToken(token)
    if (!verificationToken) {
      return {
        status: 404,
        message: 'Token não encontrado.',
      }
    }

    // 4. useCase - check if email was verified and update emailVerified and email_verified_provider
    const user = await this.userRepository.getUserById(
      verificationToken.identifier,
    )
    if (!user) {
      return {
        status: 404,
        message: 'Usuário não encontrado.',
      }
    }
    if (!user.emailVerified) {
      await this.userRepository.updateUser(user.id, {
        emailVerified: new Date(),
        email_verified_provider: 'magic-link',
      })
    }

    // 5. useCase - Calculate the profile_completion_score
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

    // 6. useCase - create session token
    const sessionToken = v4()
    const sessionExpiry = new Date(Date.now() + DAYS_30_IN_MILLISECONDS)

    // 7. useCase - check if location_collection_consent is true, if true, update the user's location data
    let locationData
    if (user.location_collection_consent) {
      locationData = await getLocationDataFromIP(ip)
    }

    // 8. useCase - check if exist a session with userId and device, if exist delete the session and create new other, if not create a new session
    const sessionExists =
      await this.sessionRepository.getSessionByUserIdAndDevice(
        user.id,
        device || '',
      )

    if (sessionExists) {
      await this.sessionRepository.deleteSessionByToken(
        sessionExists.sessionToken,
      )
    }

    await this.sessionRepository.createSession({
      sessionToken,
      userId: user.id,
      expires: sessionExpiry,
      device_identifier: device,
      ...locationData,
    })

    // 9. useCase - set session token cookie with the appropriate name and security settings
    this.cookieRepository.setCookie({
      name: 'authjs.session-token',
      value: sessionToken,
      expires: sessionExpiry,
    })

    // 10. useCase - delete verification token
    await this.verificationTokenRepository.deleteToken(
      verificationToken.identifier,
      verificationToken.token,
    )

    return {
      status: 201,
      message: 'Usuário logado com sucesso!',
      userId: user.id,
    }
  }
}
