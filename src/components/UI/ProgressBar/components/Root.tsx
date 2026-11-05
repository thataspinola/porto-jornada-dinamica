'use client'
import { clsx } from '@porto-stack/ui/utils'
import { useMemo } from 'react'

import { ProgressBarProvider } from '../context'
import s from '../styles.module.scss'
import type { ProgressBarRootProps } from '../types'

export function Root({
  max,
  value,
  children,
  className,
  ...props
}: ProgressBarRootProps) {
  const progressPercentage = useMemo(() => (value / max) * 100, [value, max])

  return (
    <ProgressBarProvider value={{ value, max, progressPercentage }}>
      <div
        className={clsx(s.progressBar, className)}
        role="progressbar"
        aria-label="barra de progresso"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${Math.round(progressPercentage)}%`}
        {...props}>
        {children}
      </div>
    </ProgressBarProvider>
  )
}
