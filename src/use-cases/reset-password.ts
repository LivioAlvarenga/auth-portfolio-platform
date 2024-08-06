import { hashPassword } from '@/lib/bcrypt'
import { UserRepository } from '@/repositories/user-repository'
import { VerificationTokenRepository } from '@/repositories/verification-token-repository'

interface ResetPasswordUseCaseRequest {
  email: string
  token: string
  password: string
}

interface ResetPasswordUseCaseResponse {
  status: number
  message: string
  userId?: string
}

export class ResetPasswordUseCase {
  constructor(
    private userRepository: UserRepository,
    private verificationTokenRepository: VerificationTokenRepository,
  ) {}

  async execute({
    email,
    token,
    password,
  }: ResetPasswordUseCaseRequest): Promise<ResetPasswordUseCaseResponse> {
    // 1. useCase - check if token exists in database
    const tokenExistsInDatabase =
      await this.verificationTokenRepository.getValidToken(email, token)

    if (!tokenExistsInDatabase) {
      return {
        status: 404,
        message: 'Token inválido ou expirado.',
      }
    }

    // 2. useCase - hash password before saving
    const hashedPassword = await hashPassword(password!)

    // 3. useCase - update password in database
    const passwordUpdated = await this.userRepository.updatePassword(
      email,
      hashedPassword,
    )

    if (!passwordUpdated) {
      return {
        status: 500,
        message: 'Erro ao atualizar a senha.',
      }
    }

    // 4. useCase - delete token from database
    await this.verificationTokenRepository.deleteToken(email, token)

    return {
      status: 201,
      message: 'Senha atualizada com sucesso.',
      userId: passwordUpdated.userId,
    }
  }
}
