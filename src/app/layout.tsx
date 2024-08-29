import AppProviders from '@/contexts/AppProviders'
import { auth } from '@/lib/authjs'
import { sans400, sans500, sans700 } from '@/styles/fonts'
import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#09090B' },
  ],
}

export const metadata: Metadata = {
  title:
    'Auth Portfolio Platform - Segurança e Escalabilidade para Aplicações Modernas',
  description:
    'O Auth Portfolio Platform é uma solução robusta e escalável para autenticação de usuários, projetada para atender às necessidades de aplicações modernas com segurança e flexibilidade.',
  openGraph: {
    title:
      'Auth Portfolio Platform - Segurança e Escalabilidade para Aplicações Modernas',
    description:
      'O Auth Portfolio Platform é uma solução robusta e escalável para autenticação de usuários, projetada para atender às necessidades de aplicações modernas com segurança e flexibilidade.',
    url: '/',
    siteName: 'Auth Portfolio Platform',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BUCKET}/logo-og-800-600.png`,
        width: 800,
        height: 600,
        alt: 'Auth Portfolio Platform - Segurança e Escalabilidade para Aplicações Modernas',
      },
      {
        url: `${process.env.NEXT_PUBLIC_BUCKET}/logo-og-1800-1600.png`,
        width: 1800,
        height: 1600,
        alt: 'Auth Portfolio Platform - Segurança e Escalabilidade para Aplicações Modernas',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Auth Portfolio Platform - Segurança e Escalabilidade para Aplicações Modernas',
    description:
      'O Auth Portfolio Platform é uma solução robusta e escalável para autenticação de usuários, projetada para atender às necessidades de aplicações modernas com segurança e flexibilidade.',
    images: [`${process.env.NEXT_PUBLIC_BUCKET}/logo-og-800-600.png`],
  },
  verification: {
    google: '', // Adicione o código de verificação do Google se necessário
  },
  metadataBase: new URL('https://auth-portfolio.livioalvarenga.com.br/'),
  alternates: {
    canonical: 'https://auth-portfolio.livioalvarenga.com.br/',
  },
  category: 'Business',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const session = await auth()

  return (
    <html lang="pt-br" suppressHydrationWarning className="scroll-pt-36">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0866ff" />
        <meta name="msapplication-TileColor" content="#ffffff" />
      </head>
      <body
        className={`${sans400.variable} ${sans700.variable} ${sans500.variable} min-h-screen overflow-x-hidden scroll-smooth bg-background font-sans400 text-[16px] leading-[24px] tracking-[0.5px] text-foreground antialiased selection:bg-primary selection:text-primary-foreground`}
      >
        <AppProviders session={session}>
          <div className="relative flex min-h-screen flex-col bg-background">
            <main className="flex-1">{children}</main>
          </div>
        </AppProviders>
        <Toaster />
      </body>
    </html>
  )
}
