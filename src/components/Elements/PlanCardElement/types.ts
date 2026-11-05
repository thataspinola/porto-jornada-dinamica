import type { JourneyDefinition } from '@/validation/schemas'

type PlanCardElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'PLAN_CARD' }
>

export type PlanCardElementProps = {
  element: PlanCardElementType
}
