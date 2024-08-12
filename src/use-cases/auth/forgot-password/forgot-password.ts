import { webserver } from '@/infra/webserver'
import { UserRepository } from '@/repositories/user-repository'
import { VerificationTokenRepository } from '@/repositories/verification-token-repository'
import { sendEmail } from '@/utils/email'
import { addDays } from 'date-fns'
import { v4 } from 'uuid'

interface ForgotPasswordUseCaseRequest {
  email: string
}

interface ForgotPasswordUseCaseResponse {
  status: number
  message: string
  userId?: string
}

export class ForgotPasswordUseCase {
  constructor(
    private userRepository: UserRepository,
    private verificationTokenRepository: VerificationTokenRepository,
  ) {}

  async execute({
    email,
  }: ForgotPasswordUseCaseRequest): Promise<ForgotPasswordUseCaseResponse> {
    // 1. useCase - delete all expired tokens
    await this.verificationTokenRepository.deleteExpiredTokens()

    // 2. useCase - check if email already exists in database
    const user = await this.userRepository.getUserByEmail(email)

    if (!user) {
      return {
        status: 404,
        message: 'Usuário não encontrado.',
      }
    }

    // 3. useCase - create tokens uuid
    const token = v4()
    const expires = addDays(new Date(), 1) // 1 day
    const tokenType = 'RESET_PASSWORD'

    // 4. useCase - check if typeToken and userId already exists in database and update or create token
    const verificationToken =
      await this.verificationTokenRepository.getValidTokenByTypeAndIdentifier(
        user.id,
        tokenType,
      )
    if (verificationToken) {
      await this.verificationTokenRepository.updateToken({
        identifier: user.id,
        token,
        expires,
        tokenType,
      })
    } else {
      await this.verificationTokenRepository.createToken({
        identifier: user.id,
        token,
        expires,
        tokenType,
      })
    }

    // 5. useCase - send email to user with token and url (magic link)
    await sendEmail({
      type: 'PASSWORD_RESET_REQUEST',
      data: {
        name: user.nick_name || user.name || null,
        url: `${webserver.host}/reset-password?token=${user.id}`,
      },
      to: email,
      userId: user.id,
    })

    return {
      status: 201,
      message: 'Token criado com sucesso.',
      userId: user.id,
    }
  }
}
