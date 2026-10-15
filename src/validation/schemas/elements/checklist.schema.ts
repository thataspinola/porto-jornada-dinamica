import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'

export const checklistElementSchema = baseElementSchema.extend({
  type: z.literal('CHECKLIST'),
  config: z.object({
    items: z.array(z.string()).default([]),
  }),
})
