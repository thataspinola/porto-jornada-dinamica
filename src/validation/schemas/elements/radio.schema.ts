import { z } from 'zod'
import { baseElementSchema } from './baseElement.schema'

export const radioOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
  description: z.string().optional(),
})

export const radioElementSchema = baseElementSchema.extend({
  type: z.literal('RADIO'),
  config: z.object({
    defaultValue: z.string().default(''),
    label: z.string(),
    required: z.boolean().default(false),
    options: z.array(radioOptionSchema),
    name: z.string(),
    variant: z.enum(['default', 'bordered', 'contained']).default('default'),
    backgroundColor: z.string().optional(),
  }),
})
