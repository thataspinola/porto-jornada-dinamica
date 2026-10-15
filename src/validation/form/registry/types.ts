import type { JourneyDefinition } from '@/validation/schemas'

import type { ElementDefinition } from '../types'

type JourneyStep = JourneyDefinition['steps'][number]
type JourneyElement = JourneyStep['elements'][number]

export type ElementHandler<K extends JourneyElement['type']> = (
  config: Extract<JourneyElement, { type: K }>['config']
) => ElementDefinition
