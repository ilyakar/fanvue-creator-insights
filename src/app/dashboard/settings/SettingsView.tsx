/* ------------------------------------------------------------
Shares settings headings, connection panel and disclosures across ready and pending screens.
---------------------------------------------------------------*/

import type { ReactNode } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpRightFromSquare, faDatabase, faLink, faShieldHalved } from '@fortawesome/free-solid-svg-icons'

import AccountAction from '@/app/Components/AccountAction/AccountAction'

// Keeps settings copy on the server while individual account controls own confirmation state.
const SettingsView = ({ isPreview, connectionDetails }: { isPreview: boolean; connectionDetails: ReactNode }) => (
  <div className="settings-page">
    <div className="page-heading">
      <div>
        <span className="eyebrow">YOUR WORKSPACE, YOUR WAY</span>
        <h1>A few things, taken care of.</h1>
        <p>Your connection, your information, and a little peace of mind.</p>
      </div>
    </div>

    <section className="settings-panel">
      <div className="panel-heading">
        <span className="settings-icon">
          <FontAwesomeIcon icon={faLink} />
        </span>

        <div>
          <h2>Your Fanvue connection</h2>
          <p>One account. No extra passwords.</p>
        </div>
      </div>

      {connectionDetails}

      <div className="settings-action">
        <p>
          Disconnecting removes this app’s stored account, credentials and analysis. You can also revoke consent in your
          Fanvue settings.
        </p>

        <AccountAction action="disconnect" isPreview={isPreview} />
      </div>
    </section>

    <section className="settings-panel">
      <div className="panel-heading">
        <span className="settings-icon">
          <FontAwesomeIcon icon={faDatabase} />
        </span>

        <div>
          <h2>Your data, in your hands</h2>
          <p>Keep what’s useful. Clear what you don’t need.</p>
        </div>
      </div>

      <div className="settings-action">
        <div>
          <h3>Clear saved analysis</h3>
          <p>Remove your saved insights. Your Fanvue account and its content won’t be changed.</p>
        </div>

        <AccountAction action="clear-analysis" isPreview={isPreview} />
      </div>
    </section>

    <section className="sample-explainer">
      <span className="sample-pill">
        <span />
        Sample data
      </span>

      <h2>A real connection. A sample audience.</h2>

      <p>
        This prototype uses fictional posts, fans and comments. After you connect, a real AI model analyses that sample
        content. We never present it as feedback from your actual audience.
      </p>

      <Link className="text-button" href="/privacy" target="_blank" rel="noopener noreferrer">
        How we handle your information <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
      </Link>
    </section>

    <p className="settings-privacy">
      <FontAwesomeIcon icon={faShieldHalved} /> Account credentials stay encrypted on the server.
    </p>
  </div>
)

export default SettingsView
