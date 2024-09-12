import { SessionRepository } from '@/repositories/session-repository'
import { UserRepository } from '@/repositories/user-repository'

interface UpdateLocationConsentUseCaseRequest {
  userId: string
  sessionToken: string
}

interface UpdateLocationConsentUseCaseResponse {
  status: number
  message: string
  userId?: string
}

export class UpdateLocationConsentUseCase {
  constructor(
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository,
  ) {}

  async execute({
    userId,
    sessionToken,
  }: UpdateLocationConsentUseCaseRequest): Promise<UpdateLocationConsentUseCaseResponse> {
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
      location_collection_consent: !user.location_collection_consent,
      location_consent_given_at: new Date(),
    })

    return {
      status: 201,
      message: 'Toggle de coleta de localização e IP realizado com sucesso.',
      userId: user.id,
    }
  }
}
