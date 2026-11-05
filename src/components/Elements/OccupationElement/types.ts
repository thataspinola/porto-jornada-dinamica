import type { JourneyDefinition } from '@/validation/schemas'

type OccupationElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'OCCUPATION' }
>

export type OccupationElementProps = {
  element: OccupationElementType
}
