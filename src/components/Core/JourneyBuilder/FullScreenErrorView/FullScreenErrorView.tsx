'use client'

import type { FullscreenAction } from '@/hooks/serviceErrorHandlers/types'

import { StepInlineError } from '../StepInlineError'

type FullscreenErrorViewProps = {
  error: FullscreenAction
  retryCount: number
  onRetry: () => void
}

export function FullscreenErrorView({
  error,
  retryCount,
  onRetry
}: FullscreenErrorViewProps) {
  const attempt =
    error.attempts[Math.min(retryCount, error.attempts.length - 1)]
  const { actionButton } = attempt

  return (
    <StepInlineError
      icon={error.icon}
      title={attempt.title}
      description={attempt.description}
      action={
        actionButton.onClickAction?.kind === 'redirect'
          ? {
              label: actionButton.children,
              url: actionButton.onClickAction.url
            }
          : { label: actionButton.children, onClick: onRetry }
      }
    />
  )
}
