import type { JourneyDefinition } from '@/validation/schemas'

export type JourneyStep = JourneyDefinition['steps'][number]
export type JourneyElement = JourneyStep['elements'][number]
export type PendingAction = Extract<
  JourneyElement,
  { type: 'SERVICE_CALL' }
>['config']

export type JourneyStepFormContextValue = {
  requestAction: (action: PendingAction) => void
  activeAction: PendingAction | null
  activeServiceIndex: number
  isMutationPending: boolean
  formId: string
  commitFields: () => void
  navigateTo: (slugOrUrl: string) => void
  isStepComplete: boolean
  stepTitle: string
}
