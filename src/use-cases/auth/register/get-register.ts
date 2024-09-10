import { UserRepository } from '@/repositories/user-repository'

interface GetRegisterUseCaseRequest {
  userId: string
}

interface GetRegisterUseCaseResponse {
  status: number
  message: string
  user?: {
    id: string
    email: string
    name?: string
    emailVerified?: string
    two_factor_enabled?: boolean
  }
}

export class GetRegisterUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userId,
  }: GetRegisterUseCaseRequest): Promise<GetRegisterUseCaseResponse> {
    // 1. useCase - check if user exists
    const userAlreadyExists = await this.userRepository.getUserById(userId)

    if (!userAlreadyExists) {
      return {
        status: 404,
        message: 'Usuário não encontrado.',
      }
    }

    return {
      status: 201,
      message: 'Usuário encontrado.',
      user: {
        id: userAlreadyExists.id,
        email: userAlreadyExists.email,
        name: userAlreadyExists.nick_name || userAlreadyExists.name,
        emailVerified: userAlreadyExists.emailVerified,
        two_factor_enabled: userAlreadyExists.two_factor_enabled,
      },
    }
  }
}
