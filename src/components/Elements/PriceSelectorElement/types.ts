import type { JourneyDefinition } from '@/validation/schemas'

type PriceSelectorElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'PRICE_SELECTOR' }
>

export type PriceSelectorElementProps = {
  element: PriceSelectorElementType
}
