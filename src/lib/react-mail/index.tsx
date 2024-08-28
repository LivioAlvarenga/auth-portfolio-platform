import { render } from '@react-email/render'
import React from 'react'

interface EmailProps {
  [key: string]: any
}

export async function renderEmailComponent(
  EmailComponentJSX: React.ReactElement<EmailProps>,
): Promise<string> {
  const emailHtml = await render(EmailComponentJSX, {
    pretty: true,
  })

  return emailHtml
}
