import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'

export const socialNameElementSchema = baseElementSchema.extend({
  type: z.literal('SOCIAL_NAME'),
  config: z.object({
    label: z.string().default('Nome social'),
    required: z.boolean().default(false),
    name: z.string().default('socialName'),
    defaultValueFrom: z.any().optional(),
  }),
})
