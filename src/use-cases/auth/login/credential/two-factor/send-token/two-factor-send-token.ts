import { webserver } from '@/infra/webserver'
import { UserRepository } from '@/repositories/user-repository'
import { VerificationTokenRepository } from '@/repositories/verification-token-repository'
import { sendEmail } from '@/utils/email'
import { generateOTP } from '@/utils/password'
import { addMinutes } from 'date-fns'
import { v4 } from 'uuid'

interface TwoFactorSendTokenUseCaseRequest {
  userId: string
}

interface TwoFactorSendTokenUseCaseResponse {
  status: number
  message: string
  userId?: string
}

export class TwoFactorSendTokenUseCase {
  constructor(
    private userRepository: UserRepository,
    private verificationTokenRepository: VerificationTokenRepository,
  ) {}

  async execute({
    userId,
  }: TwoFactorSendTokenUseCaseRequest): Promise<TwoFactorSendTokenUseCaseResponse> {
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

    // 3. useCase - Generate and send two-factor token
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
  }
}

interface GenerateAndSendTokenParams {
  userId: string
  userEmail: string
  verificationTokenRepository: VerificationTokenRepository
  tokenType: string
}

export async function generateAndSendTwoFactorToken({
  userId,
  userEmail,
  verificationTokenRepository,
  tokenType,
}: GenerateAndSendTokenParams): Promise<void> {
  // 1. Generate tokens UUID / OTP
  const token = v4()
  const opt = generateOTP()
  const expires = addMinutes(new Date(), 10) // 10 minutes

  // 2. Check if the token type and userId already exist in the database, update or create a new token
  const verificationToken =
    await verificationTokenRepository.getValidTokenByTypeAndIdentifier(
      userId,
      tokenType,
    )

  if (verificationToken) {
    await verificationTokenRepository.updateToken({
      identifier: userId,
      token,
      expires,
      opt,
      tokenType,
    })
  } else {
    await verificationTokenRepository.createToken({
      identifier: userId,
      token,
      expires,
      opt,
      tokenType,
    })
  }

  // 3. Send email to the user with the two-factor token
  await sendEmail({
    type: 'VERIFICATION_EMAIL_TWO_FACTOR',
    data: {
      opt,
      url: `${webserver.host}/verify-two-factor-opt?token=${userId}`,
    },
    to: userEmail,
    userId,
  })
}
