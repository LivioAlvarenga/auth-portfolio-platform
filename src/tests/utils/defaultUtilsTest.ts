import { hashPassword } from '@/lib/bcrypt'
import { PgAccountRepository } from '@/repositories/pg/pg-account-repository'
import { PgUserRepository } from '@/repositories/pg/pg-user-repository'
import { PgVerificationTokenRepository } from '@/repositories/pg/pg-verification-token-repository'
import { User } from '@/repositories/user-repository'
import { VerificationToken } from '@/repositories/verification-token-repository'
import { generateOTP } from '@/utils/password'
import { addDays } from 'date-fns'
import { v4 } from 'uuid'

const userRepository = new PgUserRepository()
const verificationTokenRepository = new PgVerificationTokenRepository()
const accountRepository = new PgAccountRepository()

const createDefaultUser = async (): Promise<User> => {
  const user = {
    email: 'testuser@example.com',
    passwordHash: await hashPassword('Password123$%$'),
    name: 'Test User',
  }
  return userRepository.createUser(user)
}

const createDefaultUserEmailVerified = async (): Promise<User> => {
  const user = {
    email: 'testuser@example.com',
    passwordHash: await hashPassword('Password123$%$'),
    name: 'Test User',
    emailVerified: new Date(),
  }
  return userRepository.createUser(user)
}

const createDefaultTokenWithOpt = async (): Promise<VerificationToken> => {
  const user = await createDefaultUser()
  const token = {
    identifier: user.id,
    token: v4(),
    expires: addDays(new Date(), 1),
    tokenType: 'EMAIL_VERIFICATION',
    opt: generateOTP(),
  }
  return verificationTokenRepository.createToken(token)
}

const createDefaultUserWithAccount = async (): Promise<User> => {
  const user = {
    email: 'testuser@example.com',
    passwordHash: await hashPassword('Password123$%$'),
    name: 'Test User',
  }

  const createdUser = await userRepository.createUser(user)

  await accountRepository.createAccount({
    userId: createdUser.id,
    type: 'credential',
    provider: 'credential',
    providerAccountId: createdUser.id,
  })

  return { ...createdUser }
}

const createDefaultUserWithAccountGoggle = async (): Promise<User> => {
  const user = {
    email: 'testuser@example.com',
    name: 'Google User',
    emailVerified: new Date(),
    email_verified_provider: 'google',
    image: 'https://lh3.googleusercontent.com/a-/AOh14Gj3',
  }

  const createdUser = await userRepository.createUser(user)

  await accountRepository.createAccount({
    userId: createdUser.id,
    type: 'oidc',
    provider: 'google',
    providerAccountId: createdUser.id,
  })

  return { ...createdUser }
}

const createDefaultResetPasswordToken =
  async (): Promise<VerificationToken> => {
    const user = await createDefaultUser()
    const token = {
      identifier: user.id,
      token: v4(),
      tokenType: 'RESET_PASSWORD',
      expires: addDays(new Date(), 1),
    }
    return verificationTokenRepository.createToken(token)
  }

export const utilsTest = {
  createDefaultUser,
  createDefaultResetPasswordToken,
  createDefaultUserWithAccount,
  createDefaultUserWithAccountGoggle,
  createDefaultTokenWithOpt,
  createDefaultUserEmailVerified,
}
