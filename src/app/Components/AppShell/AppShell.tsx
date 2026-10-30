'use client'

/* ------------------------------------------------------------
Gives every authenticated screen a shared, responsive navigation and sample-data context.
---------------------------------------------------------------*/

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRightFromBracket,
  faArrowUpRightFromSquare,
  faBars,
  faChartSimple,
  faCommentDots,
  faGear,
  faLayerGroup,
  faShieldHalved,
  faWandMagicSparkles,
  faXmark
} from '@fortawesome/free-solid-svg-icons'

import type { Account } from '@/lib/types'
import { useAlert } from '@/app/AlertProvider'
import Brand from '@/app/Components/Brand/Brand'
import PostsFilterProvider from '@/app/Components/PostsBrowser/PostsFilterProvider'
import ThemeToggle from '@/app/Components/Theme/ThemeToggle'
import { useFocusTrap } from '@/lib/hooks/useFocusTrap'

// Gives every authenticated screen a shared, responsive navigation and sample-data context.
const AppShell = ({
  children,
  account,
  isPreview
}: {
  children: React.ReactNode
  account: Account | null
  isPreview: boolean
}) => {
  const pathname = usePathname()
  const showAlert = useAlert()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(false)

  const sidebarReference = useRef<HTMLElement>(null)

  // Closes the mobile navigation from modal keyboard controls.
  const _handleMenuClose = useCallback(() => setIsMenuOpen(false), [])
  useFocusTrap(sidebarReference, isMenuOpen && isMobileViewport, _handleMenuClose)

  // Hides offscreen mobile controls from keyboard and assistive-technology navigation.
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')

    // Keeps the mobile navigation mode in sync with viewport changes.
    const updateViewport = () => {
      setIsMobileViewport(mediaQuery.matches)

      if (!mediaQuery.matches) {
        setIsMenuOpen(false)
      }
    }

    updateViewport()
    mediaQuery.addEventListener('change', updateViewport)

    return () => mediaQuery.removeEventListener('change', updateViewport)
  }, [])

  const accountDisplayName = account?.display_name || 'Sample creator'
  const accountInitial = account?.display_name?.slice(0, 1) || 'S'
  const accountDescription = isPreview ? 'Design preview' : `@${account?.username || 'creator'}`
  const basePath = isPreview ? '/preview' : '/dashboard'

  const navigationItems = [
    { label: 'Overview', href: basePath, icon: faChartSimple },
    { label: 'Posts', href: `${basePath}/posts`, icon: faLayerGroup },
    { label: 'Messages', href: `${basePath}/messages`, icon: faCommentDots },
    { label: 'Settings', href: `${basePath}/settings`, icon: faGear }
  ]

  const activeNavigationItem =
    navigationItems.find(navigationItem => navigationItem.href === pathname) ||
    navigationItems.find(
      navigationItem => navigationItem.href !== basePath && pathname.startsWith(navigationItem.href)
    ) ||
    navigationItems[0]

  // Toggles the mobile drawer from its accessible menu button.
  const _handleMenuToggle = () => setIsMenuOpen(previousValue => !previousValue)

  // Invalidates the active session before returning to the public landing page.
  const _handleLogout = () => {
    if (isPreview) {
      showAlert('You’re in the design preview', 'There is no connected account to sign out of.')

      return
    }

    fetch('/api/account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error()
        }

        window.location.assign('/')
      })
      .catch(() => showAlert('Couldn’t sign out', 'Please try again.'))
  }

  return (
    <div className={['app-shell', isMenuOpen && 'menu-open'].filter(Boolean).join(' ')}>
      {isMenuOpen && <button className="menu-backdrop" aria-label="Close navigation" onClick={_handleMenuClose} />}

      <aside
        className="sidebar"
        aria-label="Main navigation"
        ref={sidebarReference}
        inert={isMobileViewport && !isMenuOpen}
        aria-hidden={isMobileViewport && !isMenuOpen ? true : undefined}>
        <div className="brand-row">
          <Brand href={basePath} />

          <button className="icon-button mobile-close" aria-label="Close navigation" onClick={_handleMenuClose}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="workspace">
          <span className="workspace-avatar">{accountInitial}</span>

          <div className="workspace-copy">
            <strong>{accountDisplayName}</strong>
            <span>Creator workspace</span>
          </div>
        </div>

        <span className="navigation-label">YOUR WORKSPACE</span>

        <nav>
          {navigationItems.map(navigationItem => (
            <Link
              key={navigationItem.label}
              href={navigationItem.href}
              onClick={_handleMenuClose}
              className={['nav-link', activeNavigationItem.label === navigationItem.label && 'active']
                .filter(Boolean)
                .join(' ')}
              aria-current={activeNavigationItem.label === navigationItem.label ? 'page' : undefined}>
              <FontAwesomeIcon icon={navigationItem.icon} />
              <span>{navigationItem.label}</span>
              {navigationItem.label === 'Messages' && <small>Soon</small>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <FontAwesomeIcon icon={faWandMagicSparkles} />

            <strong>
              Less guessing.
              <br />
              More connection.
            </strong>

            <p>A little clarity for your next big idea.</p>
          </div>

          <Link href="/privacy" className="privacy-link" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faShieldHalved} />
            <span>Your privacy matters</span>
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </Link>

          <div className="account-row">
            <span className="account-avatar">{accountInitial}</span>

            <div className="account-copy">
              <strong>{accountDisplayName}</strong>
              <span>{accountDescription}</span>
            </div>

            <button className="icon-button" aria-label="Sign out" onClick={_handleLogout}>
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </button>
          </div>
        </div>
      </aside>

      <div className="app-body">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-toggle"
              aria-label="Open navigation"
              aria-expanded={isMenuOpen}
              onClick={_handleMenuToggle}>
              <FontAwesomeIcon icon={faBars} />
            </button>

            <span className="workspace-breadcrumb">
              Your workspace <span>/</span>
            </span>

            <strong>{activeNavigationItem.label}</strong>
          </div>

          <div className="topbar-context">
            <ThemeToggle />
          </div>
        </header>

        {isPreview && (
          <div className="preview-notice">
            <FontAwesomeIcon icon={faWandMagicSparkles} />
            <strong>Design preview</strong>
            <span>Illustrative insights and sample comments. No account connected or AI analysis run.</span>
          </div>
        )}

        <PostsFilterProvider>
          <main id="main-content" className="app-main">
            {children}
          </main>
        </PostsFilterProvider>

        <footer className="app-footer">
          <span>Made for creators. Grounded in your audience.</span>
          <Brand href={basePath} />
        </footer>
      </div>
    </div>
  )
}

export default AppShell
