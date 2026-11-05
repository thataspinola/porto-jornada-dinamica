'use client'

import { createContext } from 'react'

import type { JourneyDefinition } from '@/validation/schemas'

export const JourneyVariantContext = createContext<
  JourneyDefinition['variant'] | null
>(null)
