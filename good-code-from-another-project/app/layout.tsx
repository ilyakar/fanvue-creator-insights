import type { Metadata } from 'next'
import { Merriweather, DM_Sans } from 'next/font/google'
import Providers from './Providers'

// Styles
import '@styles/coreStyling/index.scss' // Base styling: e.g., buttons, body bg, etc

// Custom fonts
const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-merriweather'
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans'
})

export const metadata: Metadata = {
  title: 'Archetype Reflection Web App',
  description: 'Archetype Reflection Web App'
}

// Root layout wrapper applied to every page
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${merriweather.variable} ${dmSans.variable}`} lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
