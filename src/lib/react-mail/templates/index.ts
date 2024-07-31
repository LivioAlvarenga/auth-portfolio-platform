import {
  UserRegistrationWelcomeProps,
  UserRegistrationWelcomeTemplate,
} from '../emails/UserRegistrationWelcome'
// Importe outros templates de e-mail conforme necessário

export interface EmailDataMap {
  USER_REGISTRATION_WELCOME: UserRegistrationWelcomeProps
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
  // Adicione outros templates aqui
}

export default emailTemplates
