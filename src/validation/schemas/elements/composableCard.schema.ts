import { z } from 'zod'

import { analyticsSchema } from './analytics.schema'
import { baseElementSchema } from './baseElement.schema'
import { iconElementSchema } from './icon.schema'
import { navigationElementSchema } from './navigation.schema'
import { textElementSchema } from './text.schema'

const composableCardChildElementSchema = z.discriminatedUnion('type', [
  iconElementSchema,
  textElementSchema,
  navigationElementSchema,
])

const composableCardChildSchema = z.object({
  id: z.string(),
  element: composableCardChildElementSchema,
})

export const composableCardElementSchema = baseElementSchema.extend({
  type: z.literal('COMPOSABLE_CARD'),
  config: z.object({
    url: z.string().optional(),
    children: z.array(composableCardChildSchema).min(1),
    analytics: analyticsSchema,
  }),
})
