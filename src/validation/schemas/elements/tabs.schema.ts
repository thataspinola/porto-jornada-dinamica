import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { priceSelectorElementSchema } from './priceSelector.schema'

const tabsChildSchema = z.discriminatedUnion('type', [
  priceSelectorElementSchema
])

const tabItemSchema = z.object({
  label: z.string(),
  value: z.string().optional(),
  children: z.array(tabsChildSchema).optional()
})

export const tabsElementSchema = baseElementSchema.extend({
  type: z.literal('TABS'),
  config: z.object({
    name: z.string().optional(),
    items: z.array(tabItemSchema).min(1)
  })
})
