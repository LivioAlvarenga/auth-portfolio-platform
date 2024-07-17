import { ThemeProvider } from '@/contexts/ThemeProvider'
import React from 'react'

interface AppProvidersProps {
  children: React.ReactNode
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {/* Add here other providers */}
      {children}
    </ThemeProvider>
  )
}

export default AppProviders
