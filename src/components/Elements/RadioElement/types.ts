import type { JourneyDefinition } from '@/validation/schemas'

type RadioElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'RADIO' }
>

export type RadioElementProps = {
  element: RadioElementType
}
