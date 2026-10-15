import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'

const iconContentItemSchema = z.object({
  icon: z.object({
    icon: z.string(),
    color: z.string().optional(),
  }),
  title: z.string(),
  description: z.string().optional(),
})

export const iconContentListElementSchema = baseElementSchema.extend({
  type: z.literal('ICON_CONTENT_LIST'),
  config: z.object({
    items: z.array(iconContentItemSchema).optional().default([]),
    divider: z.boolean().optional().default(false),
  }),
})
