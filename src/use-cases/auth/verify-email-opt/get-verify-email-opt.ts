import { UserRepository } from '@/repositories/user-repository'
import { VerificationTokenRepository } from '@/repositories/verification-token-repository'
import { calculateProfileCompletionScore } from '@/use-cases/utils/profile-completion-fields'

interface GetVerifyEmailOptUseCaseRequest {
  userId: string
  opt: string
}

interface GetVerifyEmailOptUseCaseResponse {
  status: number
  message: string
  userId?: string
}

export class GetVerifyEmailOptUseCase {
  constructor(
    private userRepository: UserRepository,
    private verificationTokenRepository: VerificationTokenRepository,
  ) {}

  async execute({
    userId,
    opt,
  }: GetVerifyEmailOptUseCaseRequest): Promise<GetVerifyEmailOptUseCaseResponse> {
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
    const tokenType = 'EMAIL_VERIFICATION'
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

    // 6. useCase - compare opt sent by user with opt in database
    if (token.opt !== opt) {
      return {
        status: 400,
        message: 'Token inválido.',
      }
    }

    // 7. useCase - update user emailVerified with date
    const userUpdate = await this.userRepository.updateUser(user.id, {
      emailVerified: new Date(),
      email_verified_provider: 'credential',
    })

    // 8. useCase - Calculate the profile_completion_score
    const userData = await this.userRepository.getUserById(user.id)
    if (userData) {
      const profileCompletionScore = calculateProfileCompletionScore(userData)

      await this.userRepository.updateProfileCompletionScore(
        user.id,
        profileCompletionScore,
      )
    }

    // 9. useCase - delete token
    if (userUpdate) {
      await this.verificationTokenRepository.deleteToken(
        token.identifier,
        token.token,
      )
    }

    return {
      status: 201,
      message: 'Email verificado com sucesso!',
      userId: user.id,
    }
  }
}
