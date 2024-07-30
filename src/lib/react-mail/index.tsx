import { render } from '@react-email/render'
import React from 'react'

interface EmailProps {
  [key: string]: any
}

export function renderEmailComponent(
  EmailComponentJSX: React.ReactElement<EmailProps>,
): string {
  const emailHtml = render(EmailComponentJSX, {
    pretty: true,
  })

  return emailHtml
}
