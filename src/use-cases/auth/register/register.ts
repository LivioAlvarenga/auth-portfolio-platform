import { hashPassword } from '@/lib/bcrypt'
import { AccountRepository } from '@/repositories/account-repository'
import { UserRepository } from '@/repositories/user-repository'
import { calculateProfileCompletionScore } from '@/use-cases/utils/profile-completion-fields'
import { sendEmail } from '@/utils/email'

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
  emailVerified?: boolean
}

export class RegisterUseCase {
  constructor(
    private userRepository: UserRepository,
    private accountRepository: AccountRepository,
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
        userId: userAlreadyExists.id,
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

    // 5. useCase - Calculate the profile_completion_score
    const userData = await this.userRepository.getUserById(user.id)
    if (userData) {
      const profileCompletionScore = calculateProfileCompletionScore(userData)

      await this.userRepository.updateProfileCompletionScore(
        user.id,
        profileCompletionScore,
      )
    }

    // 6. useCase - Create account for user with provider credential in accounts table
    await this.accountRepository.createAccount({
      userId: user.id,
      type: 'credential',
      provider: 'credential',
      providerAccountId: user.id,
    })

    // 7. useCase - send email USER_REGISTRATION_WELCOME
    await sendEmail({
      type: 'USER_REGISTRATION_WELCOME',
      data: {
        name: user.nick_name || user.name,
      },
      to: user.email,
      userId: user.id,
    })

    return {
      status: 201,
      message: 'Usuário criado com sucesso!',
      userId: user.id,
      emailVerified: Boolean(user.emailVerified),
    }
  }
}
