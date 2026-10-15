import { z } from 'zod'

import { tagVariants } from '@/components/UI/Tag/Tag'

import { baseElementSchema } from './baseElement.schema'
import { iconNameSchema } from './icon.schema'

export const miniBannerHighlightElementSchema = baseElementSchema.extend({
  type: z.literal('MINI_BANNER_HIGHLIGHT'),
  config: z.object({
    tagVariant: z.enum(tagVariants).optional(),
    icon: iconNameSchema.optional(),
    tagText: z.string(),
    description: z.string(),
  }),
})
