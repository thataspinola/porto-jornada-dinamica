import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { analyticsSchema } from './analytics.schema'

const chipsOptionsSchema = z.object({
  label: z.string(),
  value: z.string(),
})

export const chipsElementSchema = baseElementSchema.extend({
  type: z.literal('CHIPS'),
  config: z.object({
    defaultValue: z.string().default(''),
    defaultValueFrom: z.any().optional(),
    required: z.boolean().default(false),
    options: z.array(chipsOptionsSchema),
    name: z.string(),
    analytics: analyticsSchema,
  }),
})
