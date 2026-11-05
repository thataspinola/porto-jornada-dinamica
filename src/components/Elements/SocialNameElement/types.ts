import type { JourneyDefinition } from '@/validation/schemas'

export type FormValues = Record<string, unknown>

export type SocialNameElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'SOCIAL_NAME' }
>

export type SocialNameElementProps = {
  element: SocialNameElementType
}
