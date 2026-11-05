import type { JourneyDefinition } from '@/validation/schemas'

type GridElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'GRID' }
>

export type GridElementProps = {
  element: GridElementType
}
