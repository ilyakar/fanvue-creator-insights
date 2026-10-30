/* ------------------------------------------------------------
Defines shared theme preferences and the synchronous first-paint initializer.
---------------------------------------------------------------*/

export type Theme = 'light' | 'dark'

export const themeStorageKey = 'creator-insights-theme'
export const systemThemeQuery = '(prefers-color-scheme: dark)'

// Accepts only supported overrides so invalid or removed preferences follow the system.
export const parseThemePreference = (preference: string | null): Theme | null => {
  if (preference === 'light' || preference === 'dark') {
    return preference
  }

  return null
}

// Resolves an explicit override before falling back to the operating-system preference.
export const resolveTheme = (preference: Theme | null, systemPrefersDark: boolean): Theme =>
  preference ?? (systemPrefersDark ? 'dark' : 'light')

// Keep this script inline and independent of downloaded modules so it runs before the body can paint.
export const themeInitializationScript = `(() => {
  let savedTheme = null

  try {
    savedTheme = window.localStorage.getItem(${JSON.stringify(themeStorageKey)})
  } catch {}

  if (savedTheme === 'light' || savedTheme === 'dark') {
    document.documentElement.dataset.theme = savedTheme
  } else {
    document.documentElement.dataset.theme = window.matchMedia(${JSON.stringify(systemThemeQuery)}).matches
      ? 'dark'
      : 'light'
  }
})()`
