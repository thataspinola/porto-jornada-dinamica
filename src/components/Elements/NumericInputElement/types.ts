import type { JourneyDefinition } from '@/validation/schemas'

type NumericInputElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'NUMERIC_INPUT' }
>

export type NumericInputElementProps = {
  element: NumericInputElementType
}
