import type { JourneyDefinition } from '@/validation/schemas'

type ServiceCallElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'SERVICE_CALL' }
>

export type ServiceCallElementProps = {
  element: ServiceCallElementType
}
