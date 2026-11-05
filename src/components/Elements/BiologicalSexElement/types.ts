import type { JourneyDefinition } from '@/validation/schemas'

type BiologicalSexElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'BIOLOGICAL_SEX' }
>

export type BiologicalSexElementProps = {
  element: BiologicalSexElementType
}
