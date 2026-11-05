import type { JourneyDefinition } from '@/validation/schemas/journey.schema'

type ConfirmNavigationButtonElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'CONFIRM_NAVIGATION_BUTTON' }
>

export type ConfirmNavigationButtonElementProps = {
  element: ConfirmNavigationButtonElementType
}
