import type { JourneyDefinition } from '@/validation/schemas'

type MarketingOptinElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'MARKETING_OPTIN' }
>

export type MarketingOptinElementProps = {
  element: MarketingOptinElementType
}
