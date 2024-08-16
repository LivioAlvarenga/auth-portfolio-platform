import { comparePassword } from '@/lib/bcrypt'
import { SessionRepository } from '@/repositories/session-repository'
import { UserRepository } from '@/repositories/user-repository'
import { cookies } from 'next/headers'

interface LoginGoogleUseCaseRequest {
  device: string
}

interface LoginGoogleUseCaseResponse {
  status: number
  message: string
  userId?: string
}

const DAYS_30_IN_SECONDS = 30 * 24 * 60 * 60
const DAYS_30_IN_MILLISECONDS =
  parseInt(process.env.AUTH_SESSION_MAX_AGES!) * 1000 ||
  DAYS_30_IN_SECONDS * 1000

export class LoginGoogleUseCase {
  constructor(
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository,
  ) {}

  async execute({
    device,
  }: LoginGoogleUseCaseRequest): Promise<LoginGoogleUseCaseResponse> {
    // 1. useCase - delete all expired sessions
    await this.sessionRepository.deleteExpiredSessions()

    // 2. useCase - get account google from database

    // 2. useCase - get session token from cookie authjs.session-token
    const sessionToken = cookies().get('authjs.session-token')

    // 3. useCase - get session from database
    const session = await this.sessionRepository.getSessionByToken(sessionToken)

    const user = await this.userRepository.getUserByEmail(email)

    if (!user) {
      return {
        status: 404,
        message: 'Usuário não encontrado.',
      }
    }

    // 3. useCase - check if email was verified
    if (!user.emailVerified) {
      return {
        status: 403,
        message: 'Email não verificado.',
        userId: user.id,
      }
    }

    // 4. useCase - check if password is correct
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

    // 5. useCase - create session token
    const sessionExpiry = new Date(Date.now() + DAYS_30_IN_MILLISECONDS)

    // 6. useCase - check if exist a session with userId and device, if exist delete the session, if not create a new session
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
    })

    // 7. useCase - set session token cookie
    cookies().set({
      name: 'authjs.session-token', // this the default cookie name used by AuthJs
      value: sessionToken,
      expires: sessionExpiry,
      httpOnly: true,
    })

    return {
      status: 201,
      message: 'Usuário logado com sucesso!',
      userId: user.id,
    }
  }
}
