'use client'

import { createContext, useContext } from 'react'

import type { JourneyStepFormContextValue } from './types'

export const JourneyStepFormContext =
  createContext<JourneyStepFormContextValue | null>(null)

export function useJourneyStepForm() {
  const context = useContext(JourneyStepFormContext)

  if (context === null) {
    throw new Error(
      'useJourneyStepForm must be used within a JourneyStepFormProvider'
    )
  }

  return context
}
