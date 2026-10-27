/* ------------------------------------------------------------
Explains the prototype's actual data flow without making unsupported privacy promises.
---------------------------------------------------------------*/

import Link from 'next/link'

import Brand from '@/app/Components/Brand/Brand'

// Explains the prototype's actual data flow without making unsupported privacy promises.
const PrivacyPage = () => (
  <div className="information-page">
    <header>
      <Brand />
      <Link href="/">Back home</Link>
    </header>

    <main id="main-content">
      <span className="eyebrow">A LITTLE TRANSPARENCY</span>
      <h1>Your information, explained.</h1>
      <p>This is a working product prototype. Here’s what it uses today.</p>
      <h2>Your connection</h2>

      <p>
        Signing in through Fanvue shares your basic account identity and grants the requested connection permissions.
        The app stores your identity, encrypted access and refresh tokens, and a server-side session. A secure, HttpOnly
        browser cookie identifies your session.
      </p>

      <h2>Posts and comments</h2>

      <p>
        All posts, comments and fan identities analysed in this prototype are fictional sample records. Your real Fanvue
        posts, comments and private messages are not fetched or analysed.
      </p>

      <h2>AI processing</h2>

      <p>
        Sample post context and comment text are sent to OpenAI for analysis. Fanvue credentials are not included.
        Results and their supporting comment references are saved so you can return without repeating the analysis.
      </p>

      <h2>Your controls</h2>

      <p>
        Settings lets you clear saved analysis or disconnect. Disconnecting removes this app’s stored account, tokens,
        sessions and analysis. You can also revoke the app’s authorization in your Fanvue account settings. Shared
        fictional sample files remain part of the prototype.
      </p>

      <h2>Browser preferences</h2>

      <p>
        The app can save a sidebar layout preference in local storage. Credentials and saved analysis are not stored
        there.
      </p>

      <Link className="button secondary" href="/">
        Back to Creator Insights
      </Link>
    </main>
  </div>
)

export default PrivacyPage
