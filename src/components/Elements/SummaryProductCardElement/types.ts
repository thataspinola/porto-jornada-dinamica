import type { JourneyDefinition } from '@/validation/schemas'

export type SummaryProductCardElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'SUMMARY_PRODUCT_CARD' }
>

export type SummaryProductCardDefaultPerField =
  SummaryProductCardElementType['config']['defaultPerField']

export type SummaryProductCardElementProps = {
  element: SummaryProductCardElementType
}
