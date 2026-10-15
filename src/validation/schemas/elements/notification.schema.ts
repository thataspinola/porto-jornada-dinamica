import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { iconNameSchema } from './icon.schema'

export const notificationElementSchema = baseElementSchema.extend({
  type: z.literal('NOTIFICATION'),
  config: z.object({
    text: z.string(),
    icon: iconNameSchema,
    iconSize: z.number().int().positive().optional(),
    variant: z
      .enum(['default', 'information', 'warning', 'success', 'danger'])
      .optional(),
    styles: z.enum(['stroke', 'filled', 'flat']).optional(),
  }),
})
