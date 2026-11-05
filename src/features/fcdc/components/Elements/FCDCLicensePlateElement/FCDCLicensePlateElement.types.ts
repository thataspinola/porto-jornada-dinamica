import type { JourneyDefinition } from '@/validation/schemas'

type FCDCLicensePlateElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'FCDC_PLATE_INPUT' }
>

export type FCDCLicensePlateElementProps = {
  element: FCDCLicensePlateElementType
}
