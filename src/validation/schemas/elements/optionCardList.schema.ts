import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'

const optionCardIconSchema = z.object({
  icon: z.string(),
  color: z.string().optional(),
})

const optionCardSchema = z.object({
  icon: optionCardIconSchema,
  title: z.string(),
  description: z.string(),
  value: z.string().optional(),
  url: z.string(),
})

export const optionCardListElementSchema = baseElementSchema.extend({
  type: z.literal('OPTION_CARD_LIST'),
  config: z.object({
    name: z.string().optional(),
    options: z.array(optionCardSchema).optional().default([]),
  }),
})
