import { getLocationDataFromIP } from '@/lib/ipinfo'
import { CookieRepository } from '@/repositories/cookie-repository'
import { SessionRepository } from '@/repositories/session-repository'
import { UserRepository } from '@/repositories/user-repository'
import { VerificationTokenRepository } from '@/repositories/verification-token-repository'
import { calculateProfileCompletionScore } from '@/use-cases/utils/profile-completion-fields'
import { v4 } from 'uuid'

interface TwoFactorLoginUseCaseRequest {
  userId: string
  opt: string
  device?: string
  ip: string
}

interface TwoFactorLoginUseCaseResponse {
  status: number
  message: string
  userId?: string
}

const DAYS_30_IN_SECONDS = 30 * 24 * 60 * 60
const DAYS_30_IN_MILLISECONDS =
  parseInt(process.env.AUTH_SESSION_MAX_AGES!) * 1000 ||
  DAYS_30_IN_SECONDS * 1000

export class TwoFactorLoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private verificationTokenRepository: VerificationTokenRepository,
    private sessionRepository: SessionRepository,
    private cookieRepository: CookieRepository,
  ) {}

  async execute({
    userId,
    opt,
    device,
    ip,
  }: TwoFactorLoginUseCaseRequest): Promise<TwoFactorLoginUseCaseResponse> {
    // 1. useCase - delete all expired tokens
    await this.verificationTokenRepository.deleteExpiredTokens()

    // 2. useCase - check if user exists
    const user = await this.userRepository.getUserById(userId)

    if (!user) {
      return {
        status: 404,
        message: 'Usuário não encontrado.',
      }
    }

    // 3. useCase - get token by type and identifier
    const tokenType = 'TWO_FACTOR_VERIFICATION'
    const token =
      await this.verificationTokenRepository.getValidTokenByTypeAndIdentifier(
        user.id,
        tokenType,
      )

    if (!token) {
      return {
        status: 404,
        message: 'Token não encontrado ou expirado.',
      }
    }

    // 4. useCase - compare opt sent by user with opt in database
    if (token.opt !== opt) {
      return {
        status: 400,
        message: 'Token inválido.',
      }
    }

    // 5. useCase - update user emailVerified with date
    if (!user.emailVerified) {
      await this.userRepository.updateUser(user.id, {
        emailVerified: new Date(),
        email_verified_provider: 'credential',
      })
    }

    // 6. useCase - Calculate the profile_completion_score
    const userData = await this.userRepository.getUserById(user.id)
    if (userData) {
      const profileCompletionScore = calculateProfileCompletionScore(userData)

      await this.userRepository.updateProfileCompletionScore(
        user.id,
        profileCompletionScore,
      )
    }

    // 7. useCase - delete token
    await this.verificationTokenRepository.deleteToken(
      token.identifier,
      token.token,
    )

    // 8. useCase - create session token
    const sessionToken = v4()
    const sessionExpiry = new Date(Date.now() + DAYS_30_IN_MILLISECONDS)

    // 9. useCase - check if location_collection_consent is true, if true, update the user's location data
    let locationData
    if (user.location_collection_consent) {
      locationData = await getLocationDataFromIP(ip)
    }

    // 10. useCase - check if exist a session with userId and device, if exist delete the session and create new other, if not create a new session
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

    // 11. useCase - set session token cookie with the appropriate name and security settings
    this.cookieRepository.setCookie({
      name: 'authjs.session-token',
      value: sessionToken,
      expires: sessionExpiry,
    })

    return {
      status: 201,
      message: 'Usuário logado com sucesso!',
      userId: user.id,
    }
  }
}
