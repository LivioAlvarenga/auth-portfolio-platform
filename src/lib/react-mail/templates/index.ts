import {
  LoginMagicLinkProps,
  LoginMagicLinkTemplate,
} from '../emails/LoginMagicLink'
import {
  PasswordResetConfirmationProps,
  PasswordResetConfirmationTemplate,
} from '../emails/PasswordResetConfirmation'
import {
  PasswordResetRequestProps,
  PasswordResetRequestTemplate,
} from '../emails/PasswordResetRequest'
import {
  UserRegistrationWelcomeProps,
  UserRegistrationWelcomeTemplate,
} from '../emails/UserRegistrationWelcome'
import {
  VerificationEmailTwoFactorProps,
  VerificationEmailTwoFactorTemplate,
} from '../emails/VerificationEmailTwoFactor'
import {
  VerificationEmailWithOptProps,
  VerificationEmailWithOptTemplate,
} from '../emails/VerificationEmailWithOpt'

export interface EmailDataMap {
  USER_REGISTRATION_WELCOME: UserRegistrationWelcomeProps
  VERIFICATION_EMAIL_WITH_OTP: VerificationEmailWithOptProps
  PASSWORD_RESET_REQUEST: PasswordResetRequestProps
  PASSWORD_RESET_CONFIRMATION: PasswordResetConfirmationProps
  LOGIN_MAGIC_LINK: LoginMagicLinkProps
  VERIFICATION_EMAIL_TWO_FACTOR: VerificationEmailTwoFactorProps
  // Add other email data types as needed
}

export type EmailType = keyof EmailDataMap

interface EmailTemplate<T> {
  subject: string
  // eslint-disable-next-line no-unused-vars
  render: (data: T) => Promise<{ html: string; text: string }>
}

type EmailTemplates = {
  [K in EmailType]: EmailTemplate<EmailDataMap[K]>
}

const emailTemplates: EmailTemplates = {
  USER_REGISTRATION_WELCOME: UserRegistrationWelcomeTemplate,
  VERIFICATION_EMAIL_WITH_OTP: VerificationEmailWithOptTemplate,
  PASSWORD_RESET_REQUEST: PasswordResetRequestTemplate,
  PASSWORD_RESET_CONFIRMATION: PasswordResetConfirmationTemplate,
  LOGIN_MAGIC_LINK: LoginMagicLinkTemplate,
  VERIFICATION_EMAIL_TWO_FACTOR: VerificationEmailTwoFactorTemplate,
  // Add other email templates as needed
}

export default emailTemplates
