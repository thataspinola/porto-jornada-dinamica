import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'

const welcomeIconItemSchema = z.object({
  title: z.string(),
  iconName: z.string()
})

const iconContentListSchema = z.object({
  items: z.array(welcomeIconItemSchema).optional().default([])
})

export const welcomeElementSchema = baseElementSchema.extend({
  type: z.literal('WELCOME'),
  config: z.object({
    title: z.string(),
    titlePartToHighlight: z.string().optional(),
    subtitle: z.string().optional(),
    iconContentList: iconContentListSchema.optional()
  })
})
