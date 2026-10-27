'use client'

/* ------------------------------------------------------------
Gives every authenticated screen a shared, responsive navigation and sample-data context.
---------------------------------------------------------------*/

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRightFromBracket,
  faArrowUpRightFromSquare,
  faBars,
  faChartSimple,
  faChevronLeft,
  faChevronRight,
  faCommentDots,
  faGear,
  faLayerGroup,
  faShieldHalved,
  faWandMagicSparkles,
  faXmark
} from '@fortawesome/free-solid-svg-icons'
import { setSidebarCollapsed } from '@redux/reducers/Preferences'
import type { RootState } from '@redux/stores'

import type { Account } from '@/lib/types'
import { useAlert } from '@/app/AlertProvider'
import Brand from '@/app/Components/Brand/Brand'
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
  const dispatch = useDispatch()
  const isCollapsed = useSelector((state: RootState) => state.Preferences.isSidebarCollapsed)
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

  const basePath = isPreview ? '/preview' : '/dashboard'

  const navigation = [
    { label: 'Overview', href: basePath, icon: faChartSimple },
    { label: 'Posts', href: `${basePath}/posts`, icon: faLayerGroup },
    { label: 'Messages', href: `${basePath}/messages`, icon: faCommentDots },
    { label: 'Settings', href: `${basePath}/settings`, icon: faGear }
  ]

  const activeItem =
    navigation.find(item => item.href === pathname) ||
    navigation.find(item => item.href !== basePath && pathname.startsWith(item.href)) ||
    navigation[0]

  // Toggles the mobile drawer from its accessible menu button.
  const _handleMenuToggle = () => setIsMenuOpen(previousValue => !previousValue)

  // Saves the user's preferred desktop sidebar width.
  const _handleCollapse = () => dispatch(setSidebarCollapsed(!isCollapsed))

  // Closes mobile navigation when a destination has been chosen.
  const _handleNavigate = () => setIsMenuOpen(false)

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
    <div
      className={['app-shell', isCollapsed && !isMobileViewport && 'collapsed', isMenuOpen && 'menu-open']
        .filter(Boolean)
        .join(' ')}>
      {isMenuOpen && <button className="menu-backdrop" aria-label="Close navigation" onClick={_handleMenuToggle} />}

      <aside
        className="sidebar"
        aria-label="Main navigation"
        ref={sidebarReference}
        inert={isMobileViewport && !isMenuOpen}
        aria-hidden={isMobileViewport && !isMenuOpen ? true : undefined}>
        <div className="brand-row">
          <Brand href={basePath} />

          <button className="icon-button mobile-close" aria-label="Close navigation" onClick={_handleMenuToggle}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="workspace">
          <span className="workspace-avatar">{account?.display_name?.slice(0, 1) || 'S'}</span>

          <div className="workspace-copy">
            <strong>{account?.display_name || 'Sample creator'}</strong>
            <span>Creator workspace</span>
          </div>
        </div>

        <span className="navigation-label">YOUR WORKSPACE</span>

        <nav>
          {navigation.map(item => (
            <Link
              key={item.label}
              href={item.href}
              onClick={_handleNavigate}
              className={['nav-link', activeItem.label === item.label && 'active'].filter(Boolean).join(' ')}
              aria-current={activeItem.label === item.label ? 'page' : undefined}
              title={isCollapsed ? item.label : undefined}>
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.label}</span>
              {item.label === 'Messages' && <small>Soon</small>}
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

          <Link href="/privacy" className="privacy-link">
            <FontAwesomeIcon icon={faShieldHalved} />
            <span>Your privacy matters</span>
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </Link>

          <div className="account-row">
            <span className="account-avatar">{account?.display_name?.slice(0, 1) || 'S'}</span>

            <div className="account-copy">
              <strong>{account?.display_name || 'Sample creator'}</strong>
              <span>{isPreview ? 'Design preview' : `@${account?.username || 'creator'}`}</span>
            </div>

            <button className="icon-button" aria-label="Sign out" onClick={_handleLogout}>
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </button>
          </div>
        </div>

        <button
          className="collapse-button"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!isCollapsed}
          onClick={_handleCollapse}>
          <FontAwesomeIcon icon={isCollapsed ? faChevronRight : faChevronLeft} />
        </button>
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

            <strong>{activeItem.label}</strong>
          </div>

          <div className="topbar-context">
            <span className="sample-pill">
              <span />
              Sample data
            </span>

            <span className="private-label">
              <FontAwesomeIcon icon={faShieldHalved} /> Just for you
            </span>
          </div>
        </header>

        {isPreview && (
          <div className="preview-notice">
            <FontAwesomeIcon icon={faWandMagicSparkles} />
            <strong>Design preview</strong>
            <span>Illustrative insights and sample comments. No account connected or AI analysis run.</span>
          </div>
        )}

        <main id="main-content" className="app-main">
          {children}
        </main>

        <footer className="app-footer">
          <span>Made for creators. Grounded in your audience.</span>
          <Brand href={basePath} />
        </footer>
      </div>
    </div>
  )
}

export default AppShell
