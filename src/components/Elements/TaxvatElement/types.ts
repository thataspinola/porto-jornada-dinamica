import type { JourneyDefinition } from '@/validation/schemas'

type TaxvatInputElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'TAXVAT_INPUT' }
>

export type TaxvatInputElementProps = {
  element: TaxvatInputElementType
}
