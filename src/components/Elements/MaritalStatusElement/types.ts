import type { JourneyDefinition } from '@/validation/schemas'

type MaritalStatusElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'MARITAL_STATUS' }
>

export type MaritalStatusElementProps = {
  element: MaritalStatusElementType
}
