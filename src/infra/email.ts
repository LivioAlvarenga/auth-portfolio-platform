import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

interface EmailData {
  to: string
  cc?: string
  bcc?: string
  text?: string
  subject: string
  html: string
  attachments?: Array<{
    filename: string
    content: string
    encoding?: string
  }>
}

interface EmailSendResult {
  status: 'SUCCESS' | 'FAILURE'
  errorMessage?: string
  response?: SMTPTransport.SentMessageInfo
}

export const createEmailTransporter = () => {
  const host = process.env.EMAIL_HOST_SMTP
  const port = Number(process.env.EMAIL_HOST_PORT)
  const user = process.env.EMAIL_HOST_USER
  const pass = process.env.EMAIL_HOST_PASSWORD

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // Nota: this is true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  })

  return transporter
}

export const sendMail = async ({
  to,
  cc,
  bcc,
  text,
  subject,
  html,
  attachments,
}: EmailData): Promise<EmailSendResult> => {
  const transporter = createEmailTransporter()

  const mailOptions = {
    from: process.env.EMAIL_HOST_USER,
    to,
    cc,
    bcc,
    text,
    subject,
    html,
    attachments: attachments?.map((attachment) => ({
      filename: attachment.filename,
      content: attachment.content,
      encoding: attachment.encoding || 'base64',
    })),
  }

  try {
    const info = await transporter.sendMail(mailOptions)

    return {
      status: 'SUCCESS',
      response: info,
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        status: 'FAILURE',
        errorMessage: error.message,
      }
    }

    return {
      status: 'FAILURE',
      errorMessage: 'Ocorreu um erro desconhecido durante o envio do e-mail',
    }
  }
}
