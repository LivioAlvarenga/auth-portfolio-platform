import { webserver } from '@/infra/webserver'
import { AccountRepository } from '@/repositories/account-repository'
import { UserRepository } from '@/repositories/user-repository'
import { VerificationTokenRepository } from '@/repositories/verification-token-repository'
import { calculateProfileCompletionScore } from '@/use-cases/utils/profile-completion-fields'
import { sendEmail } from '@/utils/email'
import { addDays } from 'date-fns'
import { v4 } from 'uuid'

interface RequestMagicLinkUseCaseRequest {
  email: string
}

interface RequestMagicLinkUseCaseResponse {
  status: number
  message: string
  userId?: string
}

export class RequestMagicLinkUseCase {
  constructor(
    private userRepository: UserRepository,
    private accountRepository: AccountRepository,
    private verificationTokenRepository: VerificationTokenRepository,
  ) {}

  async execute({
    email,
  }: RequestMagicLinkUseCaseRequest): Promise<RequestMagicLinkUseCaseResponse> {
    // 1. useCase - delete all expired tokens
    await this.verificationTokenRepository.deleteExpiredTokens()

    // 2. useCase - check if user exists, if not register user
    let user = await this.userRepository.getUserByEmail(email)
    if (!user) {
      user = await this.userRepository.createUser({
        email,
      })
    }

    // 3. useCase - check if user account exists, if not register account
    const providers = await this.accountRepository.getProvidersByUserId(user.id)
    if (!providers.includes('magic-link')) {
      await this.accountRepository.createAccount({
        userId: user.id,
        type: 'magic-link',
        provider: 'magic-link',
        providerAccountId: user.id,
      })
    }

    // 4. useCase - Calculate the profile_completion_score
    const userData = await this.userRepository.getUserById(user.id)
    if (userData) {
      const profileCompletionScore = calculateProfileCompletionScore(userData)

      await this.userRepository.updateProfileCompletionScore(
        user.id,
        profileCompletionScore,
      )
    }

    // 5. useCase - create tokens uuid
    const token = v4()
    const expires = addDays(new Date(), 1) // 1 day
    const tokenType = 'LOGIN_MAGIC_LINK'

    // 6. useCase - check if typeToken and userId already exists in database and update or create token
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

    // 7. useCase - send email to user with token
    await sendEmail({
      type: 'LOGIN_MAGIC_LINK',
      data: {
        url: `${webserver.host}/login/magic-link?token=${token}`,
      },
      to: user.email,
      userId: user.id,
    })

    return {
      status: 201,
      message: 'E-mail enviado com sucesso.',
      userId: user.id,
    }
  }
}
