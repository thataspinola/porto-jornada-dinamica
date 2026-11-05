import type { JourneyDefinition } from '@/validation/schemas'

export type FormValues = Record<string, unknown>

type PrivacyPolicyElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'PRIVACY_POLICY' }
>

export type PrivacyPolicyElementProps = {
  element: PrivacyPolicyElementType
}
