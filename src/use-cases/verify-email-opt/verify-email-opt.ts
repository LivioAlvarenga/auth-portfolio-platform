import { webserver } from '@/infra/webserver'
import { UserRepository } from '@/repositories/user-repository'
import { VerificationTokenRepository } from '@/repositories/verification-token-repository'
import { sendEmail } from '@/utils/email'
import { generateOTP } from '@/utils/password'
import { addDays } from 'date-fns'
import { v4 } from 'uuid'

interface VerifyEmailOptUseCaseRequest {
  userId: string
}

interface VerifyEmailOptUseCaseResponse {
  status: number
  message: string
  userId?: string
}

export class VerifyEmailOptUseCase {
  constructor(
    private userRepository: UserRepository,
    private verificationTokenRepository: VerificationTokenRepository,
  ) {}

  async execute({
    userId,
  }: VerifyEmailOptUseCaseRequest): Promise<VerifyEmailOptUseCaseResponse> {
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

    // 3. useCase - check if user email is verified
    if (user.emailVerified) {
      return {
        status: 200,
        message: 'Email já verificado.',
      }
    }

    // 4. useCase - create tokens uuid / OPT
    const token = v4()
    const opt = generateOTP()
    const expires = addDays(new Date(), 1) // 1 day
    const tokenType = 'EMAIL_VERIFICATION'

    // 5. useCase - check if typeToken and userId already exists in database and update or create token
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
        opt,
        tokenType,
      })
    } else {
      await this.verificationTokenRepository.createToken({
        identifier: user.id,
        token,
        expires,
        opt,
        tokenType,
      })
    }

    // 6. useCase - send email to user with token
    await sendEmail({
      type: 'VERIFICATION_EMAIL_WITH_OTP',
      data: {
        opt,
        url: `${webserver.host}/verify-email-opt?token=${user.id}`,
      },
      to: user.email,
      userId: user.id,
    })

    return {
      status: 201,
      message: 'Token de verificação enviado com sucesso!',
      userId: user.id,
    }
  }
}
