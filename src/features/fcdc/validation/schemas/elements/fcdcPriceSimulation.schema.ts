import { z } from 'zod'

import { baseElementSchema } from '@/validation/schemas/elements/baseElement.schema'

export const fcdcPriceSimulationElementSchema = baseElementSchema.extend({
  type: z.literal('FCDC_PRICE_SIMULATION'),
  config: z.object({
    preApprovedCreditTitle: z.string().optional(),
    preApprovedCreditLabel: z.string().optional(),
    name: z.string().optional()
  })
})
