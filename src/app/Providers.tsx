'use client'

/* ------------------------------------------------------------
Provides shared theme and alert context throughout the application.
---------------------------------------------------------------*/

import ThemeProvider from './Components/Theme/ThemeProvider'
import AlertProvider from './AlertProvider'

// Provides shared theme and alert context throughout the application.
const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <AlertProvider>{children}</AlertProvider>
    </ThemeProvider>
  )
}

export default Providers
