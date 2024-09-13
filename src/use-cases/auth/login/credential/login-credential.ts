import { comparePassword } from '@/lib/bcrypt'
import { getLocationDataFromIP } from '@/lib/ipinfo'
import { CookieRepository } from '@/repositories/cookie-repository'
import { SessionRepository } from '@/repositories/session-repository'
import { UserRepository } from '@/repositories/user-repository'
import { VerificationTokenRepository } from '@/repositories/verification-token-repository'
import { v4 } from 'uuid'
import { generateAndSendTwoFactorToken } from './two-factor/send-token/two-factor-send-token'

interface LoginCredentialUseCaseRequest {
  email: string
  password: string
  device?: string
  ip: string
}

interface LoginCredentialUseCaseResponse {
  status: number
  message: string
  userId?: string
}

const DAYS_30_IN_SECONDS = 30 * 24 * 60 * 60
const DAYS_30_IN_MILLISECONDS =
  parseInt(process.env.AUTH_SESSION_MAX_AGES!) * 1000 ||
  DAYS_30_IN_SECONDS * 1000

export class LoginCredentialUseCase {
  constructor(
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository,
    private verificationTokenRepository: VerificationTokenRepository,
    private cookieRepository: CookieRepository,
  ) {}

  async execute({
    email,
    password,
    device,
    ip,
  }: LoginCredentialUseCaseRequest): Promise<LoginCredentialUseCaseResponse> {
    // 1. useCase - delete all expired sessions
    await this.sessionRepository.deleteExpiredSessions()

    // 2. useCase - check if email already exists in database
    const user = await this.userRepository.getUserByEmail(email)

    if (!user) {
      return {
        status: 404,
        message: 'Usuário não encontrado.',
      }
    }

    // 3. useCase - check if password is correct
    const isPasswordCorrect = await comparePassword(
      password,
      user.password_hash as string,
    )

    if (!isPasswordCorrect) {
      return {
        status: 401,
        message: 'Senha incorreta.',
      }
    }

    // 4. useCase - check if user is two factor enabled
    if (user.two_factor_enabled) {
      // 5. useCase - Generate and send two-factor token
      await generateAndSendTwoFactorToken({
        userId: user.id,
        userEmail: user.email,
        verificationTokenRepository: this.verificationTokenRepository,
        tokenType: 'TWO_FACTOR_VERIFICATION',
      })

      return {
        status: 200,
        message: 'Token de autenticação de dois fatores enviado com sucesso!',
        userId: user.id,
      }
    } else {
      // 5. useCase - check if email was verified
      if (!user.emailVerified) {
        return {
          status: 403,
          message: 'Email não verificado.',
          userId: user.id,
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

      return {
        status: 201,
        message: 'Usuário logado com sucesso!',
        userId: user.id,
      }
    }
  }
}
