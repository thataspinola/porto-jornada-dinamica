import type { JourneyDefinition } from '@/validation/schemas/journey.schema'

type FCDCUnknownLicensePlateElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'FCDC_UNKNOWN_PLATE' }
>

export type FCDCUnknownLicensePlateElementProps = {
  element: FCDCUnknownLicensePlateElementType
}
