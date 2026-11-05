import type { JourneyDefinition } from '@/validation/schemas/journey.schema'

type FCDCProposalSentElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'FCDC_PROPOSAL_SENT' }
>

export type FCDCProposalSentElementProps = {
  element: FCDCProposalSentElementType
}
