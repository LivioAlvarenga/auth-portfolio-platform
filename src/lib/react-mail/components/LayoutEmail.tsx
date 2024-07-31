// BodyEmail.js ou BodyEmail.tsx
import { colors } from '@/styles/theme/tokens'
import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Preview,
  Tailwind,
} from '@react-email/components'
import React from 'react'
import { FooterEmail } from './FooterEmail'
import { HeaderEmail } from './HeaderEmail'

interface LayoutEmailProps {
  children: React.ReactNode
  previewText: string
}

export function LayoutEmail({ children, previewText }: LayoutEmailProps) {
  return (
    <Html lang="pt-br">
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors,
            },
          },
        }}
      >
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] w-full max-w-[600px] rounded border border-solid border-[#eaeaea] pt-5">
            <HeaderEmail />
            {children}
            <FooterEmail />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
