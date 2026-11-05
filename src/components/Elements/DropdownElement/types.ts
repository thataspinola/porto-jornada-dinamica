import type { JourneyDefinition } from '@/validation/schemas'

type SelectElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'SELECT' }
>

export type SelectElementProps = {
  element: SelectElementType
}
