import { z } from 'zod'

import { baseElementSchema } from '@/validation/schemas/elements/baseElement.schema'

export const reffProposalSentElementSchema = baseElementSchema.extend({
  type: z.literal('REFF_PROPOSAL_SENT'),
  config: z.object()
})
