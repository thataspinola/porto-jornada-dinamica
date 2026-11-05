import type { JourneyDefinition } from '@/validation/schemas'

type NotificationElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'NOTIFICATION' }
>

export type NotificationElementProps = {
  element: NotificationElementType
}
