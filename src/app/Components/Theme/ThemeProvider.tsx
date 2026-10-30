'use client'

/* ------------------------------------------------------------
Shares the active light or dark theme and persists explicit user choices.
---------------------------------------------------------------*/

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { parseThemePreference, resolveTheme, systemThemeQuery, themeStorageKey, type Theme } from '@/lib/theme'

interface ThemeContextValue {
  theme: Theme | null
  _toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

// Shares the active theme across controls and follows system changes until the user chooses an override.
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // The server cannot read browser preferences; keep the hydration snapshot neutral.
  const [theme, setTheme] = useState<Theme | null>(null)

  const themePreference = useRef<Theme | null>(null)

  // Updates document colors and React controls together without waiting for another effect.
  const applyTheme = useCallback((nextTheme: Theme) => {
    document.documentElement.dataset.theme = nextTheme
    setTheme(nextTheme)
  }, [])

  // Synchronizes controls with the initial theme and listens for system and cross-tab changes.
  useEffect(() => {
    const colorScheme = window.matchMedia(systemThemeQuery)
    let themeStorage: Storage | null = null

    try {
      themeStorage = window.localStorage
      themePreference.current = parseThemePreference(themeStorage.getItem(themeStorageKey))
    } catch {
      // Browsers can deny storage access; system defaults and in-memory choices still work.
    }

    // Applies the current override or system preference without discarding an in-memory choice.
    const updateTheme = () => {
      applyTheme(resolveTheme(themePreference.current, colorScheme.matches))
    }

    // Synchronizes overrides, removals and cleared storage from other tabs on this origin.
    const syncStoredTheme = (event: StorageEvent) => {
      if (event.storageArea !== themeStorage || (event.key !== themeStorageKey && event.key !== null)) {
        return
      }

      themePreference.current = parseThemePreference(event.newValue)
      updateTheme()
    }

    updateTheme()
    colorScheme.addEventListener('change', updateTheme)
    window.addEventListener('storage', syncStoredTheme)

    // Removes global listeners when the provider unmounts or development effects restart.
    return () => {
      colorScheme.removeEventListener('change', updateTheme)
      window.removeEventListener('storage', syncStoredTheme)
    }
  }, [applyTheme])

  // Persists an explicit theme choice and applies it immediately across the site.
  const _toggleTheme = useCallback(() => {
    const currentTheme = parseThemePreference(document.documentElement.dataset.theme ?? null)
    const resolvedTheme = resolveTheme(currentTheme, window.matchMedia(systemThemeQuery).matches)
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
    themePreference.current = nextTheme
    applyTheme(nextTheme)

    try {
      window.localStorage.setItem(themeStorageKey, nextTheme)
    } catch {
      // Preserve the explicit choice for this page even when persistence is unavailable.
    }
  }, [applyTheme])

  const themeContext = useMemo(() => ({ theme, _toggleTheme }), [theme, _toggleTheme])

  return <ThemeContext.Provider value={themeContext}>{children}</ThemeContext.Provider>
}

// Provides the active theme to a component that renders a theme control.
export const useTheme = () => {
  const themeContext = useContext(ThemeContext)

  if (!themeContext) {
    throw new Error('Theme controls must be used inside the theme provider.')
  }

  return themeContext
}

export default ThemeProvider
