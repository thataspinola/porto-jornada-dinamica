import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { iconNameSchema } from './icon.schema'

const labelValueSchema = z.object({
  label: z.string(),
  value: z.string(),
})

export const productCardConsorcioElementSchema = baseElementSchema.extend({
  type: z.literal('PRODUCT_CARD_CONSORCIO'),
  config: z.object({
    badge: z.string().optional(),
    label: z.string().optional(),
    value: z.string,
    tag: z
      .object({
        text: z.string(),
        variant: z.string().min(1).optional(),
      })
      .optional(),
    info: z
      .object({
        text: z.string(),
        icon: iconNameSchema.optional(),
      })
      .optional(),
    highlight: labelValueSchema.optional(),
    details: z.array(labelValueSchema).optional(),
  }),
})
