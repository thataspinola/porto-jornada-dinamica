import type { JourneyDefinition } from '@/validation/schemas'

type AddressRadioElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'ADDRESS_RADIO' }
>

export type AddressRadioElementProps = {
  element: AddressRadioElementType
}
