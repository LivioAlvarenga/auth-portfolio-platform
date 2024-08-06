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
  VerificationEmailWithOptProps,
  VerificationEmailWithOptTemplate,
} from '../emails/VerificationEmailWithOpt'
// Importe outros templates de e-mail conforme necessário

export interface EmailDataMap {
  USER_REGISTRATION_WELCOME: UserRegistrationWelcomeProps
  VERIFICATION_EMAIL_WITH_OTP: VerificationEmailWithOptProps
  PASSWORD_RESET_REQUEST: PasswordResetRequestProps
  PASSWORD_RESET_CONFIRMATION: PasswordResetConfirmationProps
  // Adicione outros mapeamentos conforme necessário
}

export type EmailType = keyof EmailDataMap

interface EmailTemplate<T> {
  subject: string
  // eslint-disable-next-line no-unused-vars
  render: (data: T) => { html: string; text: string }
}

type EmailTemplates = {
  [K in EmailType]: EmailTemplate<EmailDataMap[K]>
}

const emailTemplates: EmailTemplates = {
  USER_REGISTRATION_WELCOME: UserRegistrationWelcomeTemplate,
  VERIFICATION_EMAIL_WITH_OTP: VerificationEmailWithOptTemplate,
  PASSWORD_RESET_REQUEST: PasswordResetRequestTemplate,
  PASSWORD_RESET_CONFIRMATION: PasswordResetConfirmationTemplate,
  // Adicione outros templates aqui
}

export default emailTemplates
