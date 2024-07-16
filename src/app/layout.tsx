import { sans400, sans500, sans700 } from '@/styles/fonts'
import '@/styles/globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Área administrativa Produtivese',
  description: 'Área administrativa do Produtivese',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${sans400.variable} ${sans700.variable} ${sans500.variable} min-h-screen overflow-x-hidden scroll-smooth bg-background font-sans400 text-[16px] leading-[24px] tracking-[0.5px] text-foreground antialiased selection:bg-primary selection:text-white`}
      >
        {children}
      </body>
    </html>
  )
}
