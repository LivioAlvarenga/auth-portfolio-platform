import { SessionRepository } from '@/repositories/session-repository'
import { UserRepository } from '@/repositories/user-repository'

interface TwoFactorToggleUseCaseRequest {
  userId: string
  sessionToken: string
}

interface TwoFactorToggleUseCaseResponse {
  status: number
  message: string
  userId?: string
}

export class TwoFactorToggleUseCase {
  constructor(
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository,
  ) {}

  async execute({
    userId,
    sessionToken,
  }: TwoFactorToggleUseCaseRequest): Promise<TwoFactorToggleUseCaseResponse> {
    // 1. useCase - check if user already exists in database
    const user = await this.userRepository.getUserById(userId)

    if (!user) {
      return {
        status: 404,
        message: 'Usuário não encontrado.',
      }
    }

    // 2. useCase - check if session exists
    const session = await this.sessionRepository.getSessionByToken(sessionToken)

    if (!session || session.userId !== user.id) {
      return {
        status: 404,
        message: 'Sessão não encontrada.',
      }
    }

    // 3. useCase - toggle two factor authentication
    await this.userRepository.updateUser(user.id, {
      two_factor_enabled: !user.two_factor_enabled,
    })

    return {
      status: 201,
      message: 'Toggle de autenticação de dois fatores realizado com sucesso.',
      userId: user.id,
    }
  }
}
