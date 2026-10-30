'use client'

/* ------------------------------------------------------------
Provides isolated interface state without delaying server-rendered content behind rehydration.
---------------------------------------------------------------*/

import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { makeStore, persistStore } from '@redux/stores'

import ThemeProvider from './Components/Theme/ThemeProvider'
import AlertProvider from './AlertProvider'

// Provides isolated interface state without delaying server-rendered content behind rehydration.
const Providers = ({ children }: { children: React.ReactNode }) => {
  const [store] = useState(makeStore)

  // Restores whitelisted preferences only after the browser is ready.
  useEffect(() => {
    const persistor = persistStore(store)

    return () => {
      persistor.pause()
    }
  }, [store])

  return (
    <ThemeProvider>
      <Provider store={store}>
        <AlertProvider>{children}</AlertProvider>
      </Provider>
    </ThemeProvider>
  )
}

export default Providers
