import type { JourneyDefinition } from '@/validation/schemas'

type WelcomeElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'WELCOME' }
>

export type WelcomeElementProps = {
  element: WelcomeElementType
}
