'use client'

/* ------------------------------------------------------------
Keeps unexpected server failures understandable and gives users a safe retry.
---------------------------------------------------------------*/

import Link from 'next/link'

// Keeps unexpected server failures understandable and gives users a safe retry.
const ErrorPage = ({ reset }: { error: Error & { digest?: string }; reset: () => void }) => (
  <main id="main-content" className="empty-state page-error">
    <h1>Unable to load this page</h1>
    <p>Your saved information hasn’t been changed. Please try again.</p>

    <div>
      <button className="button primary" onClick={reset}>
        Try again
      </button>

      <Link className="button secondary" href="/">
        Back home
      </Link>
    </div>
  </main>
)

export default ErrorPage
