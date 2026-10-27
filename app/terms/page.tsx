/* ------------------------------------------------------------
Clearly identifies the assignment as a prototype rather than a generally available service.
---------------------------------------------------------------*/

import Link from 'next/link'
import Brand from '../Components/Brand/Brand'

// Clearly identifies the assignment as a prototype rather than a generally available service.
const AboutPrototypePage = () => (
  <div className="information-page">
    <header>
      <Brand />
      <Link href="/">Back home</Link>
    </header>

    <main id="main-content">
      <span className="eyebrow">ABOUT THIS PROTOTYPE</span>
      <h1>A little idea, brought to life.</h1>

      <p>
        Fanvue Insights is a product prototype exploring how creators could understand audience feedback more easily.
      </p>

      <h2>What’s real</h2>

      <p>
        When configured, the app connects through Fanvue’s official OAuth flow and uses a real AI model to analyse
        comments. Counts and comment relationships are calculated and checked by application code.
      </p>

      <h2>What’s sample content</h2>

      <p>
        Source posts, fans, comments and imagery are illustrative. The local development preview additionally uses
        editorial insight fixtures, clearly labelled as design examples rather than AI output.
      </p>

      <h2>What to expect</h2>

      <p>
        This prototype does not offer billing, publishing tools or message analysis. AI interpretations can miss
        context; read the original supporting comments before deciding what to do next.
      </p>

      <Link className="text-button" href="/privacy">
        Read about data use →
      </Link>
    </main>
  </div>
)

export default AboutPrototypePage
