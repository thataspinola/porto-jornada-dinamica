import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'

export const maritalStatusElementSchema = baseElementSchema.extend({
  type: z.literal('MARITAL_STATUS'),
  config: z.object({
    name: z.string().default('maritalStatus'),
    label: z.string().default('Estado civil'),
    required: z.boolean().default(false)
  })
})
