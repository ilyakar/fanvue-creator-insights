/* ------------------------------------------------------------
Provides next.config functionality for audience insights.
---------------------------------------------------------------*/

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  agentRules: false,
  devIndicators: false,
  sassOptions: { silenceDeprecations: ['legacy-js-api'] },

  // Adds browser protections to all responses without exposing deployment details.
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
      ]
    }
  ]
}

export default nextConfig
