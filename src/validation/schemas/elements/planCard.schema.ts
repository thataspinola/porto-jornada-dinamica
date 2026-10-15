import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'

export const planCardElementSchema = baseElementSchema.extend({
  type: z.literal('PLAN_CARD'),
  config: z.object({
    name: z.string(),
    sourcePath: z.string(),
    drawerSlugPrefix: z.string().default('cobertura'),
    returnUrl: z.string(),
    productTitle: z.string().optional(),
    productSuffix: z.string().optional(),
    itemListName: z.string().optional(),
    itemListId: z.string().optional(),
    discount: z.number().optional(),
  }),
})
