import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { analyticsSchema } from './analytics.schema'

const chipsImageOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
  image: z.string(),
  description: z.string().optional(),
  tooltip: z.string().optional(),
})

export const chipsImageElementSchema = baseElementSchema.extend({
  type: z.literal('CHIPS_IMAGE'),
  config: z.object({
    defaultValue: z.string().default(''),
    defaultValueFrom: z.any().optional(),
    required: z.boolean().default(false),
    variant: z.enum(['vertical', 'horizontal']).default('vertical'),
    options: z.array(chipsImageOptionSchema),
    name: z.string(),
    analyticsSchema: analyticsSchema,
  }),
})
