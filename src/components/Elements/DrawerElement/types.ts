import type { JourneyDefinition } from '@/validation/schemas'

type DrawerElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'DRAWER' }
>

export type DrawerElementProps = {
  element: DrawerElementType
}
