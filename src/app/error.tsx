'use client'

import { Typography } from '@porto-stack/ui'
import { useEffect } from 'react'

import { sendNativeMessage } from '@/utils'

import { Header } from '@/components/Core'
import { Button } from '@/components/UI'

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(`Erro capturado: ${error}`)
  }, [error])

  function handleGoBack() {
    const hasNativeBridge =
      window.webkit?.messageHandlers?.portoNativeBridge?.postMessage ||
      window.AndroidBridge?.postMessage

    if (hasNativeBridge) {
      sendNativeMessage({ action: 'dismiss' })
    }
  }

  return (
    <div>
      <Header handleGoBack={handleGoBack} />
      <main
        style={{
          margin: '0 auto',
          marginTop: '94px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px'
        }}>
        <Typography variant="title4" weight="bold">
          Ops! Algo deu errado
        </Typography>
        <Button styles="ghost" onClick={reset}>
          Por favor, tente novamente.
        </Button>
      </main>
    </div>
  )
}
