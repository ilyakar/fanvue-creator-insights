/* ------------------------------------------------------------
Checks first-paint theme selection and neutral server-rendered theme controls.
---------------------------------------------------------------*/

import test from 'node:test'
import assert from 'node:assert/strict'
import { runInNewContext } from 'node:vm'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { resolveTheme, parseThemePreference, themeInitializationScript, themeStorageKey } from '@/lib/theme'
import ThemeProvider from '@/app/Components/Theme/ThemeProvider'
import ThemeToggle from '@/app/Components/Theme/ThemeToggle'

const themeScenarios = [
  { preference: null, systemPrefersDark: false, expectedTheme: 'light' },
  { preference: null, systemPrefersDark: true, expectedTheme: 'dark' },
  { preference: 'light', systemPrefersDark: true, expectedTheme: 'light' },
  { preference: 'dark', systemPrefersDark: false, expectedTheme: 'dark' },
  { preference: 'unsupported', systemPrefersDark: true, expectedTheme: 'dark' },
  { preference: 'unsupported', systemPrefersDark: false, expectedTheme: 'light' }
]

// Executes the actual synchronous bootstrap with browser preferences before any React code runs.
for (const scenario of themeScenarios) {
  test(`first paint uses ${scenario.expectedTheme} with override ${scenario.preference} and system dark ${scenario.systemPrefersDark}`, () => {
    const rootElement = { dataset: { theme: undefined as string | undefined } }

    runInNewContext(themeInitializationScript, {
      document: { documentElement: rootElement },
      window: {
        localStorage: {
          // Checks the same persistence key is used on initial load and subsequent theme changes.
          getItem: (storageKey: string) => {
            assert.equal(storageKey, themeStorageKey)

            return scenario.preference
          }
        },
        matchMedia: () => ({ matches: scenario.systemPrefersDark })
      }
    })

    assert.equal(rootElement.dataset.theme, scenario.expectedTheme)
    assert.equal(
      resolveTheme(parseThemePreference(scenario.preference), scenario.systemPrefersDark),
      scenario.expectedTheme
    )
  })
}

// Preserves system dark mode when browsers block either storage access or individual reads.
for (const deniedOperation of ['access', 'read']) {
  test(`storage ${deniedOperation} denial still applies system dark before hydration`, () => {
    const rootElement = { dataset: { theme: undefined as string | undefined } }
    const browserWindow = {
      // Simulates both SecurityError on accessing storage and errors reading from it.
      get localStorage() {
        if (deniedOperation === 'access') {
          throw new Error('Storage is unavailable')
        }

        return {
          // Simulates browsers that expose storage but reject reads.
          getItem: () => {
            throw new Error('Storage reads are unavailable')
          }
        }
      },
      matchMedia: () => ({ matches: true })
    }

    runInNewContext(themeInitializationScript, {
      document: { documentElement: rootElement },
      window: browserWindow
    })

    assert.equal(rootElement.dataset.theme, 'dark')
  })
}

// Keeps server output independent of unknown browser preferences so hydration can match it.
test('theme controls render neutral accessible markup before browser preferences are available', () => {
  const markup = renderToStaticMarkup(createElement(ThemeProvider, null, createElement(ThemeToggle)))

  assert.match(markup, /aria-label="Switch color theme"/)
  assert.match(markup, /sun-icon/)
  assert.match(markup, /moon-icon/)
  assert.doesNotMatch(markup, /aria-pressed/)
})
