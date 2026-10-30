/* ------------------------------------------------------------
Explains the real connection honestly, including setup and declined-authorization states.
---------------------------------------------------------------*/

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faCheck, faLink, faShieldHalved } from '@fortawesome/free-solid-svg-icons'

import Brand from '@/app/Components/Brand/Brand'
import { getMissingConfiguration } from '@/lib/server/config'

export const dynamic = 'force-dynamic'

// Explains the real connection honestly, including setup and declined-authorization states.
const ConnectPage = async ({ searchParams }: { searchParams: Promise<{ reason?: string }> }) => {
  const { reason } = await searchParams
  const isReady = getMissingConfiguration().length === 0

  return (
    <div className="onboarding-page">
      <header>
        <Brand />

        <Link className="back-link" href="/">
          <FontAwesomeIcon icon={faArrowLeft} /> Back home
        </Link>
      </header>

      <main id="main-content" className="connect-card">
        <span className="connect-symbol">
          <FontAwesomeIcon icon={faLink} />
        </span>

        <h1>{!isReady ? 'Fanvue connection unavailable' : 'Connect your Fanvue account'}</h1>

        <p>
          {!isReady
            ? 'This app’s Fanvue connection is still being set up. Once it’s ready, you’ll be able to sign in securely with Fanvue.'
            : 'Sign in with Fanvue to analyse sample comments and save your insights.'}
        </p>

        {reason === 'session' && (
          <div className="connection-message">Please sign in again to access your saved insights.</div>
        )}

        {reason === 'connection' && isReady && (
          <div className="connection-message">
            We couldn’t finish that connection. You can try again whenever you’re ready.
          </div>
        )}

        <ul>
          <li>
            <FontAwesomeIcon icon={faCheck} /> Sign in on Fanvue’s official website.
          </li>

          <li>
            <FontAwesomeIcon icon={faCheck} /> No separate account or password.
          </li>

          <li>
            <FontAwesomeIcon icon={faCheck} /> Clear insights, grounded in original comments.
          </li>
        </ul>

        {isReady ? (
          <a className="button primary" href="/api/auth/fanvue">
            Connect with Fanvue <FontAwesomeIcon icon={faArrowRight} />
          </a>
        ) : (
          <button className="button primary" disabled>
            Connection being set up
          </button>
        )}

        <p className="connection-footnote">
          <FontAwesomeIcon icon={faShieldHalved} />
          This prototype uses sample posts and comments. Your actual content won’t be accessed.
        </p>
      </main>
    </div>
  )
}

export default ConnectPage
