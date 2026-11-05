import type { Metadata as NextMetadata } from 'next'
import { Open_Sans } from 'next/font/google'
import localFont from 'next/font/local'
import { env, PublicEnvScript } from 'next-runtime-env'

import './globals.css'
import '@porto-stack/ui/tokens.css'
import '@porto-stack/ui/styles.css'

import Script from 'next/script'

import { generateSessionId, Metadata } from '@/utils'

import { QueryClientProvider } from '@/contexts/QueryClientProvider'

import { GTM, RecaptchaClient, TolkitLexis, VWO } from '@/scripts'

const openSans = Open_Sans({
  variable: '--ui-font-open-sans',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap'
})

const portoRoobert = localFont({
  src: './PortoRoobert-VariableFont.woff2',
  variable: '--ui-font-porto-robert',
  weight: '300 400 500 600 700',
  style: 'normal italic',
  display: 'swap'
})

const organizationId = env('NEXT_PUBLIC_ORGANIZATION_ID') || ''

export const metadata: NextMetadata = {
  title: {
    default: 'Porto Seguro',
    template: '%s | Porto Seguro'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const sessionId = generateSessionId(organizationId)

  return (
    <html
      lang="pt-BR"
      className={`${openSans.variable} ${portoRoobert.variable} ${openSans.className}`}>
      <head>
        <PublicEnvScript />
        <link rel="preconnect" href="https://dev.visualwebsiteoptimizer.com" />
        <VWO />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <RecaptchaClient />
      </head>
      <body>
        <QueryClientProvider>{children}</QueryClientProvider>
        <TolkitLexis sessionId={sessionId} organizationId={organizationId} />
        <GTM />
        <Metadata organizationId={organizationId} />
        <Script id="initialize-gtm" strategy="beforeInteractive">
          {`
            window.customData = window.customData || {};
            window.dataLayer = window.dataLayer || [];
          `}
        </Script>
      </body>
    </html>
  )
}
