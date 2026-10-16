import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'
import { iconNameSchema } from './icon.schema'

export const miniBannerHighlightElementSchema = baseElementSchema.extend({
  type: z.literal('MINI_BANNER_HIGHLIGHT'),
  config: z.object({
    tagVariant: z.string().min(1).optional(),
    icon: iconNameSchema.optional(),
    tagText: z.string(),
    description: z.string(),
  }),
})
