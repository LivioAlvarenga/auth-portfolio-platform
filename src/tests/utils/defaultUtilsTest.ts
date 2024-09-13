import { hashPassword } from '@/lib/bcrypt'
import { Account } from '@/repositories/account-repository'
import { PgAccountRepository } from '@/repositories/pg/pg-account-repository'
import { PgSessionRepository } from '@/repositories/pg/pg-session-repository'
import { PgUserRepository } from '@/repositories/pg/pg-user-repository'
import { PgVerificationTokenRepository } from '@/repositories/pg/pg-verification-token-repository'
import { Session } from '@/repositories/session-repository'
import { User } from '@/repositories/user-repository'
import { VerificationToken } from '@/repositories/verification-token-repository'
import { calculateProfileCompletionScore } from '@/use-cases/utils/profile-completion-fields'
import { generateOTP } from '@/utils/password'
import { addDays, addMinutes } from 'date-fns'
import { v4 } from 'uuid'

const userRepository = new PgUserRepository()
const verificationTokenRepository = new PgVerificationTokenRepository()
const accountRepository = new PgAccountRepository()
const sessionRepository = new PgSessionRepository()

const DAYS_30_IN_SECONDS = 30 * 24 * 60 * 60
const DAYS_30_IN_MILLISECONDS =
  parseInt(process.env.AUTH_SESSION_MAX_AGES!) * 1000 ||
  DAYS_30_IN_SECONDS * 1000

const createDefaultUser = async (): Promise<User> => {
  const user = {
    email: 'testuser1@example.com',
    password_hash: await hashPassword('Password123$%$'),
    name: 'Test User',
  }
  return userRepository.createUser(user)
}

const createDefaultUserTwoFactor = async (): Promise<User> => {
  const user = {
    email: 'testuser1@example.com',
    password_hash: await hashPassword('Password123$%$'),
    name: 'Test User',
    two_factor_enabled: true,
  }
  return userRepository.createUser(user)
}

const createDefaultUserWithLocationConsent = async (): Promise<User> => {
  const user = {
    email: 'testuser1@example.com',
    password_hash: await hashPassword('Password123$%$'),
    name: 'Test User',
    emailVerified: new Date(),
    location_collection_consent: true,
  }
  return userRepository.createUser(user)
}

const createDefaultUserEmailVerified = async (): Promise<User> => {
  const user = {
    email: 'testuser2@example.com',
    password_hash: await hashPassword('Password123$%$'),
    name: 'Test User',
    emailVerified: new Date(),
  }
  return await userRepository.createUser(user)
}

const createDefaultUserWithSession = async (): Promise<{
  user: User
  session: Session
  password: string
}> => {
  const password = 'Password123$%$'
  const device = 'device'
  const token = v4()
  const sessionExpiry = new Date(Date.now() + DAYS_30_IN_MILLISECONDS)

  const userData = {
    email: 'testuser2@example.com',
    password_hash: await hashPassword(password),
    name: 'Test User',
    emailVerified: new Date(),
  }

  const user = await userRepository.createUser(userData)

  await accountRepository.createAccount({
    userId: user.id,
    type: 'credential',
    provider: 'credential',
    providerAccountId: user.id,
  })

  const session = await sessionRepository.createSession({
    userId: user.id,
    expires: sessionExpiry,
    sessionToken: token,
    device_identifier: device,
  })

  return {
    user,
    session,
    password,
  }
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

const createDefaultTokenWithTwoFactorOpt = async ({
  emailVerified = false,
  two_factor_enabled = true,
}): Promise<{
  token: VerificationToken
  user: User
}> => {
  const userOptions = {
    email: 'testuser1@example.com',
    password_hash: await hashPassword('Password123$%$'),
    name: 'Test User',
    two_factor_enabled,
    emailVerified: emailVerified ? new Date() : undefined,
    email_verified_provider: emailVerified ? 'credential' : undefined,
  }
  const user = await userRepository.createUser(userOptions)

  const tokenOptions = {
    identifier: user.id,
    token: v4(),
    expires: addMinutes(new Date(), 10),
    tokenType: 'TWO_FACTOR_VERIFICATION',
    opt: generateOTP(),
  }
  const token = await verificationTokenRepository.createToken(tokenOptions)

  return {
    token,
    user,
  }
}

const createDefaultUserWithMagicLink = async (): Promise<{
  user: Omit<User, 'passwordHash'>
  account: Account
  token: VerificationToken
}> => {
  const user = await userRepository.createUser({
    email: 'testuser1@example.com',
  })

  const profileCompletionScore = calculateProfileCompletionScore(user)
  await userRepository.updateProfileCompletionScore(
    user.id,
    profileCompletionScore,
  )

  const account = await accountRepository.createAccount({
    userId: user.id,
    type: 'magic-link',
    provider: 'magic-link',
    providerAccountId: user.id,
  })

  const token = await verificationTokenRepository.createToken({
    identifier: user.id,
    token: v4(),
    expires: addDays(new Date(), 1),
    tokenType: 'LOGIN_MAGIC_LINK',
  })

  return {
    user,
    account,
    token,
  }
}

const createDefaultUserWithAccount = async (
  provider: string = 'credential',
): Promise<User> => {
  const user = {
    email: 'testuser3@example.com',
    passwordHash: await hashPassword('Password123$%$'),
    name: 'Test User',
  }

  const createdUser = await userRepository.createUser(user)

  await accountRepository.createAccount({
    userId: createdUser.id,
    type: provider,
    provider,
    providerAccountId: createdUser.id,
  })

  return { ...createdUser }
}

const createDefaultUserWithAccountGoggle = async (): Promise<User> => {
  const user = {
    email: 'testuser4@example.com',
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

const createDefaultUserWithGoogleAccountFromAuthJs = async ({
  email_verified = true,
  picture = 'https://adm.com.br',
}): Promise<{
  user: User
  account: Account
  session: Session
  cookie: string
}> => {
  const user = {
    email: 'testuser4@example.com',
    name: 'Google User',
    emailVerified: undefined,
    image: undefined,
  }
  const createdUser = await userRepository.createUser(user)

  const createdAccount = await accountRepository.createAccount({
    userId: createdUser.id,
    type: 'oidc',
    provider: 'google',
    providerAccountId: createdUser.id,
  })

  const sessionToken = v4()

  const createdSession = await sessionRepository.createSession({
    userId: createdUser.id,
    expires: addDays(new Date(), 1),
    sessionToken,
    device_identifier: undefined,
  })

  const cookieSession = `authjs.session-token=${sessionToken}; Path=/; SameSite=Lax; HttpOnly; Secure`
  const cookieEmailVerified = `authjs.google-email-verified=${{ email_verified }}; Path=/; SameSite=Lax; HttpOnly; Secure`
  const cookiePicture = `authjs.google-picture=${picture}; Path=/; SameSite=Lax; HttpOnly; Secure`

  const combinedCookies = `${cookieSession}; ${cookieEmailVerified}; ${cookiePicture}`

  return {
    user: createdUser,
    account: createdAccount,
    session: createdSession,
    cookie: combinedCookies,
  }
}

export const utilsTest = {
  createDefaultUser,
  createDefaultUserTwoFactor,
  createDefaultUserWithLocationConsent,
  createDefaultResetPasswordToken,
  createDefaultUserWithAccount,
  createDefaultUserWithAccountGoggle,
  createDefaultTokenWithOpt,
  createDefaultTokenWithTwoFactorOpt,
  createDefaultUserEmailVerified,
  createDefaultUserWithSession,
  createDefaultUserWithGoogleAccountFromAuthJs,
  createDefaultUserWithMagicLink,
}
