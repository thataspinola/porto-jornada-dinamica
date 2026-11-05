import type { JourneyDefinition } from '@/validation/schemas'

type TextElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'TEXT' }
>

export type TextElementProps = {
  element: TextElementType
}
