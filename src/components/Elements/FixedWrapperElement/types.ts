import type { JourneyDefinition } from '@/validation/schemas'

type FixedWrapperElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'FIXED_WRAPPER' }
>

export type FixedWrapperElementProps = {
  element: FixedWrapperElementType
}
