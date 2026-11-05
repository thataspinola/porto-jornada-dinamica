import type { JourneyDefinition } from '@/validation/schemas'

type IconElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'ICON' }
>

export type IconElementProps = {
  element: IconElementType
}
