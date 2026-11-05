import type { JourneyDefinition } from '@/validation/schemas'

type REFFLicensePlateElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'REFF_PLATE_INPUT' }
>

export type REFFLicensePlateElementProps = {
  element: REFFLicensePlateElementType
}
