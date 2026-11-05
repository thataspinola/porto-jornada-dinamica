import { z } from 'zod'

import { analyticsSchema } from './analytics.schema'
import { baseElementSchema } from './baseElement.schema'

const chipsOptionSchema = z.object({
  label: z.string(),
  value: z.string()
})

export const chipsElementSchema = baseElementSchema.extend({
  type: z.literal('CHIPS'),
  config: z.object({
    defaultValue: z.string().default(''),
    defaultValueFrom: z.any().optional(),
    required: z.boolean().default(false),
    options: z.array(chipsOptionSchema),
    name: z.string(),
    analytics: analyticsSchema
  })
})
