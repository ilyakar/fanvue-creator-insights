/* ------------------------------------------------------------
Applies the shared visual foundation and accessible app providers.
---------------------------------------------------------------*/

import type { Metadata } from 'next'
import { config } from '@fortawesome/fontawesome-svg-core'

import '@fortawesome/fontawesome-svg-core/styles.css'
import '@styles/coreStyling/index.scss'
import Providers from './Providers'

config.autoAddCss = false

export const metadata: Metadata = {
  title: { default: 'Creator Insights | Know what your fans want next', template: '%s | Creator Insights' },
  description:
    'A little closer to your audience. Turn Fanvue comments into clear, evidence-backed ideas for what to create next.'
}

// Applies the shared visual foundation and accessible app providers.
const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <html lang="en" data-scroll-behavior="smooth">
    <body>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <Providers>{children}</Providers>
    </body>
  </html>
)

export default RootLayout
