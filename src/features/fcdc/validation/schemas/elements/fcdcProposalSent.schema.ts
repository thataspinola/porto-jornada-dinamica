import { z } from 'zod'

import { baseElementSchema } from '@/validation/schemas/elements/baseElement.schema'

export const fcdcProposalSentElementSchema = baseElementSchema.extend({
  type: z.literal('FCDC_PROPOSAL_SENT'),
  config: z.object()
})
