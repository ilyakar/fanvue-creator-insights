/* ------------------------------------------------------------
Gives missing posts and unavailable routes a useful route back to the product.
---------------------------------------------------------------*/

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

import Brand from './Components/Brand/Brand'

// Gives missing posts and unavailable routes a useful route back to the product.
const NotFoundPage = () => (
  <div className="onboarding-page">
    <header>
      <Brand />
    </header>

    <main id="main-content" className="connect-card">
      <h1>Page not found</h1>
      <p>This page or post may have moved or no longer exists.</p>

      <Link className="button primary" href="/">
        Back home <FontAwesomeIcon icon={faArrowRight} />
      </Link>
    </main>
  </div>
)

export default NotFoundPage
