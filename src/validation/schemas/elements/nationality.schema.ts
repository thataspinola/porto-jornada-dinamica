import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'

export const nationalityElementSchema = baseElementSchema.extend({
  type: z.literal('NATIONALITY'),
  config: z.object({
    name: z.string().default('nationality'),
    label: z.string().default('Nacionalidade'),
    required: z.boolean().default(false)
  })
})
