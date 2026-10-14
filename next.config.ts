import path from 'node:path'
import type { NextConfig } from 'next'

const headers = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'Permissions-Policy',
    value:
      'geolocation=(), microphone=(), camera=(self), payment=(), fullscreen=(), usb=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=15724800; includeSubDomains; preload',
  },
]

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.resolve(__dirname),
  turbopack: { root: path.resolve(__dirname) },
  distDir: 'dist/react-ssr-corp-hubv-dinamic-journey',
  basePath: '/contrate',
  typescript: {
    ignoreBuildErrors: true,
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src; script-src 'self' 'unsafe-inline' https://apis.google.com",
          },
        ],
      },
      {
        source: '/',
        headers,
      },
      {
        source: '/(.*)',
        headers,
      },
    ]
  },
}

export default nextConfig
