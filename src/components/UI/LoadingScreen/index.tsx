'use client'

import { Loading } from '@porto-stack/ui'

import { useSimulatedProgress } from './useSimulatedProgress'

type LoadingScreenProps = {
  config: {
    messages: string[]
    from: number
    to: number
    completionHold?: number
  }
  complete?: boolean
}

export function LoadingScreen({
  config,
  complete = false
}: LoadingScreenProps) {
  const progressValue = useSimulatedProgress({
    from: config.from,
    to: config.to,
    complete
  })
  const range = config.to - config.from

  const relativeProgress =
    range === 0 ? 1 : (progressValue - config.from) / range

  const completionMessage = config.messages.at(-1)
  const messages = config.messages.slice(0, -1)
  const messageIndex = Math.min(
    Math.floor(relativeProgress * messages.length),
    messages.length - 1
  )

  return (
    <Loading
      value={progressValue}
      messages={[messages[messageIndex] ?? config.messages[0]]}
      completionMessage={completionMessage}
      completionHold={config.completionHold}
    />
  )
}
