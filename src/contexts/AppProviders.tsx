import { ThemeProvider } from '@/contexts/ThemeProvider'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

interface AppProvidersProps {
  session: Session | null
  children: React.ReactNode
}

const AppProviders: React.FC<AppProvidersProps> = ({ session, children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider session={session}>
        {/* Add here other providers */}
        {children}
      </SessionProvider>
    </ThemeProvider>
  )
}

export default AppProviders
