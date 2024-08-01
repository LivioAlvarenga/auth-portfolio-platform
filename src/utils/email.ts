import { EmailDataMap, EmailType } from '@/lib/react-mail/templates'
import { getBaseUrl } from './url'

interface sendEmailProps<T extends EmailType> {
  type: T
  data: EmailDataMap[T]
  to: string
  cc?: string
  bcc?: string
  userId: string
}

export async function sendEmail<T extends EmailType>({
  type,
  data,
  to,
  cc,
  bcc,
  userId,
}: sendEmailProps<T>) {
  const baseUrl = getBaseUrl()

  const responseEmail = await fetch(`${baseUrl}/api/v1/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type,
      data,
      to,
      cc,
      bcc,
      userId,
    }),
  })

  return responseEmail
}
