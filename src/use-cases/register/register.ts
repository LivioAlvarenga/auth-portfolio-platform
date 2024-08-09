import { webserver } from '@/infra/webserver'
import { hashPassword } from '@/lib/bcrypt'
import { AccountRepository } from '@/repositories/account-repository'
import { UserRepository } from '@/repositories/user-repository'
import { VerificationTokenRepository } from '@/repositories/verification-token-repository'
import { sendEmail } from '@/utils/email'
import { generateOTP } from '@/utils/password'
import { addDays } from 'date-fns'
import { v4 } from 'uuid'

interface RegisterUseCaseRequest {
  name?: string
  nick_name?: string
  email: string
  password?: string
}

interface RegisterUseCaseResponse {
  status: number
  message: string
  userId?: string
}

export class RegisterUseCase {
  constructor(
    private userRepository: UserRepository,
    private accountRepository: AccountRepository,
    private verificationTokenRepository: VerificationTokenRepository,
  ) {}

  async execute({
    name,
    nick_name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    // 1. useCase - check if email is already in use and already credential provider
    const userAlreadyExists = await this.userRepository.getUserByEmail(email)

    let providers: string[] = []
    if (userAlreadyExists) {
      providers = await this.accountRepository.getProvidersByUserId(
        userAlreadyExists.id,
      )
    }

    if (userAlreadyExists && providers.includes('credential')) {
      return {
        status: 400,
        message: 'E-mail já cadastrado.',
      }
    }

    // 2. useCase - hash password before saving
    let password_hash: string | undefined
    if (password) {
      password_hash = await hashPassword(password)
    }

    // 3. useCase - save user to database with minimal data (name, email, password_hash)
    if (!name || !email || !password_hash) {
      return {
        status: 400,
        message: 'Dados insuficientes para o cadastro.',
      }
    }

    // 4. useCase - insert user to database if user does not exist Or update user if user exists (if user start with provider !== credential)
    let user
    if (userAlreadyExists) {
      user = await this.userRepository.updateUser(userAlreadyExists.id, {
        name,
        nick_name,
        password_hash,
      })
    } else {
      user = await this.userRepository.createUser({
        name,
        nick_name,
        email,
        password_hash,
      })
    }

    // 5. useCase - Create account for user with provider credential in accounts table
    await this.accountRepository.createAccount({
      userId: user.id,
      type: 'credential',
      provider: 'credential',
      providerAccountId: user.id,
    })

    // TODO: mover do caso de uso 6 em diante para rota api/v1/verify-email
    // 6. useCase - create token to verify email if email is not verified
    if (!user.emailVerified) {
      // 7. useCase - create tokens uuid / OPT
      const token = v4()
      const opt = generateOTP()
      const expires = addDays(new Date(), 1) // 1 day
      const tokenType = 'EMAIL_VERIFICATION'

      // 8. useCase - check if typeToken and userId already exists in database and update or create token
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

      // 9. useCase - send email to user with token
      await sendEmail({
        type: 'VERIFICATION_EMAIL_WITH_OTP',
        data: {
          opt,
          url: `${webserver.host}/verify-email-opt?token=${user.id}`,
        },
        to: email,
        userId: user.id,
      })
    }

    return {
      status: 201,
      message: 'Usuário criado com sucesso!',
      userId: user.id,
    }
  }
}
