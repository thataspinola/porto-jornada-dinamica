import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'

export const priceSelectorElementSchema = baseElementSchema.extend({
  type: z.literal('PRICE_SELECTOR'),
  config: z.object({
    name: z.string(),
    min: z.number(),
    max: z.number(),
    step: z.number(),
    defaultValue: z.number().optional()
  })
})
