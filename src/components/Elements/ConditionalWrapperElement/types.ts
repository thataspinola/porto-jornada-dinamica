import type { JourneyDefinition } from '@/validation/schemas'

type ConditionalWrapperElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'CONDITIONAL_WRAPPER' }
>

export type ConditionalWrapperElementProps = {
  element: ConditionalWrapperElementType
}
