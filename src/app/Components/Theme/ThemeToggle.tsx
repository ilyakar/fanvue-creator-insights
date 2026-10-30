'use client'

/* ------------------------------------------------------------
Lets users switch between light and dark appearance from any main page.
---------------------------------------------------------------*/

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'

import { useTheme } from './ThemeProvider'

// Renders the icon button that switches to the other color theme.
const ThemeToggle = () => {
  const { theme, _toggleTheme } = useTheme()
  let actionLabel = 'Switch color theme'

  if (theme) {
    actionLabel = `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`
  }

  return (
    <button className="theme-toggle" type="button" aria-label={actionLabel} title={actionLabel} onClick={_toggleTheme}>
      <FontAwesomeIcon className="sun-icon" icon={faSun} aria-hidden="true" />
      <FontAwesomeIcon className="moon-icon" icon={faMoon} aria-hidden="true" />
    </button>
  )
}

export default ThemeToggle
