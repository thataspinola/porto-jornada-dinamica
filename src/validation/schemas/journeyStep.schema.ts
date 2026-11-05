import { z } from 'zod'

import { journeyElementSchema } from './journeyElement.schema'
import { prefetchSchema } from './prefetch.schema'

export const journeyStepSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  order: z.number().optional(),
  contentWidth: z.enum(['grid', 'fit']).optional(),
  gridColumn: z.enum(['1/13', '3/11', '4/10', '5/9']).optional(),
  showProgressBar: z.boolean().optional().default(true),
  mobileBg: z.enum(['seguro-900']).optional(),
  progress: z
    .object({
      initialValue: z.number(),
      value: z.number()
    })
    .optional(),
  prefetch: z
    .union([prefetchSchema, z.array(prefetchSchema).min(1)])
    .optional(),
  elements: z.array(journeyElementSchema),
  empty: z.boolean().optional().default(false),
  backStepSlug: z.string().optional().default('')
})
