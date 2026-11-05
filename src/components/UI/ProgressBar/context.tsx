'use client'
import { createContext, useContext } from 'react'

export interface ProgressBarContextValue {
  value: number
  max: number
  progressPercentage: number
}

const ProgressBarContext = createContext<ProgressBarContextValue | null>(null)

export const ProgressBarProvider = ProgressBarContext.Provider

export function useProgressBar() {
  const context = useContext(ProgressBarContext)

  if (!context) {
    throw new Error('ProgressBar.* must be used within <ProgressBar.Root>')
  }

  return context
}
