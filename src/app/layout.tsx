import AppProviders from '@/contexts/AppProviders'
import { sans400, sans500, sans700 } from '@/styles/fonts'
import '@/styles/globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { Toaster } from 'sonner'

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
        <AppProviders>
          <div className="relative flex min-h-screen flex-col bg-background">
            {/* <Header /> */}
            <main className="flex-1">{children}</main>
            {/* <Footer /> */}
          </div>
        </AppProviders>
        <Toaster />
      </body>
    </html>
  )
}
