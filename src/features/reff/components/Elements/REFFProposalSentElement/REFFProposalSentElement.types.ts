import type { JourneyDefinition } from '@/validation/schemas/journey.schema'

type REFFProposalSentElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'REFF_PROPOSAL_SENT' }
>

export type REFFProposalSentElementProps = {
  element: REFFProposalSentElementType
}
