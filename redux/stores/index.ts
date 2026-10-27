/* ------------------------------------------------------------
Supplies inert storage during server rendering to avoid cross-request browser state.
---------------------------------------------------------------*/

import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'
import preferencesReducer from '../reducers/Preferences'

// Supplies inert storage during server rendering to avoid cross-request browser state.
const createStorage = () => {
  if (typeof window !== 'undefined') return createWebStorage('local')
  return {
    // Returns no persisted browser preference on the server.
    getItem: async () => null,

    // Leaves persistence to the browser after hydration.
    setItem: async (_key: string, value: string) => value,

    // Keeps server-side cleanup free of browser side effects.
    removeItem: async () => undefined
  }
}

// Creates a separate store for each provider rather than sharing state between users.
export const makeStore = () =>
  configureStore({
    reducer: {
      Preferences: persistReducer(
        { key: 'fanvue-preferences', version: 1, storage: createStorage(), whitelist: ['isSidebarCollapsed'] },
        preferencesReducer
      )
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            'persist/PERSIST',
            'persist/REHYDRATE',
            'persist/REGISTER',
            'persist/PURGE',
            'persist/FLUSH',
            'persist/PAUSE'
          ]
        }
      })
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
export { persistStore }
