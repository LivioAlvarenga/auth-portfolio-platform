import { hashPassword } from '@/lib/bcrypt'
import { UserRepository } from '@/repositories/user-repository'
import { VerificationTokenRepository } from '@/repositories/verification-token-repository'
import { sendEmail } from '@/utils/email'

interface ResetPasswordUseCaseRequest {
  identifier: string
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
    identifier,
    password,
  }: ResetPasswordUseCaseRequest): Promise<ResetPasswordUseCaseResponse> {
    // 1. useCase - check if user already exists in database
    const user = await this.userRepository.getUserById(identifier)

    if (!user) {
      return {
        status: 404,
        message: 'Usuário não encontrado.',
      }
    }

    // 2. useCase - check if token exists in database
    const tokenExistsInDatabase =
      await this.verificationTokenRepository.getValidTokenByTypeAndIdentifier(
        identifier,
        'RESET_PASSWORD',
      )

    if (!tokenExistsInDatabase) {
      return {
        status: 404,
        message: 'Token inválido ou expirado.',
      }
    }

    // 3. useCase - hash password before saving
    const hashedPassword = await hashPassword(password)

    // 4. useCase - update password in database
    const passwordUpdated = await this.userRepository.updatePassword(
      identifier,
      hashedPassword,
    )

    if (!passwordUpdated) {
      return {
        status: 500,
        message: 'Erro ao atualizar a senha.',
      }
    }

    // 5. useCase - update email as verified if not already
    if (!user.emailVerified) {
      await this.userRepository.updateUser(identifier, {
        emailVerified: new Date(),
        email_verified_provider: 'credential',
      })
    }

    // 6. useCase - delete token from database
    await this.verificationTokenRepository.deleteToken(
      identifier,
      tokenExistsInDatabase.token,
    )

    // 7. useCase - send email to user with password reset confirmation
    await sendEmail({
      type: 'PASSWORD_RESET_CONFIRMATION',
      data: {},
      to: user.email,
      userId: user.id,
    })

    return {
      status: 201,
      message: 'Senha atualizada com sucesso.',
      userId: user.id,
    }
  }
}
