'use client'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from '@redux/stores'
import AlertProvider from './AlertProvider'

// Provides the Redux store with persistence and alert context across reloads
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AlertProvider>{children}</AlertProvider>
      </PersistGate>
    </Provider>
  )
}
