import { hashPassword } from '@/lib/bcrypt'
import { PgAccountRepository } from '@/repositories/pg/pg-account-repository'
import { PgUserRepository } from '@/repositories/pg/pg-user-repository'
import { PgVerificationTokenRepository } from '@/repositories/pg/pg-verification-token-repository'
import { User } from '@/repositories/user-repository'
import { VerificationToken } from '@/repositories/verification-token-repository'
import { addDays } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'

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

const createDefaultUserWithAccount = async (): Promise<User> => {
  const user = {
    email: 'testuser@example.com',
    passwordHash: await hashPassword('Password123$%$'),
    name: 'Test User',
  }

  const createdUser = await userRepository.createUser(user)

  const createdAccount = await accountRepository.createAccount({
    userId: createdUser.id,
    type: 'credential',
    provider: 'credential',
    providerAccountId: createdUser.id,
  })

  return { ...createdUser }
}

const createDefaultResetPasswordToken =
  async (): Promise<VerificationToken> => {
    const user = await createDefaultUser()
    const token = {
      identifier: user.email,
      token: uuidv4(),
      tokenType: 'RESET_PASSWORD',
      expires: addDays(new Date(), 1),
    }
    return verificationTokenRepository.createToken(token)
  }

export const utilsTest = {
  createDefaultUser,
  createDefaultResetPasswordToken,
  createDefaultUserWithAccount,
}
