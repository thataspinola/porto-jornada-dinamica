import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'

export const biologicalSexElementSchema = baseElementSchema.extend({
  type: z.literal('BIOLOGICAL_SEX'),
  config: z.object({
    name: z.string().default('biologicalGender'),
    label: z.string().default('Sexo biológico'),
    required: z.boolean().default(false),
    showIntersex: z.boolean().default(true)
  })
})
