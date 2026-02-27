'use client'

import { SessionProvider } from 'next-auth/react';

export default function SessionProviderWrapper({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SessionProvider basePath="/react-ssr-corp-hubv-dinamic-journey/api/auth">
      {children}
    </SessionProvider>
  )
}
