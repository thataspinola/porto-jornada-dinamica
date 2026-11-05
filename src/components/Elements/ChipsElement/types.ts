import type { JourneyDefinition } from '@/validation/schemas'

type ChipsElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'CHIPS' }
>

export type ChipsElementProps = {
  element: ChipsElementType
}
