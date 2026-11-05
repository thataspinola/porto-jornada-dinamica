import type { JourneyDefinition } from '@/validation/schemas'

export type LabelValueElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'LABEL_VALUE' }
>

export type LabelValueElementProps = {
  element: LabelValueElementType
}
