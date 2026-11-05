import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'

export const summaryProductCardElementSchema = baseElementSchema.extend({
  type: z.literal('SUMMARY_PRODUCT_CARD'),
  config: z.object({
    name: z.string(),
    sourcePath: z.string(),
    productTitle: z.string(),
    productSuffix: z.string().optional(),
    changePlanUrl: z.string(),
    defaultPerField: z
      .record(z.string(), z.record(z.string(), z.string()))
      .optional(),
    coverageLabel: z.string().default('Ver coberturas'),
    drawerSlug: z.string().default('cobertura'),
    itemListName: z.string().optional(),
    itemListId: z.string().optional(),
    discount: z.number().optional()
  })
})
