'use client'
import { clsx } from '@porto-stack/ui/utils'
import { useEffect, useState } from 'react'

import { useProgressBar } from '../context'
import s from '../styles.module.scss'
import type { ProgressBarIndicatorProps } from '../types'

let lastProgress = 0

export function Indicator({
  className,
  style,
  ...props
}: ProgressBarIndicatorProps) {
  const { progressPercentage } = useProgressBar()
  const [progressWidth, setProgressWidth] = useState(lastProgress)

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setProgressWidth(progressPercentage)
      lastProgress = progressPercentage
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [progressPercentage])

  return (
    <div
      className={clsx(s.progressBarFill, className)}
      style={{ width: `${progressWidth}%`, ...style }}
      {...props}
    />
  )
}
