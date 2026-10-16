import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'

export const occupationElementSchema = baseElementSchema.extend({
  type: z.literal('OCCUPATION'),
  config: z.object({
    name: z.string().default('occupationCode'),
    required: z.boolean().default(false),
    professionsRequiredFor: z.array(z.string()).default([]),
  }),
})
